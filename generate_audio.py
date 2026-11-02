import asyncio
import math
import os
import struct
import wave
import edge_tts

AUDIO_DIR = os.path.join("public", "audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

VOICE_MALE = "vi-VN-NamMinhNeural"
VOICE_FEMALE = "vi-VN-HoaiMyNeural"

VOICEOVERS = [
    (
        "vo_01.mp3",
        VOICE_MALE,
        "+5%",
        "Tại sao các kênh YouTube triệu view đang chuyển sang dựng video bằng code? Với Antigravity và Remotion, thời gian sản xuất giảm từ 40 giờ xuống chỉ còn 15 phút.",
    ),
    (
        "vo_02.mp3",
        VOICE_FEMALE,
        "+8%",
        "AI Agentic Video hoạt động như thế nào? Thay vì kéo thả từng khung hình thủ công, bạn chỉ cần nhập chủ đề, AI sẽ tự viết kịch bản và vẽ đồ họa chuyển động gấp 10 lần năng suất.",
    ),
    (
        "vo_03.mp3",
        VOICE_MALE,
        "+8%",
        "Chỉ cần dán đường link website của bạn, AI Agent sẽ tự động quét logo, bảng màu và tính năng nổi bật để xuất thành video quảng cáo sắc nét.",
    ),
    (
        "vo_04.mp3",
        VOICE_FEMALE,
        "+12%",
        "Không cần kéo thả timeline! Chỉ cần gõ một câu lệnh, xuất ngay video sáu mươi khung hình trên giây cực kỳ bắt mắt!",
    ),
    (
        "vo_05.mp3",
        VOICE_MALE,
        "+15%",
        "Đừng edit CapCut thủ công nữa! Đây là bí quyết tạo hơn một trăm video Shorts tự động bằng AI kèm phụ đề nhảy từng chữ!",
    ),
    (
        "vo_06.mp3",
        VOICE_FEMALE,
        "+6%",
        "Báo cáo tăng trưởng và KPI thời gian thực. Doanh thu, tỷ lệ chuyển đổi và biểu đồ năm cột được tự động cập nhật trực tiếp từ dữ liệu của bạn.",
    ),
    (
        "vo_07.mp3",
        VOICE_MALE,
        "+8%",
        "Chào mừng bạn đến với Antigravity Video Studio! Đừng quên bấm nút Đăng ký kênh và bật chuông thông báo để không bỏ lỡ các video mới nhất!",
    ),
]


async def generate_voiceovers():
    tasks = []
    for filename, voice, rate, text in VOICEOVERS:
        out_path = os.path.join(AUDIO_DIR, filename)
        comm = edge_tts.Communicate(text=text, voice=voice, rate=rate)
        tasks.append(comm.save(out_path))
    await asyncio.gather(*tasks)
    print("Voiceovers generated successfully!")


def save_wav(filename: str, samples: list[float], sample_rate: int = 44100):
    path = os.path.join(AUDIO_DIR, filename)
    with wave.open(path, "w") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        frames = bytearray()
        for s in samples:
            clipped = max(-1.0, min(1.0, s))
            frames.extend(struct.pack("<h", int(clipped * 32767)))
        wf.writeframes(frames)


def generate_sfx_and_bgm():
    sr = 44100

    # 1. SFX Pop (short harmonic pop)
    pop_len = int(sr * 0.14)
    pop_samples = []
    for i in range(pop_len):
        t = i / sr
        freq = 280 + 520 * (t / 0.14)
        env = math.exp(-t * 28)
        pop_samples.append(math.sin(2 * math.pi * freq * t) * env * 0.6)
    save_wav("sfx_pop.wav", pop_samples, sr)

    # 2. SFX Whoosh (filtered transition sweep)
    whoosh_len = int(sr * 0.35)
    whoosh_samples = []
    for i in range(whoosh_len):
        t = i / sr
        env = math.sin(math.pi * (i / whoosh_len)) ** 1.5
        freq = 140 + 480 * math.sin(math.pi * (i / whoosh_len))
        val = (
            math.sin(2 * math.pi * freq * t) * 0.5
            + math.sin(2 * math.pi * (freq * 1.5) * t) * 0.3
        )
        whoosh_samples.append(val * env * 0.45)
    save_wav("sfx_whoosh.wav", whoosh_samples, sr)

    # 3. SFX Click (mouse click)
    click_len = int(sr * 0.06)
    click_samples = []
    for i in range(click_len):
        t = i / sr
        env = math.exp(-t * 95)
        val = math.sin(2 * math.pi * 1200 * t) + 0.6 * math.sin(2 * math.pi * 2400 * t)
        click_samples.append(val * env * 0.6)
    save_wav("sfx_click.wav", click_samples, sr)

    # 4. SFX Bell Ding (YouTube notification bell chime)
    bell_len = int(sr * 0.9)
    bell_samples = []
    for i in range(bell_len):
        t = i / sr
        env = math.exp(-t * 4.5)
        val = (
            math.sin(2 * math.pi * 1046.5 * t) * 0.5
            + math.sin(2 * math.pi * 2093.0 * t) * 0.3
            + math.sin(2 * math.pi * 3135.96 * t) * 0.2
        )
        bell_samples.append(val * env * 0.55)
    save_wav("sfx_bell.wav", bell_samples, sr)

    # 5. BGM Documentary Warm Pad & Pulse (8.5 seconds)
    bgm_doc_len = int(sr * 8.5)
    bgm_doc = []
    chords = [220.0, 277.18, 329.63, 440.0]  # A major warm ambient pad
    for i in range(bgm_doc_len):
        t = i / sr
        fade = min(1.0, t / 0.8, (8.5 - t) / 1.0)
        pulse = 0.65 + 0.35 * math.sin(2 * math.pi * 2.0 * t)
        val = sum(math.sin(2 * math.pi * f * t) for f in chords) / len(chords)
        bgm_doc.append(val * pulse * fade * 0.22)
    save_wav("bgm_doc.wav", bgm_doc, sr)

    # 6. BGM Upbeat Tech Arpeggio (8.5 seconds)
    bgm_tech_len = int(sr * 8.5)
    bgm_tech = []
    arp_notes = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63]
    for i in range(bgm_tech_len):
        t = i / sr
        fade = min(1.0, t / 0.5, (8.5 - t) / 0.8)
        step = int(t * 6) % len(arp_notes)
        note_t = (t * 6) % 1.0
        note_env = math.exp(-note_t * 3.5)
        freq = arp_notes[step]
        bass = math.sin(2 * math.pi * 130.81 * t) * 0.4
        lead = math.sin(2 * math.pi * freq * t) * note_env * 0.6
        bgm_tech.append((bass + lead) * fade * 0.22)
    save_wav("bgm_tech.wav", bgm_tech, sr)

    # 7. BGM High-Energy Beat (8.5 seconds, 120 BPM)
    bgm_beat_len = int(sr * 8.5)
    bgm_beat = []
    for i in range(bgm_beat_len):
        t = i / sr
        fade = min(1.0, t / 0.3, (8.5 - t) / 0.8)
        beat_pos = (t * 2.0) % 1.0  # 120 BPM = 2 beats/sec
        kick_freq = 55 + 110 * math.exp(-beat_pos * 18)
        kick_env = math.exp(-beat_pos * 8)
        kick = math.sin(2 * math.pi * kick_freq * beat_pos) * kick_env * 0.7
        synth = math.sin(2 * math.pi * 196.0 * t) * 0.25
        bgm_beat.append((kick + synth) * fade * 0.28)
    save_wav("bgm_beat.wav", bgm_beat, sr)

    print("SFX & BGM WAV files generated successfully!")


if __name__ == "__main__":
    generate_sfx_and_bgm()
    asyncio.run(generate_voiceovers())
