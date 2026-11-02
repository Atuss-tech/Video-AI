import { spawn } from "child_process";
import http from "http";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9347;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const chrome = spawn(CHROME_PATH, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${PORT}`,
    "--user-data-dir=f:\\Video AI\\out\\chrome_gt_details",
    "about:blank",
  ]);

  await sleep(2000);
  const targets = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${PORT}/json/list`, (res) => {
      let d = "";
      res.on("data", (c) => (d += c));
      res.on("end", () => resolve(JSON.parse(d)));
    }).on("error", reject);
  });

  const page = targets.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();
  let multilineBody = null;

  ws.onmessage = async (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)(m.result);
      pending.delete(m.id);
    }
    if (m.method === "Network.responseReceived") {
      const url = m.params.response.url;
      if (url.includes("trends/api/widgetdata/multiline")) {
        // fetch body
        setTimeout(async () => {
          try {
            const bodyRes = await send("Network.getResponseBody", { requestId: m.params.requestId });
            if (bodyRes?.body) {
              multilineBody = bodyRes.body;
            }
          } catch(err) {}
        }, 1000);
      }
    }
  };

  const send = (method, params = {}) =>
    new Promise((r) => {
      const cur = id++;
      pending.set(cur, r);
      ws.send(JSON.stringify({ id: cur, method, params }));
    });

  await new Promise((r) => (ws.onopen = r));
  await send("Page.enable");
  await send("Network.enable");
  await send("Runtime.enable");

  const url = "https://trends.google.com/trends/explore?geo=VN&q=n8n,t%E1%BB%B1%20%C4%91%E1%BB%99ng%20h%C3%B3a,thi%E1%BA%BFt%20k%E1%BA%BF%20website,web%20app&hl=vi";
  await send("Page.navigate", { url });
  await sleep(8000);

  if (multilineBody) {
    const clean = multilineBody.replace(/^\)\]\}'\n/, "");
    const parsed = JSON.parse(clean);
    console.log("Averages:", parsed?.default?.averages);
    const timeline = parsed?.default?.timelineData || [];
    console.log("Total timeline points:", timeline.length);
    console.log("First point:", timeline[0]);
    console.log("Last point:", timeline[timeline.length - 1]);
  } else {
    console.log("No multiline intercepted, getting DOM text...");
    const dom = await send("Runtime.evaluate", {
      expression: `(() => {
        return {
          title: document.title,
          text: document.body.innerText.slice(0, 2000)
        };
      })()`,
      returnByValue: true
    });
    console.log(dom.result.value);
  }

  ws.close();
  chrome.kill();
}

main().catch(console.error);
