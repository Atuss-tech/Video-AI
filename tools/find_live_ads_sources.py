import urllib.request
import urllib.parse
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Search Google directly for articles reporting Google Ads benchmarks in VN
queries = [
    "báo cáo chi phí google ads ngành phần mềm website cpc",
    "giá thầu cpc google ads thiết kế website"
]

for q in queries:
    url = f"https://www.google.com/search?q={urllib.parse.quote(q)}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            html = r.read().decode('utf-8')
        links = re.findall(r'href="(https://[^"&]+)"', html)
        valid = [l for l in links if not any(x in l for x in ['google.com', 'gstatic', 'youtube', 'schema.org'])]
        print(f"=== Results for: {q} ===")
        seen = set()
        for v in valid:
            domain = v.split('/')[2] if len(v.split('/')) > 2 else ''
            if domain and domain not in seen:
                seen.add(domain)
                # Test status
                try:
                    test_req = urllib.request.Request(v, headers={"User-Agent": "Mozilla/5.0"})
                    with urllib.request.urlopen(test_req, timeout=4) as tr:
                        print(f"  [HTTP {tr.status}] {v}")
                except Exception as err:
                    pass
    except Exception as e:
        print(f"Error {q}: {e}")
