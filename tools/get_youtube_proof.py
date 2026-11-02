import urllib.request
import urllib.parse
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def search_yt(q):
    url = f"https://www.youtube.com/results?search_query={urllib.parse.quote(q)}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            html = r.read().decode("utf-8")
        # Match videoId, title, viewCount
        pattern = r'"videoId":"([a-zA-Z0-9_-]{11})".*?"title":\{"runs":\[\{"text":"(.*?)"\}\]\}.*?"viewCountText":\{"simpleText":"(.*?)"\}'
        matches = re.findall(pattern, html)
        print(f"\n=== YOUTUBE DẪN CHỨNG THẬT CHO TỪ KHÓA: '{q}' ===")
        seen = set()
        count = 0
        for vid, title, views in matches:
            if vid not in seen:
                seen.add(vid)
                print(f"  {count+1}. Video: {title}")
                print(f"     Lượt xem thật: {views}")
                print(f"     Link xem trực tiếp: https://www.youtube.com/watch?v={vid}")
                count += 1
                if count >= 3:
                    break
    except Exception as e:
        print(f"Error {q}: {e}")

search_yt("n8n workflow")
search_yt("tự động hóa công việc")
search_yt("chi phí làm website")
