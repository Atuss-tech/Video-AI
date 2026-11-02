import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import transcriptSegments from "../data/transcript.json";

interface WordItem {
  word: string;
  start: number;
  end: number;
}

interface SegmentItem {
  id: number;
  start: number;
  end: number;
  rawStart: number;
  rawEnd: number;
  speaker: string;
  camera: string;
  zoom?: boolean;
  topic: string;
  text: string;
  vi: string;
  words: WordItem[];
}

const segments = transcriptSegments as SegmentItem[];

export const AutoEditedVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const currentTimeSec = frame / fps;

  // Find active segment
  const activeSegment =
    segments.find(
      (seg) => currentTimeSec >= seg.start && currentTimeSec <= seg.end
    ) || segments[segments.length - 1];

  const cameraMode = activeSegment?.camera || "wide";
  const isZoom = Boolean(activeSegment?.zoom);

  // Subtle slow push-in within each segment
  const segDuration = Math.max(0.5, (activeSegment?.end || 1) - (activeSegment?.start || 0));
  const segProgress = Math.min(
    1,
    Math.max(0, (currentTimeSec - (activeSegment?.start || 0)) / segDuration)
  );
  const dynamicScale = isZoom
    ? interpolate(segProgress, [0, 1], [1.08, 1.16])
    : interpolate(segProgress, [0, 1], [1.0, 1.05]);

  // Group words of the active segment into 5-word chunks for crisp Karaoke captions
  const segWords = activeSegment?.words || [];
  const chunkSize = 5;
  const activeWordIdx = segWords.findIndex(
    (w) => currentTimeSec >= w.start && currentTimeSec <= w.end
  );
  const passedWordsCount = segWords.filter((w) => w.end <= currentTimeSec).length;
  const currentChunkIndex =
    activeWordIdx >= 0
      ? Math.floor(activeWordIdx / chunkSize)
      : Math.min(
          Math.max(0, Math.ceil(segWords.length / chunkSize) - 1),
          Math.floor(passedWordsCount / chunkSize)
        );

  const visibleWords = segWords.slice(
    currentChunkIndex * chunkSize,
    (currentChunkIndex + 1) * chunkSize
  );

  const progressPct = interpolate(frame, [0, durationInFrames], [0, 100], {
    extrapolateRight: "clamp",
  });

  // Camera Cut Spring Entrance (Remotion Transitions physics)
  const segStartFrame = Math.round((activeSegment?.start || 0) * fps);
  const framesIntoSeg = Math.max(0, frame - segStartFrame);
  const cutSpring = spring({
    frame: framesIntoSeg,
    fps,
    config: { damping: 15, stiffness: 200, mass: 0.8 },
  });

  // 3D Pixar Host Animated Subtle Motion (idle breathing + talking micro-pulse)
  const hostBreathingX = Math.sin(frame / 16) * 4;
  const hostBreathingY = Math.cos(frame / 20) * 3;
  const hostTalkPulse = 1 + Math.sin(frame / 6) * 0.015;

  // Compute horizontal pan for video
  const panHostLeftPx = -518;
  const panCustomerLeftPx = -1815;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#061410",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Subtle Ambient Background Beat (very low so speech is crystal clear) */}
      <Audio src={staticFile("audio/bgm_beat.wav")} volume={0.04} />

      {/* Soft Whoosh SFX on topic changes */}
      {segments.slice(1).map((seg) => (
        <Sequence
          key={`sfx-${seg.id}`}
          from={Math.max(1, Math.round(seg.start * fps))}
          durationInFrames={30}
        >
          <Audio src={staticFile("audio/sfx_pop.wav")} volume={0.18} />
        </Sequence>
      ))}

      {/* Dark Emerald Haplast Studio Backdrop */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 35%, #0D3B2E 0%, #061410 65%, #030907 100%)",
        }}
      />

      {/* 1. REAL VIDEO ALWAYS VISIBLE (CƠ THỂ THẬT, ÁO XANH THẬT, CỬ CHỈ TAY THẬT 100%) */}
      <AbsoluteFill
        style={
          cameraMode === "wide"
            ? {
                top: 430,
                left: 36,
                width: 1008,
                height: 567,
                borderRadius: 32,
                overflow: "hidden",
                border: "4px solid rgba(16, 185, 129, 0.85)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.85)",
                transform: `scale(${0.96 + cutSpring * 0.04})`,
              }
            : {
                top: 0,
                left: 0,
                width: 1080,
                height: 1920,
                overflow: "hidden",
                transform: `scale(${0.97 + cutSpring * 0.03})`,
              }
        }
      >
        <OffthreadVideo
          src={staticFile("edited_video.mp4")}
          style={
            cameraMode === "wide"
              ? {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `scale(${dynamicScale})`,
                }
              : {
                  position: "absolute",
                  top: 0,
                  left: cameraMode === "host" ? panHostLeftPx : panCustomerLeftPx,
                  width: 3413,
                  height: 1920,
                  maxWidth: "none",
                  transform: `scale(${dynamicScale})`,
                  transformOrigin: `${Math.abs(cameraMode === "host" ? panHostLeftPx : panCustomerLeftPx) + 540}px 960px`,
                }
          }
        />
      </AbsoluteFill>

      {/* 2. KHUÔN MẶT HOẠT HÌNH 3D ĐÈ LÊN MẶT THẬT (CHỈ THAY MẶT, GIỮ TOÀN BỘ CỬ CHỈ TAY VÀ DÁNG NGỒI THẬT) */}
      {cameraMode === "host" && (
        <div
          style={{
            position: "absolute",
            top: 770,
            left: 368,
            width: 542,
            height: 542,
            transform: `translate(${hostBreathingX}px, ${hostBreathingY}px) rotate(${Math.sin(frame / 20) * 2}deg) scale(${hostTalkPulse * (0.97 + cutSpring * 0.03)})`,
            transformOrigin: "50% 85%",
            filter: "drop-shadow(0 14px 28px rgba(0,0,0,0.5))",
            pointerEvents: "none",
          }}
        >
          <Img
            src={staticFile("images/host_cartoon_head.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      )}

      {/* 3. KHUÔN MẶT HOẠT HÌNH TRONG GÓC QUAY RỘNG (WIDE SHOT) */}
      {cameraMode === "wide" && (
        <div
          style={{
            position: "absolute",
            top: 659,
            left: 298,
            width: 160,
            height: 160,
            transform: `translate(${hostBreathingX * 0.3}px, ${hostBreathingY * 0.3}px) scale(${0.96 + cutSpring * 0.04})`,
            filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.5))",
            pointerEvents: "none",
          }}
        >
          <Img
            src={staticFile("images/host_cartoon_head.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      )}

      {/* Top & Bottom Cinema Gradients for Readability */}
      <AbsoluteFill
        style={{
          background:
            cameraMode === "wide"
              ? "linear-gradient(180deg, rgba(3,9,7,0.75) 0%, rgba(3,9,7,0) 28%, rgba(3,9,7,0) 60%, rgba(3,9,7,0.92) 100%)"
              : "linear-gradient(180deg, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.15) 24%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.88) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Top Header: Haplast Branding & Active Camera / Topic Pill */}
      <div
        style={{
          position: "absolute",
          top: 58,
          left: 44,
          right: 44,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.95)",
              color: "#022C22",
              padding: "10px 24px",
              borderRadius: 999,
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: 1.2,
              boxShadow: "0 8px 24px rgba(16, 185, 129, 0.35)",
            }}
          >
            🌿 HAPLAST GROUP • UK CLIENT
          </div>

          <div
            style={{
              backgroundColor:
                activeSegment?.speaker === "customer"
                  ? "rgba(250, 204, 21, 0.95)"
                  : "rgba(15, 23, 42, 0.88)",
              color:
                activeSegment?.speaker === "customer" ? "#09090B" : "#38BDF8",
              padding: "10px 22px",
              borderRadius: 999,
              fontSize: 20,
              fontWeight: 800,
              border: "2px solid rgba(255,255,255,0.18)",
            }}
          >
            {cameraMode === "wide"
              ? "🎬 2-SHOT WIDE CAM"
              : activeSegment?.speaker === "customer"
              ? "🇬🇧 UK CUSTOMER CAM"
              : "✨ 3D PIXAR HOST CAM"}
          </div>
        </div>

        {/* Topic Callout Banner */}
        <div
          style={{
            alignSelf: "flex-start",
            backgroundColor: "rgba(9, 13, 22, 0.82)",
            backdropFilter: "blur(12px)",
            borderLeft: "6px solid #10B981",
            padding: "12px 24px",
            borderRadius: "0 18px 18px 0",
            color: "#E2E8F0",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 0.4,
            boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
          }}
        >
          {activeSegment?.topic}
        </div>
      </div>

      {/* Extra Center Headline when in Wide 2-Shot Mode */}
      {cameraMode === "wide" && (
        <div
          style={{
            position: "absolute",
            top: 255,
            left: 48,
            right: 48,
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: "#FACC15",
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            CUSTOMER TESTIMONIAL AT FACTORY
          </div>
          <div
            style={{
              color: "#FFFFFF",
              fontSize: 44,
              fontWeight: 900,
              lineHeight: 1.2,
              textShadow: "0 6px 24px rgba(0,0,0,0.8)",
            }}
          >
            Khách Hàng Anh Quốc Thăm Nhà Máy Haplast
          </div>
        </div>
      )}

      {/* Bottom Bilingual Subtitles (English Karaoke + Vietnamese Subtitles) */}
      <div
        style={{
          position: "absolute",
          bottom: 96,
          left: 40,
          right: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        {/* Speaker Tag */}
        <div
          style={{
            backgroundColor:
              activeSegment?.speaker === "customer"
                ? "#FACC15"
                : "#10B981",
            color: "#052E16",
            padding: "6px 20px",
            borderRadius: 999,
            fontSize: 20,
            fontWeight: 900,
            letterSpacing: 1,
            textTransform: "uppercase",
            boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
          }}
        >
          {activeSegment?.speaker === "customer"
            ? "★ UK Client (Khách hàng Anh Quốc)"
            : "✨ 3D Host (Haplast Export Team)"}
        </div>

        {/* English Word-by-Word Karaoke Box */}
        {visibleWords.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "10px 14px",
              backgroundColor: "rgba(9, 13, 22, 0.86)",
              padding: "22px 28px",
              borderRadius: 28,
              border: "2.5px solid rgba(255,255,255,0.2)",
              boxShadow: "0 18px 45px rgba(0,0,0,0.8)",
              width: "100%",
            }}
          >
            {visibleWords.map((item, idx) => {
              const isCurrent =
                currentTimeSec >= item.start && currentTimeSec <= item.end;
              const isHaplast = item.word.toLowerCase().includes("haplast");
              const pop = isCurrent
                ? spring({
                    frame: Math.max(
                      0,
                      Math.round((currentTimeSec - item.start) * fps)
                    ),
                    fps,
                    config: { damping: 12, stiffness: 220 },
                  })
                : 1;

              const activeBg = isHaplast
                ? "#10B981"
                : activeSegment?.speaker === "customer"
                ? "#FACC15"
                : "#38BDF8";

              return (
                <span
                  key={`${item.word}-${idx}`}
                  style={{
                    fontSize: 46,
                    fontWeight: 900,
                    padding: "4px 14px",
                    borderRadius: 14,
                    backgroundColor: isCurrent ? activeBg : "transparent",
                    color: isCurrent
                      ? "#09090B"
                      : isHaplast
                      ? "#34D399"
                      : "#FFFFFF",
                    transform: `scale(${isCurrent ? 0.94 + pop * 0.14 : 1})`,
                    display: "inline-block",
                    textShadow: isCurrent
                      ? "none"
                      : "0 4px 12px rgba(0,0,0,0.9)",
                  }}
                >
                  {item.word}
                </span>
              );
            })}
          </div>
        )}

        {/* Vietnamese Translation Subtitle Bar */}
        {activeSegment?.vi && (
          <div
            style={{
              backgroundColor: "rgba(6, 78, 59, 0.92)",
              border: "2px solid rgba(52, 211, 153, 0.5)",
              padding: "16px 26px",
              borderRadius: 22,
              color: "#ECFDF5",
              fontSize: 28,
              fontWeight: 700,
              lineHeight: 1.35,
              textAlign: "center",
              boxShadow: "0 12px 32px rgba(0,0,0,0.7)",
              width: "100%",
            }}
          >
            🇻🇳 {activeSegment.vi}
          </div>
        )}
      </div>

      {/* Bottom Progress Bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 14,
          backgroundColor: "rgba(255,255,255,0.15)",
        }}
      >
        <div
          style={{
            width: `${progressPct}%`,
            height: "100%",
            background: "linear-gradient(90deg, #10B981, #FACC15)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
