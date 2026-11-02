from PIL import Image
import numpy as np

src_path = r"C:\Users\ADMIN\.gemini\antigravity\brain\5cf76ca9-6861-4ce0-9dbd-a7e3ba329f7d\pixar_asian_female_avatar_1792570008322.jpg"
out_path = r"f:\Video AI\public\images\host_cartoon_head.png"

img = Image.open(src_path).convert("RGBA")
data = np.array(img)

# White background removal with smooth feathering
# Colors close to white (R > 240, G > 240, B > 240) become transparent
r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]

# Calculate whiteness distance
whiteness = np.minimum(np.minimum(r, g), b)

# Create smooth alpha channel
# If whiteness > 248 -> 0
# If whiteness < 225 -> 255
# In between -> linear interpolation
alpha = np.clip((248 - whiteness) / (248 - 225) * 255, 0, 255).astype(np.uint8)

# Also keep original non-white areas fully opaque
data[:, :, 3] = alpha

# Crop tight bounding box of the head
non_transparent = np.where(data[:, :, 3] > 10)
if len(non_transparent[0]) > 0:
    min_y, max_y = np.min(non_transparent[0]), np.max(non_transparent[0])
    min_x, max_x = np.min(non_transparent[1]), np.max(non_transparent[1])
    # Add a little padding
    h, w, _ = data.shape
    min_y = max(0, min_y - 10)
    max_y = min(h, max_y + 10)
    min_x = max(0, min_x - 10)
    max_x = min(w, max_x + 10)
    cropped_data = data[min_y:max_y, min_x:max_x]
else:
    cropped_data = data

out_img = Image.fromarray(cropped_data, "RGBA")
out_img.save(out_path, "PNG")
print(f"Saved transparent cartoon head to {out_path}, size: {out_img.size}")
