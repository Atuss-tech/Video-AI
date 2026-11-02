with open('f:/Video AI/src/compositions/AutoEditedVideo.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace host coordinates
old_part = """      {cameraMode === "host" && (
        <div
          style={{
            position: "absolute",
            top: 740,
            left: 395,
            width: 380,
            height: 380,"""

new_part = """      {cameraMode === "host" && (
        <div
          style={{
            position: "absolute",
            top: 770,
            left: 368,
            width: 542,
            height: 542,"""

assert old_part in content, "old_part not found"
content = content.replace(old_part, new_part)

# Replace wide coordinates
old_wide = """      {cameraMode === "wide" && (
        <div
          style={{
            position: "absolute",
            top: 662,
            left: 331,
            width: 100,
            height: 100,"""

new_wide = """      {cameraMode === "wide" && (
        <div
          style={{
            position: "absolute",
            top: 659,
            left: 298,
            width: 160,
            height: 160,"""

assert old_wide in content, "old_wide not found"
content = content.replace(old_wide, new_wide)

with open('f:/Video AI/src/compositions/AutoEditedVideo.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated AutoEditedVideo.tsx successfully!")
