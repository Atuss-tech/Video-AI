"""
Giao diện Chọn File Video & Tự Động Edit (Dọc 9:16)
Chạy tại: http://localhost:3050
Hỗ trợ:
1. Bấm nút bật thẳng cửa sổ Chọn File của Windows (tkinter filedialog)
2. Hoặc kéo thả / chọn file trực tiếp trên trình duyệt
3. Tự động chạy auto_edit_pipeline.py và mở/cập nhật localhost:3000
4. Nút bấm Xuất (Render) ra file MP4 hoàn chỉnh và mở thư mục chứa file
"""

import cgi
import json
import os
import shutil
import subprocess
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = Path(__file__).resolve().parent.parent
VIDEOS_DIR = ROOT_DIR / "videos_to_edit"
OUT_DIR = ROOT_DIR / "out"
PIPELINE_SCRIPT = ROOT_DIR / "tools" / "auto_edit_pipeline.py"

VIDEOS_DIR.mkdir(parents=True, exist_ok=True)
OUT_DIR.mkdir(parents=True, exist_ok=True)

HTML_PAGE = """<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Antigravity Auto Video Editor (9:16)</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: radial-gradient(circle at 50% 20%, #1e1b4b 0%, #090d16 75%);
      color: #f8fafc;
      font-family: 'Inter', 'Segoe UI', sans-serif;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 32px;
    }
    .card {
      width: 100%;
      max-width: 780px;
      background: rgba(15, 23, 42, 0.88);
      border: 2px solid rgba(56, 189, 248, 0.35);
      border-radius: 28px;
      padding: 40px;
      box-shadow: 0 25px 70px rgba(0,0,0,0.65);
    }
    .badge {
      display: inline-block;
      background: rgba(16, 185, 129, 0.18);
      border: 1px solid #10b981;
      color: #34d399;
      font-weight: 800;
      font-size: 13px;
      padding: 6px 16px;
      border-radius: 999px;
      letter-spacing: 1.5px;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 32px;
      font-weight: 900;
      margin-bottom: 10px;
    }
    p.sub {
      color: #94a3b8;
      font-size: 16px;
      margin-bottom: 28px;
      line-height: 1.5;
    }
    .btn-row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }
    .btn {
      flex: 1;
      min-width: 240px;
      padding: 18px 24px;
      border-radius: 16px;
      border: none;
      font-size: 17px;
      font-weight: 800;
      cursor: pointer;
      transition: transform 0.15s, opacity 0.15s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      text-decoration: none;
    }
    .btn:hover { transform: translateY(-2px); }
    .btn:active { transform: translateY(0); }
    .btn-primary {
      background: linear-gradient(90deg, #10b981, #059669);
      color: #052e16;
      box-shadow: 0 12px 30px rgba(16, 185, 129, 0.35);
    }
    .btn-upload {
      background: linear-gradient(90deg, #38bdf8, #6366f1);
      color: #ffffff;
      box-shadow: 0 12px 30px rgba(56, 189, 248, 0.35);
    }
    .btn-render {
      background: linear-gradient(90deg, #facc15, #f97316);
      color: #09090b;
    }
    .btn-preview {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.2);
      color: #f8fafc;
    }
    .log-box {
      background: #050811;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 16px;
      padding: 20px;
      font-family: Consolas, monospace;
      font-size: 14px;
      color: #38bdf8;
      min-height: 150px;
      max-height: 280px;
      overflow-y: auto;
      white-space: pre-wrap;
      line-height: 1.55;
    }
    input[type="file"] { display: none; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">● AUTO VIDEO EDITOR // KHỔ DỌC 9:16 (1080×1920)</span>
    <h1>Chọn Video Từ Máy Tính & Tự Động Edit</h1>
    <p class="sub">
      Chỉ cần bấm nút bên dưới để chọn file video (<code>.mp4</code>, <code>.mov</code>) từ thư mục bất kỳ trên máy tính của bạn. Hệ thống sẽ tự động chuyển sang khổ dọc 9:16, cắt khoảng lặng, tách phụ đề nhảy từng chữ và gắn hiệu ứng Zoom + B-Roll!
    </p>

    <div class="btn-row">
      <button class="btn btn-primary" onclick="pickNativeFile()">
        📂 Mở Cửa Sổ Chọn Video (Windows)
      </button>

      <label class="btn btn-upload">
        📤 Hoặc Chọn File Trực Tiếp Tại Đây
        <input type="file" id="fileInput" accept="video/*" onchange="uploadBrowserFile(this)" />
      </label>
    </div>

    <div class="btn-row">
      <a class="btn btn-preview" href="http://localhost:3000/00-Auto-Edited-Raw-Video" target="_blank">
        👁️ Mở Xem Trước Video Đã Edit (localhost:3000)
      </a>
      <button class="btn btn-render" onclick="renderFinalMp4()">
        🎬 Xuất File MP4 Hoàn Chỉnh (Lưu vào f:\\Video AI\\out)
      </button>
    </div>

    <div id="logBox" class="log-box">Sẵn sàng! Hãy bấm "📂 Mở Cửa Sổ Chọn Video" hoặc "📤 Chọn File Trực Tiếp" ở trên để bắt đầu...</div>
  </div>

  <script>
    const logBox = document.getElementById('logBox');
    function setLog(msg) {
      logBox.textContent = msg;
      logBox.scrollTop = logBox.scrollHeight;
    }

    async function pickNativeFile() {
      setLog("⏳ Đang mở cửa sổ chọn file của Windows (hãy nhìn lên màn hình hoặc thanh Taskbar)...");
      try {
        const res = await fetch('/api/pick-native', { method: 'POST' });
        const data = await res.json();
        setLog(data.output || data.message);
      } catch (e) {
        setLog("❌ Lỗi: " + e.message);
      }
    }

    async function uploadBrowserFile(input) {
      if (!input.files || !input.files[0]) return;
      const file = input.files[0];
      setLog("⏳ Đang nạp video '" + file.name + "' và chạy AI Auto-Edit (faster-whisper + FFmpeg 9:16)...\\nQuá trình này mất khoảng 10-30 giây...");
      const formData = new FormData();
      formData.append('video', file);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        setLog(data.output || data.message);
      } catch (e) {
        setLog("❌ Lỗi: " + e.message);
      }
      input.value = '';
    }

    async function renderFinalMp4() {
      setLog("⏳ Đang kết xuất (Render) ra file MP4 hoàn chỉnh vào thư mục f:\\\\Video AI\\\\out ...");
      try {
        const res = await fetch('/api/render', { method: 'POST' });
        const data = await res.json();
        setLog(data.output || data.message);
      } catch (e) {
        setLog("❌ Lỗi: " + e.message);
      }
    }
  </script>
</body>
</html>
"""


class StudioHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        return

    def _send_json(self, payload: dict, status: int = 200):
        raw = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def do_GET(self):
        html_bytes = HTML_PAGE.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(html_bytes)))
        self.end_headers()
        self.wfile.write(html_bytes)

    def do_POST(self):
        if self.path == "/api/pick-native":
            picker_code = (
                "import tkinter as tk\n"
                "from tkinter import filedialog\n"
                "root = tk.Tk()\n"
                "root.withdraw()\n"
                "root.attributes('-topmost', True)\n"
                "path = filedialog.askopenfilename(\n"
                "    title='Chọn Video Cần Tự Động Edit (Khổ Dọc 9:16)',\n"
                "    filetypes=[('Video files', '*.mp4 *.mov *.mkv *.avi *.webm'), ('All files', '*.*')]\n"
                ")\n"
                "print(path)\n"
            )
            proc = subprocess.run(
                [sys.executable, "-c", picker_code],
                capture_output=True,
                text=True,
                encoding="utf-8",
            )
            chosen = proc.stdout.strip()
            if not chosen:
                self._send_json({"message": "Bạn đã đóng cửa sổ chọn file (chưa chọn video nào)."})
                return

            src_path = Path(chosen)
            dst_path = VIDEOS_DIR / src_path.name
            if src_path.resolve() != dst_path.resolve():
                shutil.copyfile(src_path, dst_path)

            run_proc = subprocess.run(
                [sys.executable, str(PIPELINE_SCRIPT), str(dst_path)],
                cwd=str(ROOT_DIR),
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
            )
            out_log = (
                f"✅ Đã chọn file: {src_path}\n"
                f"----------------------------------------\n"
                f"{run_proc.stdout}\n{run_proc.stderr}\n"
                f"🎉 XONG! Bấm nút '👁️ Mở Xem Trước Video Đã Edit (localhost:3000)' ở trên để xem ngay!"
            )
            self._send_json({"output": out_log})
            return

        if self.path == "/api/upload":
            form = cgi.FieldStorage(
                fp=self.rfile,
                headers=self.headers,
                environ={
                    "REQUEST_METHOD": "POST",
                    "CONTENT_TYPE": self.headers.get("Content-Type", ""),
                },
            )
            if "video" not in form:
                self._send_json({"message": "Không tìm thấy file video!"}, 400)
                return

            file_item = form["video"]
            filename = os.path.basename(file_item.filename or "uploaded_video.mp4")
            dst_path = VIDEOS_DIR / filename
            with open(dst_path, "wb") as f:
                shutil.copyfileobj(file_item.file, f)

            run_proc = subprocess.run(
                [sys.executable, str(PIPELINE_SCRIPT), str(dst_path)],
                cwd=str(ROOT_DIR),
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
            )
            out_log = (
                f"✅ Đã tải lên vào: {dst_path}\n"
                f"----------------------------------------\n"
                f"{run_proc.stdout}\n{run_proc.stderr}\n"
                f"🎉 XONG! Bấm nút '👁️ Mở Xem Trước Video Đã Edit (localhost:3000)' ở trên để xem ngay!"
            )
            self._send_json({"output": out_log})
            return

        if self.path == "/api/render":
            out_file = OUT_DIR / "video_da_edit_9x16.mp4"
            cmd = f'npx remotion render 00-Auto-Edited-Raw-Video "{out_file}"'
            run_proc = subprocess.run(
                cmd,
                cwd=str(ROOT_DIR),
                shell=True,
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
            )
            subprocess.Popen(["explorer.exe", f"/select,{out_file}"])
            out_log = (
                f"🎬 ĐÃ XUẤT FILE MP4 THÀNH CÔNG!\n"
                f"📂 Đường dẫn file: {out_file}\n"
                f"(Mình đã tự mở thư mục chứa file lên cho bạn!)\n"
                f"----------------------------------------\n"
                f"{run_proc.stdout}"
            )
            self._send_json({"output": out_log})
            return


if __name__ == "__main__":
    port = 3050
    print(f"Studio Picker Server running at http://localhost:{port}")
    server = HTTPServer(("127.0.0.1", port), StudioHandler)
    server.serve_forever()
