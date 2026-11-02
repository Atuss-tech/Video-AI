import { spawn } from "child_process";
import http from "http";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9335;

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
    "--user-data-dir=f:\\Video AI\\out\\chrome_profile_stealth",
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

  // 1. META AD LIBRARY VIETNAM (EXACT PHRASE MATCH)
  console.log("=== 1. META AD LIBRARY VIỆT NAM (QUẢNG CÁO ĐANG CHẠY THẬT THEO CỤM TỪ CHÍNH XÁC) ===");
  const adPhrases = [
    "n8n",
    "tự động hóa quy trình",
    "thiết kế website",
    "zalo oa",
    "phần mềm quản lý khách hàng",
    "chatbot chốt đơn",
  ];

  for (const phrase of adPhrases) {
    const exactQuery = `"${phrase}"`;
    const adUrl = `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=VN&q=${encodeURIComponent(exactQuery)}&search_type=keyword_exact_phrase&media_type=all`;
    await send("Page.navigate", { url: adUrl });
    await sleep(5500);
    const evalRes = await send("Runtime.evaluate", {
      expression: `(() => {
        const text = document.body.innerText;
        const countMatch = text.match(/([~0-9.,]+\\s*(kết quả|results))/i);
        // Split by Library ID blocks
        const blocks = text.split(/ID thư viện:|Library ID:/i).slice(1, 6);
        const ads = blocks.map(b => {
          const lines = b.split('\\n').map(l => l.trim()).filter(Boolean);
          const id = lines[0] || '';
          const started = lines.find(l => l.includes('Bắt đầu chạy') || l.includes('Started running')) || '';
          const spIdx = lines.findIndex(l => l === 'Được tài trợ' || l === 'Sponsored');
          const pageName = spIdx > 0 ? lines[spIdx - 1] : '';
          const copy = spIdx >= 0 ? lines.slice(spIdx + 1, spIdx + 7).join(' ') : lines.slice(1, 6).join(' ');
          return { id, started, pageName, copy: copy.slice(0, 220) };
        });
        return JSON.stringify({
          totalAds: countMatch ? countMatch[1] : '0 results',
          ads
        });
      })()`,
    });
    const info = JSON.parse(evalRes?.result?.value || "{}");
    console.log(`\n👉 Cụm từ khóa chính xác "${phrase}" -> Đang có: [${info.totalAds}] quảng cáo đang bật tại VN`);
    (info.ads || []).slice(0, 3).forEach((a, idx) => {
      console.log(`   #${idx + 1} [ID: ${a.id} | ${a.started}] Page "${a.pageName}": ${a.copy}`);
    });
  }

  // 2. GOOGLE TRENDS VIETNAM
  console.log("\n=== 2. GOOGLE TRENDS VIỆT NAM ===");
  await send("Page.navigate", { url: "https://trends.google.com/trends/?geo=VN&hl=vi" });
  await sleep(2500);
  await send("Page.navigate", {
    url: "https://trends.google.com/trends/explore?geo=VN&q=n8n,zalo%20oa,chatbot,thi%E1%BA%BFt%20k%E1%BA%BF%20website,crm&hl=vi",
  });
  await sleep(6500);

  if (capturedTrends.length > 0) {
    const cap = capturedTrends[capturedTrends.length - 1];
    const bodyRes = await send("Network.getResponseBody", { requestId: cap.requestId });
    if (bodyRes?.body) {
      const parsed = JSON.parse(bodyRes.body.replace(/^\)\]\}'\n/, ""));
      const avgs = parsed?.default?.averages || [];
      const timeline = parsed?.default?.timelineData || [];
      const terms = ["n8n", "zalo oa", "chatbot", "thiết kế website", "crm"];
      terms.forEach((t, i) => {
        const first = timeline[0]?.value?.[i] ?? "N/A";
        const last = timeline[timeline.length - 1]?.value?.[i] ?? "N/A";
        console.log(`  - "${t}": Trung bình 12 tháng = ${avgs[i]} | Đầu kỳ = ${first} -> Hiện tại = ${last}`);
      });
    }
  } else {
    const gtText = await send("Runtime.evaluate", {
      expression: `document.body.innerText.slice(0, 500).replace(/\\n+/g, ' ')`,
    });
    console.log("Google Trends DOM:", gtText?.result?.value);
  }

  // 3. TIKTOK CREATIVE CENTER VIETNAM (WITH STEALTH UA)
  console.log("\n=== 3. TIKTOK CREATIVE CENTER VIỆT NAM ===");
  await send("Page.navigate", {
    url: "https://ads.tiktok.com/business/creativecenter/keyword-insights/pc/en",
  });
  await sleep(6000);
  const ttEval = await send("Runtime.evaluate", {
    expression: `document.title + " || " + document.body.innerText.slice(0, 800).replace(/\\n+/g, ' | ')`,
  });
  console.log("TikTok Creative Center:", ttEval?.result?.value);

  ws.close();
  chrome.kill();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
