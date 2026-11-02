import sys
import json
import urllib.request
import urllib.parse

sys.stdout.reconfigure(encoding="utf-8")

def check_google_vn_demand(keywords):
    """
    Truy vấn trực tiếp máy chủ Google Suggest Việt Nam (hl=vi, gl=vn)
    để lấy thứ tự tìm kiếm nhiều nhất và chỉ số Google Relevance Score (thang 550 -> 1250).
    """
    for q in keywords:
        url = (
            "http://suggestqueries.google.com/complete/search"
            f"?client=chrome&hl=vi&gl=vn&ie=utf-8&oe=utf-8&q={urllib.parse.quote(q)}"
        )
        req = urllib.request.urlopen(url, timeout=10)
        data = json.loads(req.read().decode("utf-8"))
        relevances = data[4].get("google:suggestrelevance", [])
        print(f"\n=== TỪ KHÓA GỐC: '{q}' ===")
        for idx, suggestion in enumerate(data[1][:8]):
            score = relevances[idx] if idx < len(relevances) else "N/A"
            print(f"  Top #{idx+1} [Google Demand Score: {score}] -> {suggestion}")

if __name__ == "__main__":
    default_seeds = [
        "phần mềm quản lý khách hàng",
        "quản lý khách hàng bằng",
        "quản lý nhân viên sale",
        "khách hỏi giá xong",
        "chạy quảng cáo không",
        "thiết kế website",
        "làm website",
        "zalo oa",
        "chatbot bán hàng",
        "n8n",
    ]
    seeds = sys.argv[1:] if len(sys.argv) > 1 else default_seeds
    check_google_vn_demand(seeds)
