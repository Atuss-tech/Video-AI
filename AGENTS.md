# AGENTS.md — Quy Trình Xây Kênh & Sản Xuất Video AI (`f:\Video AI`)

Tài liệu này định nghĩa quy trình chuẩn cho AI Agent khi làm việc trong dự án `f:\Video AI` (Xây kênh & Quảng bá Dịch vụ Thiết kế Workflow Tự động hóa n8n + Website Thương hiệu).

---

## 🚨 LỆNH TỐI CAO: BẮT BUỘC ĐỌC FILE AGENTS.MD VÀ LEARN.MD TRƯỚC TIÊN!

**MỌI CON AI KHI BẮT ĐẦU CHẠY TRONG DỰ ÁN NÀY ĐỀU BẮT BUỘC PHẢI ĐỌC 2 FILE NÀY TRƯỚC KHI THỰC HIỆN BẤT KỲ LỆNH NÀO:**
1. [AGENTS.md](file:///f:/Video%20AI/AGENTS.md) — Nắm chắc Thiết quân luật và quy trình 5 bước sản xuất video.
2. [LEARN.md](file:///f:/Video%20AI/LEARN.md) — Nắm các bài học kinh nghiệm xương máu đã bị người dùng bắt quả tang và phạt (lỗi bịa số liệu, lỗi chết link, lỗi lọc sai ngành).

---

## ⛔ THIẾT QUÂN LUẬT: NGHIÊM CẤM BỊA THÔNG TIN & NÓI SUÔNG CHƯA KIỂM CHỨNG!

Mọi AI Agent (Antigravity, Claude Code, Cursor, Codex...) khi đọc tài liệu này **BẮT BUỘC TUÂN THỦ 100% CÁC ĐIỀU RĂN SAU**, tuyệt đối không có ngoại lệ:

1. **NGHIÊM CẤM TỰ BỊA NỖI ĐAU & SỐ LIỆU THỐNG KÊ:**
   - Cấm hoàn toàn việc tự suy diễn, dùng "văn mẫu AI", hoặc tự bịa ra các con số Google Ads/Keyword Planner (Ví dụ: Đã bị bắt quả tang tự bịa từ khóa `tự động hóa quy trình công việc` là "1.000 - 10.000" trong khi số thật trong Google Keyword Planner là "0 - 10").
   - Cái gì không có ảnh chụp hoặc file export trực tiếp từ tài khoản Google Ads của người dùng thì CẤM ĐƯỢC TỰ BỊA CON SỐ.
2. **NÓI ĐƯỢC THÌ PHẢI DẪN CHỨNG ĐƯỢC TỪ NGUỒN UY TÍN & LINK SỐNG 100%:**
   - Mỗi luận điểm, nỗi đau, hay con số đưa ra bắt buộc phải đi kèm **nguồn kiểm chứng chính xác**:
     - **Google Trends & Google Ads:** Đo lường chính xác mức độ quan tâm (Trends 0–100) và từ khóa có lượng tìm kiếm bền vững quanh năm (Evergreen Demand).
     - **Meta Ad Library (Facebook Ads VN):** Dùng **Link tìm kiếm cụm từ chính xác** (`q="%22<TỪ_KHÓA>%22"&search_type=keyword_exact_phrase`) để lọc chuẩn xác ngành công nghệ, loại bỏ hoàn toàn các ngành hàng rác (máy sấy quần áo, mỹ phẩm); **tuyệt đối không dùng `view_all_page_id`** để tránh lỗi chết link. Mọi link đưa ra phải được test trước.
     - **YouTube Search & YouTube Ads (Google Ads Transparency Center):** Phải có số lượt xem thật (Real Views) + Link video thực tế tại Việt Nam; hoặc dẫn chứng chiến dịch video đang chạy thật từ [Trung tâm Minh bạch Quảng cáo Google / YouTube](https://adstransparency.google.com/?region=VN).
     - **TikTok Creative Center & TikTok Ads:** Phải có dẫn chứng từ Thư viện Quảng cáo TikTok ([TikTok Creative Center Top Ads VN](https://ads.tiktok.com/business/creativecenter/inspiration/topads/pc/en?region=VN)), từ khóa thịnh hành (Trending Keywords) hoặc video có tương tác thật tại Việt Nam.
3. **ƯU TIÊN NHU CẦU QUANH NĂM (EVERGREEN), KHÔNG ĐU TREND NGẮN HẠN:**
   - Tập trung vào các bài toán cốt lõi doanh nghiệp đau đầu 12 tháng/năm (quản lý data khách, chống sót đơn Zalo/Fanpage, báo giá tự động, website chuyển đổi), tránh đu theo các trào lưu nhất thời rồi sớm thoái trào.

---

## 🎯 Công Thức Bỏ Túi: 5 Bước Xây Kênh Có Kiểm Chứng Dữ Liệu Thật

Tuyệt đối **NGHIÊM CẤM 100% tự nghĩ bừa nỗi đau**. Mọi ý tưởng và kịch bản bắt buộc phải được kiểm chứng dữ liệu thật từ **Google Trends, Google Ads, Meta Ad Library, TikTok và YouTube**:

> **Đo Lường Nhu Cầu & Dẫn Chứng Quảng Cáo Thật (`Google Trends / Ads` + `Meta Ad Library` + `YouTube`) ➔ Định vị (`product-marketing`) ➔ Lên kịch bản kênh (`social`) ➔ Gọt Hook 3s đầu (`ad-creative`) ➔ Xuất Video (`remotion`)**

### Bước 0 (BẮT BUỘC): Kiểm Chứng Dữ Liệu Thật & Dẫn Chứng Đối Thủ
- **Quy tắc bất di bất dịch:**
  1. **Google Trends & Google Ads:** Đo chính xác chỉ số xu hướng (0–100) và độ cạnh tranh/volume từ khóa. Không làm từ khóa tự suy diễn.
  2. **Meta Ad Library (Facebook Ads VN):** Quét bài quảng cáo đang chạy thật của đối thủ, trích dẫn **Link xem trực tiếp bài quảng cáo** và **Nguyên văn bài viết** làm bằng chứng kiểm chứng.
  3. **YouTube & TikTok Ads/Search:** Kiểm chứng lượt xem thật (Real Views) trên YouTube và các chiến dịch quảng cáo thực tế từ [Google Ads Transparency Center](https://adstransparency.google.com/?region=VN) & [TikTok Creative Center](https://ads.tiktok.com/business/creativecenter/inspiration/topads/pc/en?region=VN).
- **Tài liệu & Dữ liệu đã lưu:** Xem chi tiết tại [LEARN.md](file:///f:/Video%20AI/LEARN.md).

### Bước 1: Định vị kênh & Hồ sơ dữ liệu đã kiểm chứng (`product-marketing`)
- **Skill:** `C:\Users\ADMIN\.gemini\config\skills\product-marketing\SKILL.md`
- **File ngữ cảnh gốc:** `f:\Video AI\.agents\product-marketing.md`
- **Nhiệm vụ:** Lưu toàn bộ từ khóa, câu hỏi thật và bằng chứng đã quét được ở Bước 0 vào `.agents/product-marketing.md` để làm nguyên liệu gốc.

### Bước 2: Lên tuyến nội dung & Kịch bản xây kênh (`social`)
- **Skill:** `C:\Users\ADMIN\.gemini\config\skills\social\SKILL.md`
- **Tài liệu đi kèm:** `C:\Users\ADMIN\.gemini\config\skills\social\references\short-form-video.md`
- **Nhiệm vụ:** Biến từng câu hỏi trên Google/ChatGPT thành 1 video giải đáp trực diện theo văn nói tự nhiên của người Việt.

### Bước 3: Gọt câu mở đầu (Hook 0–3s) bằng chính câu hỏi tìm kiếm (`ad-creative`)
- **Skill:** `C:\Users\ADMIN\.gemini\config\skills\ad-creative\SKILL.md`
- **Tài liệu bắt buộc:** `C:\Users\ADMIN\.gemini\config\skills\ad-creative\references\hook-system.md`
- **Quy tắc Question/Search Hook (Dòng 59 `hook-system.md`):**
  - Dùng chính cụm từ khóa/câu hỏi mà khách hàng gõ vào Google hoặc ChatGPT làm câu mở đầu 3 giây đầu tiên.
  - Phối hợp 3 thành phần không trùng lặp: **Visual Action (Hình ảnh 0–3s) + Spoken Line (Lời thoại) + Caption Text (Chữ trên màn hình)**.

### Bước 4: Biến kịch bản thành Video MP4 (`remotion-best-practices` + `remotion-markup` + `remotion-captions`)
- **Skills dự án (`f:\Video AI\.agents\skills\`):**
  - `.agents/skills/remotion-best-practices/SKILL.md`
  - `.agents/skills/remotion-markup/SKILL.md`
  - `.agents/skills/remotion-captions/SKILL.md`
  - `.agents/skills/remotion-render/SKILL.md`
- **Quy trình kỹ thuật:**
  1. Tạo giọng đọc tiếng Việt (`edge-tts`) + trích xuất word timestamps bằng `faster-whisper`.
  2. Ánh xạ 100% từ gốc trong kịch bản vào timestamp để phụ đề Karaoke chuẩn chính tả 100%.
  3. Dùng ảnh chụp thực tế 100% (Photorealistic bối cảnh văn phòng Việt Nam).
  4. Giữ bố cục (Layout Grid) đồng bộ 100% xuyên suốt các cảnh.
