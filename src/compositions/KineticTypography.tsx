import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SoundTrack } from "../components/SoundTrack";

export const KineticTypography: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dynamic background color invert on beat
  const isBeatInverted =
    (frame >= 45 && frame < 90) || (frame >= 135 && frame < 170);

  const bg = isBeatInverted ? "#FACC15" : "#09090B";
  const fg = isBeatInverted ? "#09090B" : "#FAFAFA";
  const accent = isBeatInverted ? "#DC2626" : "#FACC15";

  const words = [
    { text: "KHÔNG CẦN", start: 0, size: 110 },
    { text: "KÉO THẢ", start: 22, size: 145 },
    { text: "TIMELINE!", start: 45, size: 165 },
    { text: "CHỈ CẦN GÕ", start: 90, size: 115 },
    { text: "1 CÂU LỆNH", start: 112, size: 145 },
    { text: "XUẤT VIDEO 60FPS ⚡", start: 135, size: 105 },
  ];

  const activeIndex = words.reduce(
    (acc, w, idx) => (frame >= w.start ? idx : acc),
    0
  );
  const currentWord = words[activeIndex];

  const wordSpring = spring({
    frame: frame - currentWord.start,
    fps,
    config: { damping: 10, stiffness: 180 },
  });

  const rotateAngle = interpolate(
    wordSpring,
    [0, 1],
    [activeIndex % 2 === 0 ? -8 : 8, 0]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        color: fg,
        fontFamily: "'Inter', 'Impact', 'Arial Black', sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <SoundTrack
        voiceoverFile="vo_04.mp3"
        bgmFile="bgm_beat.wav"
        bgmVolume={0.4}
        sfxCues={[
          { file: "sfx_pop.wav", from: 1, volume: 0.7 },
          { file: "sfx_pop.wav", from: 22, volume: 0.7 },
          { file: "sfx_whoosh.wav", from: 45, volume: 0.75 },
          { file: "sfx_pop.wav", from: 90, volume: 0.7 },
          { file: "sfx_pop.wav", from: 112, volume: 0.7 },
          { file: "sfx_bell.wav", from: 135, volume: 0.7 },
        ]}
      />
      {/* Top & Bottom Marquee Strips */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          padding: "0 64px",
          fontSize: 20,
          fontWeight: 900,
          letterSpacing: 4,
          opacity: 0.75,
        }}
      >
        <span>STYLE 04 // KINETIC TYPOGRAPHY</span>
        <span>BEAT SYNC // 120 BPM</span>
        <span>ANTIGRAVITY × REMOTION</span>
      </div>

      {/* Main Kinetic Slam Word */}
      <div
        style={{
          transform: `scale(${0.4 + wordSpring * 0.6}) rotate(${rotateAngle}deg)`,
          textAlign: "center",
          padding: "24px 56px",
          border: `6px solid ${fg}`,
          boxShadow: `18px 18px 0px ${accent}`,
          backgroundColor: isBeatInverted ? "#FFFFFF" : "#18181B",
          color: isBeatInverted ? "#09090B" : "#FFFFFF",
        }}
      >
        <div
          style={{
            fontSize: currentWord.size,
            fontWeight: 900,
            letterSpacing: -3,
            lineHeight: 1,
            textTransform: "uppercase",
          }}
        >
          {currentWord.text}
        </div>
      </div>

      {/* Word Step Indicators */}
      <div
        style={{
          position: "absolute",
          bottom: 64,
          display: "flex",
          gap: 16,
        }}
      >
        {words.map((w, i) => (
          <div
            key={i}
            style={{
              width: i === activeIndex ? 64 : 20,
              height: 12,
              borderRadius: 999,
              backgroundColor: i <= activeIndex ? accent : "rgba(128,128,128,0.35)",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
