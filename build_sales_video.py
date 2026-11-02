import asyncio
import json
import os
import shutil
import subprocess
import wave
import edge_tts
import imageio_ffmpeg
from faster_whisper import WhisperModel

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
output_dir = r"f:\Video AI\public\audio"
images_dir = r"f:\Video AI\public\images"
os.makedirs(output_dir, exist_ok=True)
os.makedirs(images_dir, exist_ok=True)

# Copy 4 realistic documentary photos into public/images/
artifact_dir = r"C:\Users\ADMIN\.gemini\antigravity\brain\5cf76ca9-6861-4ce0-9dbd-a7e3ba329f7d"
photo_sources = {
    "real_pain_1.jpg": os.path.join(artifact_dir, "real_pain_late_night_1792424253706.jpg"),
    "real_pain_2.jpg": os.path.join(artifact_dir, "real_pain_lost_leads_1792424274393.jpg"),
    "real_solution_3.jpg": os.path.join(artifact_dir, "real_solution_automation_1792424297503.jpg"),
    "real_result_4.jpg": os.path.join(artifact_dir, "real_result_owner_1792424324207.jpg"),
}
for dst_name, src_path in photo_sources.items():
    if os.path.exists(src_path):
        shutil.copyfile(src_path, os.path.join(images_dir, dst_name))

# Kịch bản xoáy thẳng vào "chỗ ngứa" thực tế của chủ doanh nghiệp / chủ shop Việt Nam
scenes = [
    {
        "id": 1,
        "stepLabel": "01 / 05 • NỖI ĐAU ĐỐT TIỀN QUẢNG CÁO",
        "phase": "pain",
        "headline": "KHÁCH NHẮN LÚC 10H ĐÊM\nSÁNG MAI MỚI TRẢ LỜI?",
        "subheadline": "Đổ tiền triệu chạy Ads nhưng mất khách nóng chỉ vì chậm 15 phút",
        "voiceText": "Bỏ tiền triệu chạy quảng cáo mỗi ngày, khách nhắn hỏi mua lúc mười giờ đêm nhưng nhân viên nghỉ hết. Sáng hôm sau mới trả lời thì khách đã chuyển khoản cho đối thủ mất rồi!",
        "illustration": "images/real_pain_1.jpg",
        "photoTag": "23:15 ĐÊM • 14 TIN NHẮN KHÁCH HỎI MUA CHƯA AI TRỰC",
        "cards": [
            {
                "tag": "23:14 ĐÊM",
                "title": "Khách nhắn: “Báo giá sỉ giúp mình nhé!”",
                "desc": "Không có nhân viên trực đêm -> Tin nhắn bị trôi",
                "status": "BỎ LỠ ❌"
            },
            {
                "tag": "08:30 SÁNG",
                "title": "Sale mới rep -> Khách: “Mình đặt bên khác rồi”",
                "desc": "Mất trắng tiền quảng cáo & mất luôn đơn hàng vào tay đối thủ",
                "status": "MẤT ĐƠN 💸"
            }
        ]
    },
    {
        "id": 2,
        "stepLabel": "02 / 05 • LỖ HỔNG QUẢN LÝ & CHĂM SÓC",
        "phase": "pain",
        "headline": "BỎ RƠI 80% KHÁCH ĐÃ HỎI\nVÌ QUÊN CHĂM SÓC LẠI!",
        "subheadline": "Sale chỉ thích khách dễ chốt • Data khách cũ nằm chết trong file Excel",
        "voiceText": "Đau hơn nữa là khách hỏi giá xong im lặng thì nhân viên cũng bỏ trôi luôn, không ai nhắn tin chăm lại. Hàng trăm khách hàng tiềm năng bị vứt xó trong các file Excel rời rạc!",
        "illustration": "images/real_pain_2.jpg",
        "photoTag": "THỰC TẾ PHÒNG SALE • QUÁ TẢI TIN NHẮN & FILE EXCEL RỜI RẠC",
        "cards": [
            {
                "tag": "100 KHÁCH HỎI",
                "title": "85% Khách cần được nhắc lại lần 2, lần 3 mới mua",
                "desc": "Nhưng nhân viên sale bận hoặc quên không bao giờ nhắn lại",
                "status": "LÃNG PHÍ ⚠️"
            },
            {
                "tag": "QUẢN LÝ MÙ MỜ",
                "title": "Cuối ngày mới ngồi gõ tay vào bảng Excel",
                "desc": "Sai sót số liệu, chủ doanh nghiệp phụ thuộc hoàn toàn vào nhân sự",
                "status": "RỦI RO 📉"
            }
        ]
    },
    {
        "id": 3,
        "stepLabel": "03 / 05 • GIẢI PHÁP WORKFLOW & WEBSITE 24/7",
        "phase": "solution",
        "headline": "TỰ ĐỘNG TƯ VẤN & BÁO ĐƠN\nTRONG VÒNG 3 GIÂY (24/7)",
        "subheadline": "Website Thương Hiệu chuẩn uy tín + Luồng Workflow n8n đón khách tự động",
        "voiceText": "Đó là lúc bạn cần một Website thương hiệu kết hợp luồng Workflow tự động hóa. Khách vừa để lại thông tin lúc nửa đêm, hệ thống lập tức tư vấn, lưu thẳng vào bảng quản lý và báo ngay về Zalo cho sale trong ba giây!",
        "illustration": "images/real_solution_3.jpg",
        "photoTag": "HỆ THỐNG WORKFLOW N8N • ĐỒNG BỘ WEBSITE, FACEBOOK, CRM & ZALO",
        "cards": [
            {
                "tag": "BƯỚC 1 -> 2",
                "title": "Khách từ FB Ads / Website -> AI Tư Vấn Ngay Lập Tức",
                "desc": "Phản hồi khách trong 3 giây bất kể 12h đêm hay ngày nghỉ lễ",
                "status": "AUTO 3S ⚡"
            },
            {
                "tag": "BƯỚC 3 -> 4",
                "title": "Tự Động Lưu CRM / Sheet -> Báo Ting Ting Về Zalo Sale",
                "desc": "Phân loại rõ khách sỉ/lẻ, không bao giờ thất thoát 1 số điện thoại nào",
                "status": "ĐỒNG BỘ ✅"
            }
        ]
    },
    {
        "id": 4,
        "stepLabel": "04 / 05 • CỖ MÁY BÁM ĐUỔI KHÁCH TỰ ĐỘNG",
        "phase": "solution",
        "headline": "TỰ ĐỘNG CHĂM LẠI KHÁCH CŨ\nX2 ĐƠN TỪ CÙNG TIỀN ADS",
        "subheadline": "Kịch bản tự động nhắc nhớ Ngày 1 • Ngày 3 • Ngày 7 đến khi khách chốt",
        "voiceText": "Khách xem xong chưa mua ngay? Hệ thống tự động gửi kịch bản chăm sóc khéo léo vào ngày thứ hai, ngày thứ năm cho đến khi chốt được đơn. Không phụ thuộc nhân sự, tăng gấp đôi doanh thu từ cùng một chi phí quảng cáo!",
        "illustration": "images/real_result_4.jpg",
        "photoTag": "CHỦ DOANH NGHIỆP THẢNH THƠI • KIỂM SOÁT 100% TỶ LỆ CHUYỂN ĐỔI",
        "cards": [
            {
                "tag": "FOLLOW-UP TỰ ĐỘNG",
                "title": "Ngày 1 gửi Bảng giá • Ngày 3 gửi Feedback • Ngày 7 gửi Ưu đãi",
                "desc": "Chăm sóc 1.000 khách cũ cùng lúc hoàn toàn tự động không sót 1 ai",
                "status": "X2 DOANH SỐ 🚀"
            },
            {
                "tag": "CẮT GIẢM 80% VIỆC TAY",
                "title": "Báo cáo doanh thu & nguồn khách cập nhật thời gian thực",
                "desc": "Mở điện thoại là biết ngay hôm nay có bao nhiêu khách nét, bao nhiêu đơn",
                "status": "TỐI ƯU 24/7 📊"
            }
        ]
    },
    {
        "id": 5,
        "stepLabel": "05 / 05 • ĐĂNG KÝ KHẢO SÁT & DEMO QUY TRÌNH",
        "phase": "cta",
        "headline": "ĐẶT LỊCH KHẢO SÁT & DEMO\nHỆ THỐNG CHO RIÊNG BẠN",
        "subheadline": "Thiết kế Website Thương Hiệu & Workflow Tự Động Hóa may đo trọn gói",
        "voiceText": "Đừng để tiền quảng cáo chảy vào túi đối thủ nữa. Nhắn tin ngay hôm nay để bên mình khảo sát quy trình và thiết kế hệ thống Website kèm Workflow tự động hóa may đo riêng cho doanh nghiệp của bạn!",
        "illustration": "images/real_solution_3.jpg",
        "photoTag": "BÀN GIAO TRỌN GÓI • ĐÀO TẠO & ĐỒNG HÀNH VẬN HÀNH 1 KÈM 1",
        "cards": [
            {
                "tag": "QUÀ TẶNG TRONG TUẦN",
                "title": "Miễn phí Khảo sát Quy trình & Vẽ Sơ đồ Tự động hóa 1-1",
                "desc": "Chỉ ra chính xác điểm nghẽn đang làm doanh nghiệp bạn rơi rụng khách",
                "status": "MIỄN PHÍ 🎁"
            },
            {
                "tag": "HÀNH ĐỘNG NGAY",
                "title": "📩 Nhắn tin (Inbox) hoặc Bình luận “TỰ ĐỘNG HÓA”",
                "desc": "Đội ngũ kỹ thuật sẽ gửi bản Demo thực tế đúng ngành hàng của bạn!",
                "status": "INBOX NGAY 👉"
            }
        ]
    }
]

VOICE = "vi-VN-NamMinhNeural"
RATE = "+12%"

async def generate_scene_audios():
    temp_files = []
    voices_to_try = ["vi-VN-NamMinhNeural", "vi-VN-HoaiMyNeural"]
    for s in scenes:
        mp3_path = os.path.join(output_dir, f"scene_{s['id']}.mp3")
        wav_path = os.path.join(output_dir, f"scene_{s['id']}.wav")
        saved = False
        for attempt in range(4):
            v = voices_to_try[attempt % len(voices_to_try)]
            try:
                await asyncio.sleep(0.8 * attempt)
                communicate = edge_tts.Communicate(s["voiceText"], v, rate=RATE)
                await communicate.save(mp3_path)
                if os.path.exists(mp3_path) and os.path.getsize(mp3_path) > 500:
                    saved = True
                    break
            except Exception as err:
                print(f"Retry {attempt + 1} for scene {s['id']} ({err})...")
        if not saved:
            raise RuntimeError(f"Failed to synthesize audio for scene {s['id']}")
        subprocess.run([
            ffmpeg_exe, "-y", "-i", mp3_path,
            "-af", "apad=pad_dur=0.25",
            "-ar", "24000", "-ac", "1", wav_path
        ], check=True, capture_output=True)
        temp_files.append(wav_path)
    return temp_files

def get_wav_duration(wav_path):
    with wave.open(wav_path, "rb") as wf:
        return wf.getnframes() / float(wf.getframerate())

async def main():
    print("1. Creating voiceovers for 5 pain-point scenes...")
    wav_files = await generate_scene_audios()

    print("2. Running Whisper word alignment & ground-truth mapping...")
    model = WhisperModel("base", device="cpu", compute_type="int8")

    timeline_scenes = []
    current_sec = 0.0
    concat_inputs = []
    filter_concat = []

    for idx, (s, wav_path) in enumerate(zip(scenes, wav_files)):
        dur = round(get_wav_duration(wav_path), 2)
        segments, _ = model.transcribe(wav_path, language="vi", word_timestamps=True)
        raw_words = []
        for seg in segments:
            for w in (seg.words or []):
                raw_words.append({
                    "word": w.word.strip(),
                    "start": round(current_sec + float(w.start), 2),
                    "end": round(current_sec + float(w.end), 2)
                })

        # Map exact ground-truth words from voiceText so spelling is 100% flawless
        gt_words = s["voiceText"].split()
        speech_dur = max(0.5, dur - 0.25)
        aligned_words = []
        n_gt = len(gt_words)
        n_w = len(raw_words)
        for i, gw in enumerate(gt_words):
            if n_w > 0:
                mapped_idx = min(n_w - 1, int(round(i * (n_w - 1) / max(1, n_gt - 1))))
                ws = float(raw_words[mapped_idx]["start"])
                we = float(raw_words[mapped_idx]["end"])
                if we <= ws:
                    we = round(ws + 0.18, 2)
            else:
                ws = round(current_sec + (i / n_gt) * speech_dur, 2)
                we = round(current_sec + ((i + 1) / n_gt) * speech_dur, 2)
            aligned_words.append({"word": gw, "start": ws, "end": we})

        scene_entry = dict(s)
        scene_entry["start"] = round(current_sec, 2)
        scene_entry["end"] = round(current_sec + dur, 2)
        scene_entry["duration"] = dur
        scene_entry["words"] = aligned_words
        timeline_scenes.append(scene_entry)

        concat_inputs.extend(["-i", wav_path])
        filter_concat.append(f"[{idx}:a:0]")
        current_sec += dur

    master_mp3 = os.path.join(output_dir, "sales_marketing_voice.mp3")
    filter_str = "".join(filter_concat) + f"concat=n={len(wav_files)}:v=0:a=1[aout]"
    subprocess.run(
        [ffmpeg_exe, "-y"] + concat_inputs + [
            "-filter_complex", filter_str,
            "-map", "[aout]",
            "-c:a", "libmp3lame", "-b:a", "192k",
            master_mp3
        ],
        check=True, capture_output=True
    )

    timeline_data = {
        "title": "Quảng bá Dịch vụ Xây dựng Workflow Tự động hóa & Website Thương Hiệu",
        "audioFile": "audio/sales_marketing_voice.mp3",
        "totalDuration": round(current_sec, 2),
        "scenes": timeline_scenes
    }

    out_json = r"f:\Video AI\src\data\sales_timeline.json"
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(timeline_data, f, ensure_ascii=False, indent=2)

    print(f"Done! Total duration: {current_sec:.2f}s")

if __name__ == "__main__":
    asyncio.run(main())
