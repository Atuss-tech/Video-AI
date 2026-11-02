import { spawn } from "child_process";
import http from "http";
import fs from "fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9338;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const chrome = spawn(CHROME_PATH, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${PORT}`,
    "--user-data-dir=f:\\Video AI\\out\\chrome_profile_verify_ads",
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

  const testUrl = "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=VN&q=n8n&search_type=keyword_unordered&media_type=all";
  console.log("Navigating to:", testUrl);
  await send("Page.navigate", { url: testUrl });
  await sleep(8000);

  const evalRes = await send("Runtime.evaluate", {
    expression: `(() => {
      return {
        title: document.title,
        url: window.location.href,
        textPreview: document.body.innerText.slice(0, 3000),
        links: Array.from(document.querySelectorAll('a')).map(a => ({ href: a.href, text: a.innerText.trim() })).filter(a => a.href.includes('ads/library') || a.href.includes('facebook.com'))
      };
    })()`,
    returnByValue: true
  });

  console.log("Title:", evalRes.result.value.title);
  console.log("Current URL:", evalRes.result.value.url);
  console.log("\n--- TEXT PREVIEW ---");
  console.log(evalRes.result.value.textPreview);

  fs.writeFileSync("f:\\Video AI\\out\\meta_scraped.json", JSON.stringify(evalRes.result.value, null, 2));

  ws.close();
  chrome.kill();
}

main().catch(console.error);
