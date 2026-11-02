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
import { SoundTrack, SfxCue } from "./SoundTrack";

interface AiSceneShowcaseProps {
  styleBadge: string;
  accentColor: string;
  image1: string;
  image2: string;
  caption1: string;
  caption2: string;
  voiceoverFile: string;
  bgmFile: string;
  sfxCues?: SfxCue[];
}

export const AiSceneShowcase: React.FC<AiSceneShowcaseProps> = ({
  styleBadge,
  accentColor,
  image1,
  image2,
  caption1,
  caption2,
  voiceoverFile,
  bgmFile,
  sfxCues = [
    { file: "sfx_whoosh.wav", from: 5, volume: 0.55 },
    { file: "sfx_whoosh.wav", from: 118, volume: 0.7 },
    { file: "sfx_bell.wav", from: 124, volume: 0.55 },
  ],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isSecondScene = frame >= 120;

  // Scene 1 Ken Burns (Zoom in + slow pan right)
  const scale1 = interpolate(frame, [0, 125], [1.02, 1.18], {
    extrapolateRight: "clamp",
  });
  const panX1 = interpolate(frame, [0, 125], [0, -35], {
    extrapolateRight: "clamp",
  });

  // Scene 2 Ken Burns (Zoom out from 1.2 -> 1.04 + slow pan left)
  const scale2 = interpolate(frame, [115, 240], [1.2, 1.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const panX2 = interpolate(frame, [115, 240], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Crossfade opacity around frame 120
  const scene2Opacity = interpolate(frame, [112, 126], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cinematic camera flash at transition (frame 120)
  const flashOpacity = interpolate(
    frame,
    [116, 120, 128],
    [0, 0.75, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const subPop = spring({
    frame: isSecondScene ? frame - 122 : frame - 6,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        overflow: "hidden",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <SoundTrack
        voiceoverFile={voiceoverFile}
        bgmFile={bgmFile}
        bgmVolume={0.35}
        sfxCues={sfxCues}
      />

      {/* SCENE 1 FULL-SCREEN AI IMAGE */}
      <AbsoluteFill
        style={{
          transform: `scale(${scale1}) translateX(${panX1}px)`,
        }}
      >
        <Img
          src={staticFile(`images/${image1}`)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>

      {/* SCENE 2 FULL-SCREEN AI IMAGE */}
      <AbsoluteFill
        style={{
          opacity: scene2Opacity,
          transform: `scale(${scale2}) translateX(${panX2}px)`,
        }}
      >
        <Img
          src={staticFile(`images/${image2}`)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>

      {/* Subtle Cinematic Vignette & Bottom Gradient */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 68%, rgba(0,0,0,0.85) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Transition Flash Overlay */}
      <AbsoluteFill
        style={{
          backgroundColor: "#FFFFFF",
          opacity: flashOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Top Corner Style Tag (Minimal) */}
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 48,
          backgroundColor: "rgba(0, 0, 0, 0.65)",
          borderLeft: `5px solid ${accentColor}`,
          padding: "10px 22px",
          borderRadius: "0 12px 12px 0",
          color: "#FFFFFF",
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: 1.5,
          backdropFilter: "blur(8px)",
        }}
      >
        {styleBadge} • SCENE {isSecondScene ? "02 / 02" : "01 / 02"}
      </div>

      {/* Minimal Cinematic Subtitle at Bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 44,
          left: 80,
          right: 80,
          display: "flex",
          justifyContent: "center",
          transform: `translateY(${(1 - subPop) * 25}px)`,
          opacity: subPop,
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(9, 13, 22, 0.82)",
            border: `2px solid ${accentColor}`,
            padding: "16px 38px",
            borderRadius: 999,
            color: "#FFFFFF",
            fontSize: 28,
            fontWeight: 700,
            textAlign: "center",
            boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
          }}
        >
          {isSecondScene ? caption2 : caption1}
        </div>
      </div>
    </AbsoluteFill>
  );
};
