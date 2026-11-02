import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SoundTrack } from "../components/SoundTrack";

export const YouTubeIntroCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoReveal = spring({
    frame: frame - 5,
    fps,
    config: { damping: 12, stiffness: 110 },
  });

  // Simulated mouse click at frame 95
  const isClicked = frame >= 95;

  const cursorX = interpolate(frame, [45, 90], [420, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorY = interpolate(frame, [45, 90], [220, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const buttonScale =
    frame >= 90 && frame <= 102
      ? 0.9
      : spring({
          frame: isClicked ? frame - 95 : frame - 25,
          fps,
          config: { damping: 10, stiffness: 160 },
        });

  const bellShake =
    isClicked && frame < 150
      ? Math.sin((frame - 95) * 0.8) * 18
      : 0;

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 40%, #1E293B 0%, #020617 75%)",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        color: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SoundTrack
        voiceoverFile="vo_07.mp3"
        bgmFile="bgm_beat.wav"
        bgmVolume={0.32}
        sfxCues={[
          { file: "sfx_whoosh.wav", from: 5, volume: 0.65 },
          { file: "sfx_pop.wav", from: 25, volume: 0.6 },
          { file: "sfx_click.wav", from: 92, volume: 0.85 },
          { file: "sfx_bell.wav", from: 96, volume: 0.85 },
        ]}
      />
      {/* Top Label */}
      <div
        style={{
          position: "absolute",
          top: 48,
          backgroundColor: "rgba(255,255,255,0.08)",
          padding: "8px 24px",
          borderRadius: 999,
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: 2,
          color: "#94A3B8",
        }}
      >
        STYLE 07 // YOUTUBE INTRO, LOGO REVEAL & INTERACTIVE SUBSCRIBE CTA
      </div>

      {/* Brand Avatar / Logo Reveal */}
      <div
        style={{
          transform: `scale(${logoReveal})`,
          opacity: logoReveal,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: 36,
            background: "linear-gradient(135deg, #EF4444, #F97316)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 68,
            boxShadow: "0 20px 60px rgba(239, 68, 68, 0.45)",
            border: "4px solid #FFFFFF",
          }}
        >
          🎬
        </div>
        <h1
          style={{
            fontSize: 64,
            fontWeight: 900,
            margin: "24px 0 8px",
            letterSpacing: -1.5,
          }}
        >
          ANTIGRAVITY VIDEO STUDIO
        </h1>
        <p style={{ fontSize: 24, color: "#94A3B8", margin: 0 }}>
          Tự động hóa sản xuất Video bằng AI Agent & Remotion
        </p>
      </div>

      {/* Interactive Subscribe Button + Bell */}
      <div
        style={{
          marginTop: 52,
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 20,
          transform: `scale(${buttonScale})`,
        }}
      >
        <div
          style={{
            backgroundColor: isClicked ? "#334155" : "#EF4444",
            color: "#FFFFFF",
            padding: "22px 54px",
            borderRadius: 999,
            fontSize: 34,
            fontWeight: 900,
            letterSpacing: 1,
            boxShadow: isClicked
              ? "0 10px 30px rgba(0,0,0,0.4)"
              : "0 16px 50px rgba(239, 68, 68, 0.6)",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span>{isClicked ? "✔ ĐÃ ĐĂNG KÝ" : "▶ ĐĂNG KÝ KÊNH"}</span>
        </div>

        {/* Notification Bell */}
        <div
          style={{
            width: 82,
            height: 82,
            borderRadius: "50%",
            backgroundColor: isClicked ? "#FACC15" : "rgba(255,255,255,0.12)",
            color: isClicked ? "#09090B" : "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            transform: `rotate(${bellShake}deg)`,
            boxShadow: isClicked ? "0 0 35px rgba(250, 204, 21, 0.6)" : "none",
          }}
        >
          🔔
        </div>

        {/* Animated Pointer Cursor */}
        <div
          style={{
            position: "absolute",
            right: 70,
            bottom: -24,
            transform: `translate(${cursorX}px, ${cursorY}px) scale(${
              frame >= 90 && frame <= 100 ? 0.8 : 1
            })`,
            fontSize: 52,
            filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.6))",
            pointerEvents: "none",
          }}
        >
          👆
        </div>
      </div>
    </AbsoluteFill>
  );
};
