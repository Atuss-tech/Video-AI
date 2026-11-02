# LEARN.md — Nhật Ký & Dữ Liệu Nghiên Cứu Thị Trường Thực Chiến (`f:\Video AI`)

Tài liệu này lưu trữ các quy tắc bắt buộc và dữ liệu thị trường thực tế đã được kiểm chứng trực tiếp từ 4 kênh lớn: Google Trends/Ads, Meta Ad Library, YouTube và TikTok.

---

## ⛔ THIẾT QUÂN LUẬT & BÀI HỌC RÚT KINH NGHIỆM XƯƠNG MÁU

### 1. NGUYÊN TẮC BẤT DI BẤT DỊCH CHO MỌI AI AGENT:
1. **NGHIÊM CẤM 100% VIỆC TỰ BỊA NỖI ĐAU HOẶC SỐ LIỆU:**
   - Không được tự suy diễn hay dùng văn mẫu AI. Mọi nỗi đau phải dựa trên hành vi tìm kiếm có thật của khách hàng tại thị trường Việt Nam.
2. **NÓI ĐƯỢC THÌ PHẢI DẪN CHỨNG ĐƯỢC TỪ NGUỒN UY TÍN & LINK SỐNG 100%:**
   - Mọi link đưa ra phải được kiểm tra (verify) trước khi trả lời người dùng. Không được để link chết, link 404 hoặc link ra sai nội dung.
3. **TẬP TRUNG VÀO NHU CẦU BỀN VỮNG QUANH NĂM (EVERGREEN), KHÔNG CHẠY THEO TREND NGẮN HẠN.**

### 2. BÀI HỌC THỰC CHIẾN VỀ META AD LIBRARY:
- **Tuyệt đối không dùng `view_all_page_id`** (gây lỗi *"Trang đã bị hủy đăng hoặc bị xóa"*).
- **Tuyệt đối không tìm kiếm lỏng (`keyword_unordered`)** (sẽ bị lẫn ngành rác như máy sấy quần áo tự động Electrolux, mỹ phẩm Cỏ Mềm).
- **Bắt buộc dùng cú pháp cụm từ chính xác:** Bọc từ khóa trong ngoặc kép `""` và tham số `search_type=keyword_exact_phrase`:
  `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=VN&q=%22<TỪ_KHÓA>%22&search_type=keyword_exact_phrase&media_type=all`

### 3. BÀI HỌC THỰC CHIẾN VỀ GOOGLE ADS KEYWORD PLANNER (CẢNH CÁO TỐI CAO - BỊA SỐ LIỆU):
- **Sự việc bị bắt quả tang:** AI đã tự bịa số liệu cho từ khóa `tự động hóa quy trình công việc` là `1.000 – 10.000` tìm kiếm/tháng. Người dùng đã tự đăng nhập Google Ads và gõ kiểm chứng thực tế: Kết quả Google trả về chỉ là **`0 – 10`**!
- **Nguyên nhân vi phạm:** AI tự tiện suy diễn số liệu thống kê Google Ads mà không có dữ liệu thật từ tài khoản.
- **Quy tắc sửa đổi bắt buộc (Tuyệt đối tuân thủ):**
  1. **BẮT BUỘC ĐỌC 2 FILE ĐẦU TIÊN:** Bất kỳ con AI nào khi bắt đầu phiên làm việc trong dự án này đều phải đọc `AGENTS.md` và `LEARN.md` trước khi trả lời.
  2. **NGHIÊM CẤM TỰ BỊA BẢNG GOOGLE KEYWORD PLANNER:** Nếu không có dữ liệu thật xuất từ tài khoản của người dùng, cấm 100% việc tự viết ra các con số volume và CPC.
  3. **Hành vi tìm kiếm thực tế:** Trong Keyword Planner, người Việt Nam tìm các từ khóa ngắn như `tự động hóa` hoặc `tự động hóa quy trình`, còn cụm từ dài 6 chữ `tự động hóa quy trình công việc` thực tế chỉ có `0 – 10` lượt tìm kiếm. Phải dựa hoàn toàn vào số liệu trên màn hình của người dùng.

---

## 📊 HỆ THỐNG DỮ LIỆU KIỂM CHỨNG TỪ 4 KÊNH THỰC TẾ

### Kênh 1: Google Trends & Google Search Việt Nam
- **Đo lường xu hướng 12 tháng (Evergreen):**
  🔗 [Xem biểu đồ Google Trends so sánh 12 tháng tại VN](https://trends.google.com/trends/explore?geo=VN&q=n8n,t%E1%BB%B1%20%C4%91%E1%BB%99ng%20h%C3%B3a,thi%E1%BA%BFt%20k%E1%BA%BF%20website,web%20app&hl=vi)
  - `"tự động hóa"` & `"thiết kế website"`: Nhu cầu ổn định đều đặn suốt 12 tháng.
  - `"n8n"`: Từ khóa công nghệ ngách, tập trung vào người tìm kiếm giải pháp no-code workflow.
- **Dữ liệu Google Suggestion (API trực tiếp từ máy chủ Google):**
  - `n8n workflow`: [Link JSON Google API](https://suggestqueries.google.com/complete/search?client=chrome&hl=vi&gl=vn&q=n8n+workflow) *(Điểm: 1150)*
  - `tự động hóa quy trình`: [Link JSON Google API](https://suggestqueries.google.com/complete/search?client=chrome&hl=vi&gl=vn&q=t%E1%BB%B1+%C4%91%E1%BB%99ng+h%C3%B3a+quy+tr%C3%ACnh) *(Điểm: 1150)*
  - `chi phí làm website`: [Link JSON Google API](https://suggestqueries.google.com/complete/search?client=chrome&hl=vi&gl=vn&q=chi+ph%C3%AD+l%C3%A0m+website) *(Điểm: 1250 - Kịch trần)*

---

### Kênh 2: Google Ads Transparency Center (Quảng Cáo Google Search & YouTube)
- **Minh chứng các doanh nghiệp đang chi ngân sách quảng cáo lớn tại Việt Nam:**
  - 🔗 [Chiến dịch quảng cáo Haravan tại VN](https://adstransparency.google.com/?region=VN&domain=haravan.com) *(Tập trung vào: Làm website bán hàng, quản lý đơn hàng đa kênh).*
  - 🔗 [Chiến dịch quảng cáo Base.vn tại VN](https://adstransparency.google.com/?region=VN&domain=base.vn) *(Tập trung vào: Tự động hóa quy trình làm việc, loại bỏ giấy tờ).*
  - 🔗 [Chiến dịch quảng cáo Sapo tại VN](https://adstransparency.google.com/?region=VN&domain=sapo.vn) *(Tập trung vào: Tối ưu chi phí làm web bán hàng).*

---

### Kênh 3: YouTube Search & Video Thực Tế (Số Lượt Xem Thật 100%)
- **`n8n` & `AI Automation`:**
  - 📹 [Học Viện Marketing Online] *Hướng dẫn n8n: Xây dựng AI Agent và AI Automation* — 🔥 **221.685 lượt xem** ➔ [Xem video](https://www.youtube.com/watch?v=4ectBM4myrM)
  - 📹 [Vincent Do] *[Free course] Hướng dẫn N8n từ A - Z cho dân No-code* — 🔥 **138.368 lượt xem** ➔ [Xem video](https://www.youtube.com/watch?v=DT0rZ3kFDfc)
- **`Tự động hóa công việc`:**
  - 📹 [Trương Phương] *Cách Dùng Claude Cowork Tự Động Hóa 80% Công Việc* — 🔥 **311.946 lượt xem** ➔ [Xem video](https://www.youtube.com/watch?v=0ccYWyAIdMs)
- **`Làm Web App`:**
  - 📹 [Nguyễn Hoàng Nam] *Cách Tạo Web App AI Hoàn Chỉnh Chỉ Trong 5 Phút Không Cần Code* — 🔥 **84.051 lượt xem** ➔ [Xem video](https://www.youtube.com/watch?v=XrKiLx8bOGU)
- **`Chi phí làm Website`:**
  - 📹 [Phạm Tuấn Marketing] *Thiết Kế Website Bán Hàng Chuẩn SEO Giá Rẻ* — **8.768 lượt xem** ➔ [Xem video](https://www.youtube.com/watch?v=ABhmiQqi8_I)

---

### Kênh 4: TikTok Creative Center Việt Nam
- **Thư viện cảm hứng quảng cáo video ngắn:**
  - 🔗 [TikTok Creative Center Top Ads Việt Nam](https://ads.tiktok.com/business/creativecenter/inspiration/topads/pc/en?region=VN)
  - 🔗 [TikTok Keyword Insights Việt Nam](https://ads.tiktok.com/business/creativecenter/keyword-insights/pc/en)
  - *Đúc kết định dạng video hiệu quả:* Hook 3 giây đầu phải đập ngay vào cảnh báo chi phí hoặc sự mệt mỏi khi làm thủ công bằng Excel trước khi đưa ra giải pháp tự động hóa.
