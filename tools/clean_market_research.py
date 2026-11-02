import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

targeted_queries = {
    "1. N8N (Tự động hóa Workflow)": [
        "n8n là gì",
        "n8n workflow",
        "n8n cách dùng",
        "tự học n8n",
        "chi phí mua n8n",
        "n8n kết nối zalo",
        "n8n google sheet"
    ],
    "2. AI (Ứng dụng AI thực tế)": [
        "ứng dụng ai trong công việc",
        "học ai agent",
        "ai cho doanh nghiệp",
        "công cụ ai marketing",
        "chi phí dùng ai"
    ],
    "3. TỰ ĐỘNG HÓA AI": [
        "ai tự động hóa công việc",
        "tự động hóa bằng ai",
        "tự động hóa quy trình",
        "tự động hóa bán hàng",
        "tự động hóa doanh nghiệp"
    ],
    "4. WEBSITE (Thiết kế & Vận hành Web)": [
        "chi phí làm website công ty",
        "chi phí làm website bán hàng",
        "tại sao website load chậm",
        "làm website bằng ai",
        "tự làm website bán hàng"
    ],
    "5. LÀM WEB APP (Ứng dụng quản lý/chuyên sâu)": [
        "chi phí làm web app",
        "cách làm web app",
        "ai làm web app",
        "tạo web app bằng ai",
        "web app cho doanh nghiệp"
    ]
}

def query_google(q):
    url = f"https://suggestqueries.google.com/complete/search?client=chrome&hl=vi&gl=vn&q={urllib.parse.quote(q)}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            suggs = data[1] if len(data) > 1 else []
            scores = data[4].get("google:suggestrelevance", []) if len(data) > 4 and isinstance(data[4], dict) else []
            out = []
            for i, s in enumerate(suggs):
                sc = scores[i] if i < len(scores) else 0
                out.append((s, sc))
            return out
    except Exception as e:
        return []

summary = {}

for pillar, queries in targeted_queries.items():
    print(f"\n=================== {pillar} ===================")
    summary[pillar] = []
    seen = set()
    for q in queries:
        res = query_google(q)
        for s, sc in res:
            if s not in seen and sc > 500:
                seen.add(s)
                summary[pillar].append({"query": s, "score": sc})
    # Sort
    summary[pillar].sort(key=lambda x: x["score"], reverse=True)
    for idx, item in enumerate(summary[pillar][:8]):
        print(f"  {idx+1}. {item['query']} (Điểm Google: {item['score']})")

with open("f:\\Video AI\\out\\clean_verified_market_demand.json", "w", encoding="utf-8") as f:
    json.dump(summary, f, ensure_ascii=False, indent=2)
