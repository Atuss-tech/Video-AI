import sys
import json
import re
import urllib.request
import urllib.parse

sys.stdout.reconfigure(encoding="utf-8")

keywords = [
    "n8n tự động đăng bài facebook",
    "tự động trả lời bình luận trên facebook",
    "quản lý khách hàng bằng excel",
    "tạo hợp đồng tự động trên google sheet",
    "gửi tin nhắn zalo hàng loạt",
    "khách hỏi giá xong im lặng",
    "thiết kế website cho spa",
    "n8n zalo",
]

for kw in keywords:
    url = f"https://www.youtube.com/results?search_query={urllib.parse.quote(kw)}&hl=vi&gl=VN"
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Accept-Language": "vi-VN,vi;q=0.9",
        },
    )
    html = urllib.request.urlopen(req, timeout=15).read().decode("utf-8", errors="ignore")
    m = re.search(r"var ytInitialData = (\{.*?\});</script>", html)
    if not m:
        continue
    data = json.loads(m.group(1))
    sections = data["contents"]["twoColumnSearchResultsRenderer"]["primaryContents"]["sectionListRenderer"]["contents"]
    print(f"\n=======================================================")
    print(f"TỪ KHÓA KIỂM CHỨNG YOUTUBE VN: '{kw}'")
    print(f"=======================================================")
    count = 0
    for sec in sections:
        items = sec.get("itemSectionRenderer", {}).get("contents", [])
        for item in items:
            v = item.get("videoRenderer")
            if not v:
                continue
            title = "".join(r.get("text", "") for r in v.get("title", {}).get("runs", []))
            views = v.get("viewCountText", {}).get("simpleText", "N/A")
            if views == "N/A":
                runs = v.get("viewCountText", {}).get("runs", [])
                views = "".join(r.get("text", "") for r in runs)
            pub = v.get("publishedTimeText", {}).get("simpleText", "N/A")
            ch = v.get("ownerText", {}).get("runs", [{}])[0].get("text", "N/A")
            vid_id = v.get("videoId", "")
            print(f"  #{count+1} [{views} | {pub} | Kênh: {ch}]")
            print(f"     Tiêu đề: {title}")
            print(f"     Link: https://www.youtube.com/watch?v={vid_id}")
            count += 1
            if count >= 4:
                break
        if count >= 4:
            break
