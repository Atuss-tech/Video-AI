import { spawn } from "child_process";
import http from "http";
import fs from "fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9343;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const chrome = spawn(CHROME_PATH, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${PORT}`,
    "--user-data-dir=f:\\Video AI\\out\\chrome_multi_channel_fresh",
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
  const capturedResponses = [];

  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)(m.result);
      pending.delete(m.id);
    }
    if (m.method === "Network.responseReceived") {
      const url = m.params.response.url;
      if (url.includes("trends/api/widgetdata/multiline") || url.includes("creativecenter")) {
        capturedResponses.push({ requestId: m.params.requestId, url });
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

  // 1. GOOGLE TRENDS VIỆT NAM (12 THÁNG QUA)
  console.log("=== 1. ĐO LƯỜNG GOOGLE TRENDS VIỆT NAM ===");
  const gtExploreUrl = "https://trends.google.com/trends/explore?geo=VN&q=n8n,t%E1%BB%B1%20%C4%91%E1%BB%99ng%20h%C3%B3a,thi%E1%BA%BFt%20k%E1%BA%BF%20website,l%C3%A0m%20web%20app&hl=vi";
  await send("Page.navigate", { url: gtExploreUrl });
  await sleep(7500);

  let trendsData = null;
  for (const cap of capturedResponses) {
    if (cap.url.includes("trends/api/widgetdata/multiline")) {
      const bodyRes = await send("Network.getResponseBody", { requestId: cap.requestId });
      if (bodyRes?.body) {
        try {
          const raw = bodyRes.body.replace(/^\)\]\}'\n/, "");
          trendsData = JSON.parse(raw);
          break;
        } catch (e) {}
      }
    }
  }

  const gtReport = {
    url: gtExploreUrl,
    averages: {},
    timeline: []
  };

  if (trendsData) {
    const avgs = trendsData?.default?.averages || [];
    const terms = ["n8n", "tự động hóa", "thiết kế website", "làm web app"];
    terms.forEach((t, i) => {
      gtReport.averages[t] = avgs[i] ?? "N/A";
    });
    console.log("Google Trends Averages (0-100):", gtReport.averages);
  } else {
    console.log("Could not intercept trends json, falling back to URL proof.");
  }

  // 2. GOOGLE ADS TRANSPARENCY CENTER (TRUNG TÂM MINH BẠCH QUẢNG CÁO GOOGLE / YOUTUBE VN)
  console.log("\n=== 2. GOOGLE ADS TRANSPARENCY CENTER ===");
  const gAdsUrl = "https://adstransparency.google.com/?region=VN";
  await send("Page.navigate", { url: gAdsUrl });
  await sleep(5000);
  const gAdsTitle = await send("Runtime.evaluate", {
    expression: "document.title"
  });
  console.log("Google Ads Transparency Center Title:", gAdsTitle?.result?.value);

  // 3. TIKTOK CREATIVE CENTER TOP ADS VIỆT NAM
  console.log("\n=== 3. TIKTOK CREATIVE CENTER VIỆT NAM ===");
  const ttUrl = "https://ads.tiktok.com/business/creativecenter/inspiration/topads/pc/en?region=VN";
  await send("Page.navigate", { url: ttUrl });
  await sleep(6000);
  const ttTitle = await send("Runtime.evaluate", {
    expression: "document.title"
  });
  console.log("TikTok Creative Center Title:", ttTitle?.result?.value);

  fs.writeFileSync("f:\\Video AI\\out\\multi_channel_fresh.json", JSON.stringify({
    googleTrends: gtReport,
    googleAdsTransparency: gAdsUrl,
    tiktokCreativeCenter: ttUrl
  }, null, 2));

  ws.close();
  chrome.kill();
  console.log("Scrape completed!");
}

main().catch(console.error);
