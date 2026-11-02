import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Commercial intent modifiers used in Google Ads research
intents = [
    "dịch vụ",
    "chi phí",
    "báo giá",
    "phần mềm",
    "công cụ",
    "hướng dẫn",
    "khóa học",
    "mẫu",
    "thuê",
    "tốt nhất"
]

core_topics = [
    "tự động hóa",
    "tự động hóa quy trình",
    "n8n",
    "website",
    "web app",
    "ai cho doanh nghiệp"
]

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

all_results = {}

for topic in core_topics:
    all_results[topic] = []
    seen = set()
    # Direct search
    for s, sc in query_google(topic):
        if s not in seen and sc > 500:
            seen.add(s)
            all_results[topic].append({"query": s, "score": sc, "intent": "Nhu cầu chung"})
    # Intent modifiers
    for mod in intents:
        q = f"{mod} {topic}"
        for s, sc in query_google(q):
            if s not in seen and sc > 500:
                seen.add(s)
                all_results[topic].append({"query": s, "score": sc, "intent": mod})
        q_rev = f"{topic} {mod}"
        for s, sc in query_google(q_rev):
            if s not in seen and sc > 500:
                seen.add(s)
                all_results[topic].append({"query": s, "score": sc, "intent": mod})

    # Sort by score descending
    all_results[topic].sort(key=lambda x: x["score"], reverse=True)
    print(f"\n=================== TOP GOOGLE ADS SEARCH INTENT: [{topic.upper()}] ===================")
    for idx, item in enumerate(all_results[topic][:8]):
        print(f"  {idx+1}. {item['query']} [Điểm: {item['score']} | Ý định: {item['intent']}]")

with open("f:\\Video AI\\out\\google_ads_intent_keywords.json", "w", encoding="utf-8") as f:
    json.dump(all_results, f, ensure_ascii=False, indent=2)
