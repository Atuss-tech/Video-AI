import cv2
import numpy as np
import os
import sys

def process_avatar(input_path, output_png, target_width=None):
    img = cv2.imread(input_path)
    if img is None:
        raise ValueError(f"Cannot read {input_path}")
    h, w, _ = img.shape

    # 1. Clean background cutout in float32
    bg_color = np.array([255.0, 255.0, 255.0], dtype=np.float32)
    diff = np.linalg.norm(img.astype(np.float32) - bg_color, axis=2)

    # Smooth anti-aliased edge
    alpha = np.clip((diff - 18.0) / (45.0 - 18.0) * 255.0, 0, 255).astype(np.uint8)

    # 2. Feather bottom edge of neck/hair so it dissolves seamlessly into shirt & shoulders
    y_idx, x_idx = np.where(alpha > 30)
    if len(y_idx) > 0:
        max_y = np.max(y_idx)
        min_y = np.max([0, np.min(y_idx)])
        min_x = np.max([0, np.min(x_idx)])
        max_x = np.min([w, np.max(x_idx)])

        # Soft fade at the bottom 15% of the subject
        fade_zone = int((max_y - min_y) * 0.15)
        fade_start_y = max_y - fade_zone
        for y in range(fade_start_y, max_y + 1):
            factor = 1.0 - (y - fade_start_y) / max(1, fade_zone)
            alpha[y, :] = (alpha[y, :].astype(np.float32) * (factor ** 1.3)).astype(np.uint8)

        # 3. Crop tightly to bounding box + 10px padding
        pad = 8
        crop_min_y = max(0, min_y - pad)
        crop_max_y = min(h, max_y + pad)
        crop_min_x = max(0, min_x - pad)
        crop_max_x = min(w, max_x + pad)

        b, g, r = cv2.split(img)
        rgba = cv2.merge([b, g, r, alpha])
        cropped_rgba = rgba[crop_min_y:crop_max_y, crop_min_x:crop_max_x]
    else:
        b, g, r = cv2.split(img)
        cropped_rgba = cv2.merge([b, g, r, alpha])

    os.makedirs(os.path.dirname(output_png), exist_ok=True)
    cv2.imwrite(output_png, cropped_rgba)
    print(f"Processed avatar -> {output_png}, shape: {cropped_rgba.shape}")
    return cropped_rgba

if __name__ == "__main__":
    src = sys.argv[1] if len(sys.argv) > 1 else r"C:\Users\ADMIN\.gemini\antigravity\brain\5cf76ca9-6861-4ce0-9dbd-a7e3ba329f7d\pixar_asian_female_avatar_1792570008322.jpg"
    out = sys.argv[2] if len(sys.argv) > 2 else r"f:\Video AI\public\images\host_cartoon_head.png"
    process_avatar(src, out)
