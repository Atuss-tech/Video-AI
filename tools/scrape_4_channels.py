import sys
import json
import urllib.request
import urllib.parse
import re

sys.stdout.reconfigure(encoding="utf-8")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8",
}

def check_google_trends_vn():
    print("=======================================================")
    print("1. GOOGLE TRENDS VIỆT NAM (So sánh độ nóng thực tế 12 tháng qua)")
    print("=======================================================")
    # Use Google Trends internal widget token API
    terms = ["n8n", "zalo oa", "chatbot", "thiết kế website", "crm"]
    comparison_item = [{"keyword": t, "geo": "VN", "time": "today 12-m"} for t in terms]
    req_obj = {"comparisonItem": comparison_item, "category": 0, "property": ""}
    
    # Step 1: get cookie & token from trends.google.com/trends/api/explore
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor())
    opener.addheaders = [(k, v) for k, v in HEADERS.items()]
    try:
        opener.open("https://trends.google.com.vn/trends/?geo=VN", timeout=10)
    except Exception:
        pass
    
    explore_url = (
        "https://trends.google.com/trends/api/explore?hl=vi&tz=-420&req="
        + urllib.parse.quote(json.dumps(req_obj))
    )
    try:
        resp = opener.open(explore_url, timeout=15).read().decode("utf-8", errors="ignore")
        json_str = resp.lstrip(")]}',\n")
        data = json.loads(json_str)
        widgets = data.get("widgets", [])
        for w in widgets:
            if w.get("id") == "TIMESERIES":
                token = w["token"]
                req_ts = w["request"]
                ts_url = (
                    "https://trends.google.com/trends/api/widgetdata/multiline?hl=vi&tz=-420&req="
                    + urllib.parse.quote(json.dumps(req_ts))
                    + "&token="
                    + urllib.parse.quote(token)
                )
                ts_resp = opener.open(ts_url, timeout=15).read().decode("utf-8", errors="ignore")
                ts_data = json.loads(ts_resp.lstrip(")]}',\n"))
                averages = ts_data.get("default", {}).get("averages", [])
                timeline = ts_data.get("default", {}).get("timelineData", [])
                print("Điểm trung bình 12 tháng qua tại VN (Thang 0-100):")
                for idx, t in enumerate(terms):
                    avg_val = averages[idx] if idx < len(averages) else "N/A"
                    recent_val = timeline[-1]["value"][idx] if timeline else "N/A"
                    first_val = timeline[0]["value"][idx] if timeline else "N/A"
                    print(f"  - '{t}': Trung bình 12 tháng = {avg_val} | Đầu năm = {first_val} -> Hiện tại = {recent_val}")
                break
    except Exception as e:
        print("Google Trends API error:", e)

if __name__ == "__main__":
    check_google_trends_vn()
