import { spawn } from "child_process";
import http from "http";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9341;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const chrome = spawn(CHROME_PATH, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${PORT}`,
    "--user-data-dir=f:\\Video AI\\out\\chrome_test_exact",
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

  const testQueries = [
    '"n8n"',
    '"tự động hóa quy trình"',
    '"thiết kế website"'
  ];

  for (const q of testQueries) {
    const url = `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=VN&q=${encodeURIComponent(q)}&search_type=keyword_exact_phrase&media_type=all`;
    await send("Page.navigate", { url });
    await sleep(7000);
    const evalRes = await send("Runtime.evaluate", {
      expression: `(() => {
        const text = document.body.innerText;
        const countMatch = text.match(/([~0-9.,]+\\s*(kết quả|results))/i);
        const blocks = text.split(/ID thư viện:|Library ID:/i).slice(1, 4);
        const ads = blocks.map(b => {
          const lines = b.split('\\n').map(l => l.trim()).filter(Boolean);
          const spIdx = lines.findIndex(l => l === 'Được tài trợ' || l === 'Sponsored');
          const pageName = spIdx > 0 ? lines[spIdx - 1] : '';
          const copy = spIdx >= 0 ? lines.slice(spIdx + 1, spIdx + 5).join(' ') : lines.slice(1, 5).join(' ');
          return { pageName, copy: copy.slice(0, 150) };
        });
        return {
          query: ${JSON.stringify(q)},
          count: countMatch ? countMatch[0] : 'N/A',
          ads
        };
      })()`,
      returnByValue: true
    });
    console.log(JSON.stringify(evalRes?.result?.value, null, 2));
  }

  ws.close();
  chrome.kill();
}

main().catch(console.error);
