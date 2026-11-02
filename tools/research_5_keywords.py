import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# 5 seed keywords and their research patterns
base_keywords = [
    "n8n",
    "AI",
    "tự động hóa AI",
    "website",
    "làm web app"
]

patterns = [
    "", # direct
    "cách",
    "chi phí",
    "học",
    "tại sao",
    "lỗi",
    "cho doanh nghiệp",
    "miễn phí",
    "tự làm"
]

def get_suggestions(query):
    url = f"https://suggestqueries.google.com/complete/search?client=chrome&hl=vi&gl=vn&q={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            suggestions = data[1] if len(data) > 1 else []
            scores = data[4].get("google:suggestrelevance", []) if len(data) > 4 and isinstance(data[4], dict) else []
            results = []
            for i, s in enumerate(suggestions):
                sc = scores[i] if i < len(scores) else 0
                results.append({"query": s, "score": sc})
            return results
    except Exception as e:
        return []

full_data = {}

for base in base_keywords:
    full_data[base] = []
    seen = set()
    for p in patterns:
        q = f"{p} {base}".strip() if p else base
        suggs = get_suggestions(q)
        for item in suggs:
            if item["query"] not in seen:
                seen.add(item["query"])
                full_data[base].append(item)

# Sort by score descending
for base in base_keywords:
    full_data[base].sort(key=lambda x: x["score"], reverse=True)
    print(f"\n==================== [{base.upper()}] (Top 10 Nhu cầu gõ nhiều nhất) ====================")
    for idx, item in enumerate(full_data[base][:10]):
        print(f"  {idx+1}. {item['query']} (Điểm Google: {item['score']})")

with open("f:\\Video AI\\out\\research_5_keywords.json", "w", encoding="utf-8") as f:
    json.dump(full_data, f, ensure_ascii=False, indent=2)

print("\nDone! Saved to f:\\Video AI\\out\\research_5_keywords.json")
