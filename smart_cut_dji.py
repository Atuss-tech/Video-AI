import json
import os
import subprocess
import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
raw_video = r"f:\Video AI\videos_to_edit\DJI_20260721142410_0197_D.MP4"
raw_transcript_path = r"f:\Video AI\videos_to_edit\dji_raw_transcript.json"
output_video = r"f:\Video AI\public\edited_video.mp4"
output_transcript = r"f:\Video AI\src\data\transcript.json"

with open(raw_transcript_path, "r", encoding="utf-8") as f:
    raw_segments = json.load(f)

# Intelligent AI Edit Decision List (EDL):
# 1. Cut 0.00s - 5.55s (3 false starts / retakes: "So I'm going to start" x3)
# 2. Keep 5.55s - 11.55s (Intro: sitting with lovely customer)
# 3.Keep 12.05s - 19.45s (Q1: First time visiting factory, first impression?)
# 4. Keep 19.90s - 22.12s (A1 part 1: "First impression is good.")
# 5. Keep 22.95s - 25.90s (A1 part 2: "It's very effective, well-organized.") - tightened 0.83s pause!
# 6. Cut 25.90s - 58.20s (Skip awkward "A little bit disorganized" + basement move explanation)
# 7. Keep 58.20s - 67.70s (Q2: Discuss typical product in the UK market)
# 8. Keep 68.55s - 70.60s (A2: "It seems well. Yeah, it's good.")
# 9. Keep 70.85s - 79.05s (Q3: Sales service & recommendation satisfaction)
# 10. Keep 79.45s - 89.25s (A3: "For me I'm very happy to see you... Thank you so much.")
# 11. Keep 89.50s - 94.60s (Q4: Anything in general about Haplast?)
# 12. Keep 96.00s - 101.42s (A4: "I consider it is a good company. Okay, thank you so much. Thank you for the time today.")
# 13. Keep 102.65s - 104.15s (Outro: "That would be a million dollar. Thank you so much.")

edl = [
    {
        "start": 5.55,
        "end": 11.55,
        "speaker": "host",
        "camera": "wide",
        "vi": "Hôm nay mình đang ngồi cùng vị khách hàng tuyệt vời từ Vương quốc Anh",
        "topic": "Welcome & Introduction"
    },
    {
        "start": 12.05,
        "end": 19.45,
        "speaker": "host",
        "camera": "host",
        "vi": "Đây là lần đầu ông thăm nhà máy Haplast, ấn tượng đầu tiên của ông thế nào?",
        "topic": "Q1 • Factory First Impression"
    },
    {
        "start": 19.90,
        "end": 22.12,
        "speaker": "customer",
        "camera": "customer",
        "zoom": True,
        "vi": "Ấn tượng đầu tiên rất tốt!",
        "topic": "Customer Feedback • Factory"
    },
    {
        "start": 22.95,
        "end": 25.90,
        "speaker": "customer",
        "camera": "customer",
        "zoom": True,
        "vi": "Quy trình làm việc rất hiệu quả và được tổ chức bài bản.",
        "topic": "Customer Feedback • Factory"
    },
    {
        "start": 58.20,
        "end": 67.70,
        "speaker": "host",
        "camera": "host",
        "vi": "Hôm nay chúng ta cũng đã thảo luận về dòng sản phẩm chủ lực cho thị trường Anh (UK). Ông thấy sản phẩm thế nào?",
        "topic": "Q2 • UK Market Products"
    },
    {
        "start": 68.55,
        "end": 70.60,
        "speaker": "customer",
        "camera": "customer",
        "zoom": True,
        "vi": "Sản phẩm rất ổn. Vâng, chất lượng rất tốt!",
        "topic": "Customer Feedback • Product Quality"
    },
    {
        "start": 70.85,
        "end": 79.05,
        "speaker": "host",
        "camera": "host",
        "vi": "Còn dịch vụ bán hàng của Haplast thì sao? Ông có hài lòng với tư vấn và buổi trao đổi hôm nay không?",
        "topic": "Q3 • Sales & Consultation Service"
    },
    {
        "start": 79.45,
        "end": 89.25,
        "speaker": "customer",
        "camera": "customer",
        "zoom": False,
        "vi": "Cá nhân tôi rất vui được gặp và làm việc trực tiếp cùng bạn sau thời gian liên hệ. Mọi thứ đều rất tốt. Cảm ơn bạn rất nhiều!",
        "topic": "Customer Feedback • Service Experience"
    },
    {
        "start": 89.50,
        "end": 94.60,
        "speaker": "host",
        "camera": "host",
        "vi": "Câu hỏi cuối cùng, ông có muốn chia sẻ điều gì chung về Haplast không?",
        "topic": "Q4 • Overall Impression of Haplast"
    },
    {
        "start": 96.00,
        "end": 101.42,
        "speaker": "customer",
        "camera": "customer",
        "zoom": True,
        "vi": "Tôi đánh giá Haplast là một công ty rất tốt! — Cảm ơn ông rất nhiều vì đã dành thời gian hôm nay.",
        "topic": "Final Verdict • Haplast Group"
    },
    {
        "start": 102.65,
        "end": 104.15,
        "speaker": "host",
        "camera": "wide",
        "vi": "Lời khen đáng giá triệu đô! Cảm ơn ông rất nhiều!",
        "topic": "Closing • Thank You"
    }
]

# Flatten all raw words
all_words = []
for seg in raw_segments:
    for w in seg.get("words", []):
        all_words.append({
            "word": w["word"].strip(),
            "start": float(w["start"]),
            "end": float(w["end"])
        })

# Fix Whisper transcription errors on raw timestamps before remapping:
# 1. Around 62.0s - 63.5s: "TV", "call", "for", "that" -> "typical", "product"
# 2. Around 94.0s - 94.6s: "half", "last?" -> "Haplast?"
fixed_words = []
i = 0
while i < len(all_words):
    w = all_words[i]
    # Fix "TV call for that" -> "typical product"
    if 61.8 <= w["start"] <= 62.6 and w["word"].lower() == "tv":
        # Merge next words up to "that"
        end_t = w["end"]
        j = i + 1
        while j < len(all_words) and all_words[j]["start"] <= 63.6:
            end_t = all_words[j]["end"]
            j += 1
        mid_t = (w["start"] + end_t) / 2.0
        fixed_words.append({"word": "typical", "start": w["start"], "end": round(mid_t, 2)})
        fixed_words.append({"word": "product", "start": round(mid_t, 2), "end": end_t})
        i = j
        continue
    # Fix "half last?" -> "Haplast?"
    if 93.9 <= w["start"] <= 94.4 and w["word"].lower() == "half":
        end_t = w["end"]
        if i + 1 < len(all_words) and "last" in all_words[i + 1]["word"].lower():
            end_t = all_words[i + 1]["end"]
            i += 2
        else:
            i += 1
        fixed_words.append({"word": "Haplast?", "start": w["start"], "end": end_t})
        continue
    fixed_words.append(w)
    i += 1

# Build filter_complex to cut and concat video + audio smoothly, and remap timestamps
filter_parts = []
concat_inputs = []
output_segments = []
current_time = 0.0

for idx, cut in enumerate(edl):
    s = cut["start"]
    e = cut["end"]
    dur = round(e - s, 3)

    # Video & Audio trim filters
    filter_parts.append(
        f"[0:v:0]trim=start={s}:end={e},setpts=PTS-STARTPTS[v{idx}];"
        f"[0:a:0]atrim=start={s}:end={e},asetpts=PTS-STARTPTS[a{idx}];"
    )
    concat_inputs.append(f"[v{idx}][a{idx}]")

    # Map words in this cut interval
    cut_words = []
    for w in fixed_words:
        w_mid = (w["start"] + w["end"]) / 2.0
        if s - 0.08 <= w_mid <= e + 0.08:
            new_s = max(0.0, round(current_time + (w["start"] - s), 2))
            new_e = max(new_s + 0.08, round(current_time + (w["end"] - s), 2))
            cut_words.append({
                "word": w["word"],
                "start": new_s,
                "end": new_e
            })

    seg_text = " ".join(w["word"] for w in cut_words)
    output_segments.append({
        "id": idx + 1,
        "start": round(current_time, 2),
        "end": round(current_time + dur, 2),
        "rawStart": s,
        "rawEnd": e,
        "speaker": cut["speaker"],
        "camera": cut["camera"],
        "zoom": cut.get("zoom", False),
        "topic": cut["topic"],
        "text": seg_text,
        "vi": cut["vi"],
        "words": cut_words
    })
    current_time += dur

n_cuts = len(edl)
filter_complex = (
    "".join(filter_parts)
    + "".join(concat_inputs)
    + f"concat=n={n_cuts}:v=1:a=1[vcat][acat];"
    + "[vcat]scale=1920:1080,fps=30,format=yuv420p[vout]"
)

print(f"Total smart-edited duration: {current_time:.2f}s (reduced from 105.69s, {n_cuts} smart cuts)")

# Save transcript.json
os.makedirs(os.path.dirname(output_transcript), exist_ok=True)
with open(output_transcript, "w", encoding="utf-8") as f:
    json.dump(output_segments, f, ensure_ascii=False, indent=2)
print(f"Saved remapped transcript to {output_transcript}")

# Run FFmpeg to produce browser-friendly H.264 8-bit MP4
cmd = [
    ffmpeg_exe,
    "-y",
    "-i", raw_video,
    "-filter_complex", filter_complex,
    "-map", "[vout]",
    "-map", "[acat]",
    "-c:v", "libx264",
    "-preset", "veryfast",
    "-crf", "21",
    "-c:a", "aac",
    "-b:a", "192k",
    "-movflags", "+faststart",
    output_video
]

print("Running FFmpeg smart cut & transcode...")
res = subprocess.run(cmd, capture_output=True, text=True)
if res.returncode != 0:
    print("FFmpeg Error:", res.stderr[-1500:])
    raise SystemExit(1)

size_mb = os.path.getsize(output_video) / (1024 * 1024)
print(f"Success! Output: {output_video} ({size_mb:.2f} MB)")
