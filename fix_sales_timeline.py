import json
import os

timeline_path = r"f:\Video AI\src\data\sales_timeline.json"
with open(timeline_path, "r", encoding="utf-8") as f:
    data = json.load(f)

image_map = {
    1: None,
    2: "images/doc_1.jpg",
    3: "images/doc_2.jpg",
    4: "images/pixar_2.jpg",
    5: "images/pixar_1.jpg",
}

for scene in data["scenes"]:
    sid = scene["id"]
    img = image_map.get(sid)
    if img and not os.path.exists(os.path.join(r"f:\Video AI\public", img)):
        raise FileNotFoundError(f"Missing image: {img}")
    scene["illustration"] = img

    # Align exact ground-truth words from voiceText with Whisper timestamps
    gt_words = scene["voiceText"].split()
    w_list = scene.get("words", [])
    s_start = float(scene["start"])
    s_end = float(scene["end"])
    speech_dur = max(0.5, (s_end - s_start) - 0.25)

    aligned_words = []
    n_gt = len(gt_words)
    n_w = len(w_list)
    for i, gw in enumerate(gt_words):
        if n_w > 0:
            mapped_idx = min(n_w - 1, int(round(i * (n_w - 1) / max(1, n_gt - 1))))
            ws = float(w_list[mapped_idx]["start"])
            we = float(w_list[mapped_idx]["end"])
            if we <= ws:
                we = round(ws + 0.18, 2)
        else:
            ws = round(s_start + (i / n_gt) * speech_dur, 2)
            we = round(s_start + ((i + 1) / n_gt) * speech_dur, 2)
        aligned_words.append({
            "word": gw,
            "start": ws,
            "end": we
        })
    scene["words"] = aligned_words

with open(timeline_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Fixed image paths and 100% ground-truth Vietnamese words in sales_timeline.json!")
