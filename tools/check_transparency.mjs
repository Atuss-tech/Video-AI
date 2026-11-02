import { spawn } from "child_process";
import http from "http";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9345;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const chrome = spawn(CHROME_PATH, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${PORT}`,
    "--user-data-dir=f:\\Video AI\\out\\chrome_transparency",
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
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)(m.result);
      pending.delete(m.id);
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
  await send("Runtime.enable");

  // Haravan Google Ads
  const url = "https://adstransparency.google.com/?region=VN&domain=haravan.com";
  console.log("Navigating to:", url);
  await send("Page.navigate", { url });
  await sleep(7000);
  const evalRes = await send("Runtime.evaluate", {
    expression: `(() => {
      return {
        title: document.title,
        text: document.body.innerText.slice(0, 1000)
      };
    })()`,
    returnByValue: true
  });

  console.log("Title:", evalRes.result.value.title);
  console.log("Snippet:", evalRes.result.value.text.slice(0, 300));

  ws.close();
  chrome.kill();
}

main().catch(console.error);
