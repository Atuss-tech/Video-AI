import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SoundTrack } from "../components/SoundTrack";

export const TikTokReelsShort: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Switch full-screen AI B-roll background every 80 frames (3 cuts in 8 seconds)
  const currentBg =
    frame < 80 ? "pixar_1.jpg" : frame < 160 ? "anime_2.jpg" : "prod_1.jpg";

  const bgScale = interpolate(frame % 80, [0, 80], [1.05, 1.22], {
    extrapolateRight: "clamp",
  });

  // Word-by-word karaoke transcript
  const captionWords = [
    { word: "Bí", start: 0, end: 18 },
    { word: "quyết", start: 18, end: 36 },
    { word: "tạo", start: 36, end: 54 },
    { word: "100+", start: 54, end: 80, highlight: "#FACC15" },
    { word: "video", start: 80, end: 105 },
    { word: "Shorts", start: 105, end: 135, highlight: "#34D399" },
    { word: "tự", start: 135, end: 160 },
    { word: "động", start: 160, end: 190 },
    { word: "bằng", start: 190, end: 215 },
    { word: "AI! 🔥", start: 215, end: 240, highlight: "#F43F5E" },
  ];

  const hookBannerSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 130 },
  });

  const progressPct = interpolate(frame, [0, durationInFrames], [0, 100], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        color: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      <SoundTrack
        voiceoverFile="vo_05.mp3"
        bgmFile="bgm_beat.wav"
        bgmVolume={0.35}
        sfxCues={[
          { file: "sfx_whoosh.wav", from: 2, volume: 0.65 },
          { file: "sfx_whoosh.wav", from: 80, volume: 0.65 },
          { file: "sfx_whoosh.wav", from: 160, volume: 0.65 },
          { file: "sfx_bell.wav", from: 215, volume: 0.65 },
        ]}
      />

      {/* Full-Screen Dynamic AI B-Roll Background */}
      <AbsoluteFill style={{ transform: `scale(${bgScale})` }}>
        <Img
          src={staticFile(`images/${currentBg}`)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>

      {/* Dark Gradient Overlay for Readability */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Foreground Content */}
      <AbsoluteFill
        style={{
          padding: "72px 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Top 3-Second Hook Pill */}
        <div
          style={{
            transform: `translateY(${(1 - hookBannerSpring) * -60}px) scale(${hookBannerSpring})`,
            backgroundColor: "rgba(239, 68, 68, 0.92)",
            padding: "18px 28px",
            borderRadius: 24,
            textAlign: "center",
            border: "3px solid #FFFFFF",
          }}
        >
          <div style={{ fontSize: 34, fontWeight: 900 }}>
            ⚡ AUTO B-ROLL + KARAOKE SUBTITLES
          </div>
        </div>

        {/* Bottom Karaoke Captions + Progress Bar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "12px 16px",
              padding: "28px 24px",
              backgroundColor: "rgba(0, 0, 0, 0.65)",
              borderRadius: 28,
              backdropFilter: "blur(8px)",
            }}
          >
            {captionWords.map((item, idx) => {
              const isActive = frame >= item.start && frame < item.end;
              const isPast = frame >= item.end;
              const popScale = isActive
                ? spring({
                    frame: frame - item.start,
                    fps,
                    config: { damping: 10, stiffness: 200 },
                  })
                : 1;

              return (
                <span
                  key={idx}
                  style={{
                    fontSize: 54,
                    fontWeight: 900,
                    padding: "6px 16px",
                    borderRadius: 14,
                    backgroundColor: isActive
                      ? item.highlight || "#FACC15"
                      : "transparent",
                    color: isActive
                      ? "#09090B"
                      : isPast
                      ? "#FFFFFF"
                      : "rgba(255,255,255,0.45)",
                    transform: `scale(${isActive ? 0.85 + popScale * 0.28 : 1})`,
                    display: "inline-block",
                  }}
                >
                  {item.word}
                </span>
              );
            })}
          </div>

          <div
            style={{
              height: 16,
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progressPct}%`,
                background: "linear-gradient(90deg, #FACC15, #F43F5E)",
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
