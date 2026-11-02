import urllib.request
import urllib.parse
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def get_yt_videos(query):
    url = f"https://www.youtube.com/results?search_query={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode("utf-8")
        
        # Extract ytInitialData
        m = re.search(r"var ytInitialData = ({.*?});</script>", html)
        if not m:
            m = re.search(r"ytInitialData\s*=\s*({.*?});", html)
        if not m:
            return []
        
        data = json.loads(m.group(1))
        contents = (data.get("contents", {})
                    .get("twoColumnSearchResultsRenderer", {})
                    .get("primaryContents", {})
                    .get("sectionListRenderer", {})
                    .get("contents", []))
        
        videos = []
        for section in contents:
            item_section = section.get("itemSectionRenderer", {}).get("contents", [])
            for item in item_section:
                vr = item.get("videoRenderer")
                if vr:
                    vid = vr.get("videoId")
                    title = vr.get("title", {}).get("runs", [{}])[0].get("text", "")
                    channel = vr.get("ownerText", {}).get("runs", [{}])[0].get("text", "")
                    views = vr.get("viewCountText", {}).get("simpleText", "")
                    if vid and title:
                        videos.append({
                            "title": title,
                            "channel": channel,
                            "views": views,
                            "link": f"https://www.youtube.com/watch?v={vid}"
                        })
                    if len(videos) >= 3:
                        return videos
        return videos
    except Exception as e:
        print(f"Error {query}: {e}")
        return []

queries = [
    "n8n workflow tiếng việt",
    "tự động hóa quy trình công việc",
    "chi phí làm website bán hàng",
    "làm web app"
]

all_proofs = {}
for q in queries:
    vids = get_yt_videos(q)
    all_proofs[q] = vids
    print(f"\n=== YOUTUBE VN DẪN CHỨNG: '{q}' ===")
    for idx, v in enumerate(vids):
        print(f"  {idx+1}. [{v['channel']}] {v['title']}")
        print(f"     Lượt xem: {v['views']}")
        print(f"     Link: {v['link']}")

with open("f:\\Video AI\\out\\youtube_verified_proofs.json", "w", encoding="utf-8") as f:
    json.dump(all_proofs, f, ensure_ascii=False, indent=2)
