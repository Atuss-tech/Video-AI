import { spawn } from "child_process";
import http from "http";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9337;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

async function run() {
  const chrome = spawn(CHROME_PATH, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-blink-features=AutomationControlled",
    "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    `--remote-debugging-port=${PORT}`,
    "--user-data-dir=f:\\Video AI\\out\\chrome_profile_stealth2",
    "about:blank",
  ]);

  await sleep(2500);
  const targets = await getJson(`http://127.0.0.1:${PORT}/json/list`);
  const pageTarget = targets.find((t) => t.type === "page");
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  let msgId = 1;
  const pending = new Map();
  const capturedTrends = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
    if (msg.method === "Network.responseReceived") {
      const url = msg.params.response.url;
      if (url.includes("trends/api/widgetdata/multiline")) {
        capturedTrends.push({ requestId: msg.params.requestId, url });
      }
    }
  };

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await new Promise((r) => (ws.onopen = r));
  await send("Page.enable");
  await send("Network.enable");
  await send("Runtime.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `Object.defineProperty(navigator, 'webdriver', { get: () => undefined });`,
  });

  console.log("=== GOOGLE TRENDS VIỆT NAM (12 THÁNG QUA) ===");
  await send("Page.navigate", { url: "https://trends.google.com/trends/?geo=VN&hl=vi" });
  await sleep(2000);
  await send("Page.navigate", {
    url: "https://trends.google.com/trends/explore?geo=VN&q=n8n,zalo%20oa,chatbot,thi%E1%BA%BFt%20k%E1%BA%BF%20website,crm&hl=vi",
  });
  await sleep(6500);

  if (capturedTrends.length > 0) {
    const cap = capturedTrends[capturedTrends.length - 1];
    const bodyRes = await send("Network.getResponseBody", { requestId: cap.requestId });
    if (bodyRes?.body) {
      const raw = bodyRes.body;
      const jsonStart = raw.indexOf("{");
      const parsed = JSON.parse(raw.slice(jsonStart));
      const avgs = parsed?.default?.averages || [];
      const timeline = parsed?.default?.timelineData || [];
      const terms = ["n8n", "zalo oa", "chatbot", "thiết kế website", "crm"];
      terms.forEach((t, i) => {
        const first = timeline[0]?.value?.[i] ?? "N/A";
        const last = timeline[timeline.length - 1]?.value?.[i] ?? "N/A";
        const peak = Math.max(...timeline.map((x) => x?.value?.[i] || 0));
        console.log(`  - "${t}": Trung bình 12 tháng = ${avgs[i]} | Đỉnh = ${peak} | 1 năm trước = ${first} -> Hiện tại = ${last}`);
      });
    }
  }

  console.log("\n=== TIKTOK CREATIVE CENTER VIỆT NAM ===");
  await send("Page.navigate", {
    url: "https://ads.tiktok.com/business/creativecenter/inspiration/topads/pc/en?region=VN",
  });
  await sleep(6000);
  const ttEval = await send("Runtime.evaluate", {
    expression: `document.title + " || " + document.body.innerText.slice(0, 1000).replace(/\\n+/g, ' | ')`,
  });
  console.log("TikTok Creative Center VN:", ttEval?.result?.value);

  ws.close();
  chrome.kill();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
