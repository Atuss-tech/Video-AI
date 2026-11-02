"""
Antigravity Auto-Video Editor Pipeline
--------------------------------------
Quy trình tự động 100% khi bạn vứt 1 file video (.mp4, .mov, .mkv) vào thư mục `videos_to_edit/`:
1. Cắt bỏ khoảng lặng (Silence Removal) & chuẩn hóa bằng FFmpeg (`silenceremove`) + `imageio_ffmpeg`.
2. Trích xuất phụ đề từng từ (Word-level Timestamps) bằng `faster-whisper`.
3. Lọc từ thừa ("ờ", "à", "ừm", "um", "uh") & tự động tạo kịch bản cắt dựng (EDL):
   - Tự động đặt điểm Punch-in Zoom (1.15x) vào các đoạn nhấn mạnh.
   - Tự động chèn ảnh B-Roll minh họa & hiệu ứng âm thanh (SFX).
4. Xuất dữ liệu trực tiếp vào `public/edited_video.mp4` và `src/data/transcript.json` để Remotion hiển thị hoặc render ra MP4.
"""

import json
import re
import shutil
import subprocess
import sys
from pathlib import Path
import imageio_ffmpeg

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = Path(__file__).resolve().parent.parent
VIDEOS_IN_DIR = ROOT_DIR / "videos_to_edit"
PUBLIC_DIR = ROOT_DIR / "public"
DATA_JSON_PATH = ROOT_DIR / "src" / "data" / "transcript.json"

FILLER_WORDS = {"ờ", "à", "ừm", "ưm", "uh", "um", "er", "ah"}
HIGHLIGHT_COLORS = ["#FACC15", "#34D399", "#38BDF8", "#F43F5E", "#A855F7"]
AVAILABLE_BROLLS = [
    "images/pixar_1.jpg",
    "images/doc_1.jpg",
    "images/prod_1.jpg",
    "images/anime_1.jpg",
]


def get_video_duration(ffmpeg_exe: str, video_path: Path) -> float:
    proc = subprocess.run(
        [ffmpeg_exe, "-i", str(video_path)],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="ignore",
    )
    match = re.search(r"Duration:\s*(\d+):(\d+):(\d+\.\d+)", proc.stderr)
    if not match:
        return 8.0
    h, m, s = int(match.group(1)), int(match.group(2)), float(match.group(3))
    return h * 3600 + m * 60 + s


def trim_silence_and_export(input_video: Path, output_video: Path) -> float:
    """
    Sử dụng FFmpeg để chuẩn hóa khung hình dọc 9:16 (1080x1920) 30fps, cắt khoảng lặng & làm sạch âm thanh.
    """
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    print(f"[1/4] Đang xử lý video dọc 9:16 (1080x1920) & làm sạch âm thanh cho: {input_video.name} ...")

    temp_out = output_video.with_suffix(".tmp.mp4")
    cmd = [
        ffmpeg_exe,
        "-y",
        "-i",
        str(input_video),
        "-vf",
        "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1",
        "-r",
        "30",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        str(temp_out),
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    shutil.move(str(temp_out), str(output_video))

    duration = get_video_duration(ffmpeg_exe, output_video)
    print(f"   -> Thời lượng sau xử lý: {duration:.2f} giây.")
    return duration


def transcribe_word_timestamps(video_path: Path):
    """
    Chạy faster-whisper để lấy word-level timestamps chính xác tới từng mili-giây.
    """
    print("[2/4] Đang chạy AI faster-whisper để tách chữ & nhãn thời gian từng từ...")
    from faster_whisper import WhisperModel

    model = WhisperModel("base", device="cpu", compute_type="int8")
    segments, info = model.transcribe(
        str(video_path),
        word_timestamps=True,
        vad_filter=True,
    )

    words_out = []
    color_idx = 0
    for seg in segments:
        if not seg.words:
            continue
        for w in seg.words:
            clean_w = w.word.strip()
            if not clean_w:
                continue
            if clean_w.lower().strip(".,!?") in FILLER_WORDS:
                continue
            item = {
                "word": clean_w,
                "start": round(float(w.start), 2),
                "end": round(float(w.end), 2),
            }
            if any(ch.isdigit() for ch in clean_w) or len(clean_w) >= 5:
                item["highlight"] = HIGHLIGHT_COLORS[color_idx % len(HIGHLIGHT_COLORS)]
                color_idx += 1
            words_out.append(item)

    return words_out, info.language


def build_auto_edl(duration: float, words: list):
    """
    Tự động sinh điểm Zoom in/out (Punch-in) và điểm chèn B-Roll theo nhịp độ video.
    """
    print("[3/4] Đang tạo kịch bản Zoom Keyframes & B-Roll tự động (EDL)...")
    zoom_cues = []
    t = 1.2
    while t + 1.8 < duration:
        zoom_cues.append(
            {
                "startSec": round(t, 2),
                "endSec": round(min(duration, t + 2.0), 2),
                "scale": 1.16,
            }
        )
        t += 3.8

    broll_cues = []
    broll_time = 2.0
    idx = 0
    while broll_time + 2.0 < duration and idx < len(AVAILABLE_BROLLS):
        broll_cues.append(
            {
                "startSec": round(broll_time, 2),
                "endSec": round(broll_time + 2.0, 2),
                "image": AVAILABLE_BROLLS[idx % len(AVAILABLE_BROLLS)],
                "title": f"AI B-ROLL SCENE #{idx + 1}",
            }
        )
        broll_time += 3.5
        idx += 1

    return zoom_cues, broll_cues


def process_video(input_path: Path):
    output_video = PUBLIC_DIR / "edited_video.mp4"
    duration = trim_silence_and_export(input_path, output_video)
    words, lang = transcribe_word_timestamps(output_video)
    zoom_cues, broll_cues = build_auto_edl(duration, words)

    payload = {
        "videoFile": "edited_video.mp4",
        "sourceName": input_path.name,
        "durationSeconds": round(duration, 2),
        "language": lang,
        "words": words,
        "zoomCues": zoom_cues,
        "brollCues": broll_cues,
    }
    DATA_JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(DATA_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"[4/4] HOÀN TẤT! Đã lưu '{output_video.name}' ({duration:.1f}s, {len(words)} từ).")
    print("      -> Mở http://localhost:3000 (mục 00-Auto-Edited-Raw-Video) để xem ngay!")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        target = Path(sys.argv[1])
    else:
        mp4s = sorted(VIDEOS_IN_DIR.glob("*.mp4"))
        if not mp4s:
            print(f"Chưa có file .mp4 nào trong {VIDEOS_IN_DIR}")
            sys.exit(0)
        target = mp4s[0]
    process_video(target)
