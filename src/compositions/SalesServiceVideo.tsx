import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import salesTimeline from "../data/sales_timeline.json";

export const SalesServiceVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const currentTimeSec = frame / fps;

  const scenes = salesTimeline.scenes || [];
  const activeScene =
    scenes.find(
      (s: any) => currentTimeSec >= s.start && currentTimeSec <= s.end
    ) || scenes[scenes.length - 1];

  const sceneStartFrame = Math.round((activeScene?.start || 0) * fps);
  const localFrame = Math.max(0, frame - sceneStartFrame);
  const sceneDurSec = Math.max(1, activeScene?.duration || 6);
  const sceneProgress = Math.min(
    1,
    Math.max(0, localFrame / (sceneDurSec * fps))
  );

  const enterSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 150 },
  });

  // Unified Color System:
  // Pain scenes (1 & 2) use Warm Amber-Red Warning (#F97316 / #EF4444) on Deep Slate (#090D16)
  // Solution & CTA scenes (3, 4, 5) use Emerald Tech (#10B981 / #34D399) on Deep Slate (#090D16)
  const isPain = activeScene?.phase === "pain";
  const isCta = activeScene?.phase === "cta";
  const primaryAccent = isPain ? "#F97316" : isCta ? "#FACC15" : "#10B981";
  const badgeBg = isPain
    ? "rgba(249, 115, 22, 0.18)"
    : isCta
    ? "rgba(250, 204, 21, 0.2)"
    : "rgba(16, 185, 129, 0.18)";

  // Group words into 5-word chunks for bottom Karaoke bar
  const words = activeScene?.words || [];
  const chunkSize = 5;
  const activeWordIdx = words.findIndex(
    (w: any) => currentTimeSec >= w.start && currentTimeSec <= w.end
  );
  const passedCount = words.filter((w: any) => w.end <= currentTimeSec).length;
  const chunkIdx =
    activeWordIdx >= 0
      ? Math.floor(activeWordIdx / chunkSize)
      : Math.min(
          Math.max(0, Math.ceil(words.length / chunkSize) - 1),
          Math.floor(passedCount / chunkSize)
        );
  const visibleWords = words.slice(
    chunkIdx * chunkSize,
    (chunkIdx + 1) * chunkSize
  );

  const progressPct = interpolate(frame, [0, durationInFrames], [0, 100], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#070B12",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Giọng đọc thuyết minh */}
      <Audio src={staticFile(salesTimeline.audioFile)} volume={1} />

      {/* Nhạc nền nhẹ nâng nhịp độ */}
      <Audio src={staticFile("audio/bgm_beat.wav")} volume={0.1} />

      {/* Hiệu ứng âm thanh chuyển cảnh đồng bộ */}
      {scenes.map((s: any, idx: number) => (
        <Sequence
          key={`sfx-${s.id}`}
          from={Math.max(1, Math.round(s.start * fps))}
          durationInFrames={30}
        >
          <Audio
            src={staticFile(
              idx % 2 === 0 ? "audio/sfx_whoosh.wav" : "audio/sfx_pop.wav"
            )}
            volume={0.4}
          />
        </Sequence>
      ))}

      {/* Nền đồng bộ xuyên suốt 5 cảnh: Dark Slate + Subtle Radial Glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 20%, ${primaryAccent}26 0%, #070B12 65%, #04070B 100%)`,
        }}
      />

      {/* =================================================================== */}
      {/* 1. TOP BAR ĐỒNG BỘ (y: 54px)                                        */}
      {/* =================================================================== */}
      <div
        style={{
          position: "absolute",
          top: 54,
          left: 48,
          right: 48,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: badgeBg,
            border: `2px solid ${primaryAccent}`,
            color: primaryAccent,
            padding: "8px 22px",
            borderRadius: 999,
            fontSize: 20,
            fontWeight: 900,
            letterSpacing: 1.2,
          }}
        >
          {activeScene?.stepLabel}
        </div>

        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            border: "1.5px solid rgba(255,255,255,0.16)",
            color: "#E2E8F0",
            padding: "8px 20px",
            borderRadius: 999,
            fontSize: 19,
            fontWeight: 800,
          }}
        >
          ⚡ WORKFLOW & WEB AGENCY
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. TIÊU ĐỀ CHÍNH ĐỒNG BỘ (y: 132px -> 355px)                        */}
      {/* =================================================================== */}
      <div
        style={{
          position: "absolute",
          top: 132,
          left: 48,
          right: 48,
          textAlign: "center",
          transform: `translateY(${interpolate(enterSpring, [0, 1], [-24, 0])}px)`,
          opacity: enterSpring,
        }}
      >
        <div
          style={{
            color: "#FFFFFF",
            fontSize: 50,
            fontWeight: 900,
            lineHeight: 1.18,
            whiteSpace: "pre-line",
            letterSpacing: -0.5,
            textShadow: "0 8px 28px rgba(0,0,0,0.85)",
          }}
        >
          {activeScene?.headline}
        </div>
        <div
          style={{
            color: "#94A3B8",
            fontSize: 24,
            fontWeight: 600,
            marginTop: 12,
            lineHeight: 1.35,
          }}
        >
          {activeScene?.subheadline}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. KHUNG ẢNH THỰC TẾ ĐỒNG BỘ XUYÊN SUỐT 5 CẢNH (y: 365px -> 915px)  */}
      {/* =================================================================== */}
      <div
        style={{
          position: "absolute",
          top: 365,
          left: 48,
          right: 48,
          height: 545,
          borderRadius: 30,
          overflow: "hidden",
          border: `3.5px solid ${primaryAccent}AA`,
          boxShadow: `0 25px 65px rgba(0,0,0,0.85), 0 0 35px ${primaryAccent}22`,
          transform: `scale(${0.95 + enterSpring * 0.05})`,
          opacity: enterSpring,
        }}
      >
        <Img
          src={staticFile(activeScene?.illustration || "images/real_pain_1.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${interpolate(sceneProgress, [0, 1], [1.01, 1.12])})`,
          }}
        />
        {/* Thanh chú thích ảnh thực tế nằm dưới đáy khung ảnh */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background:
              "linear-gradient(180deg, rgba(7,11,18,0) 0%, rgba(7,11,18,0.92) 55%, rgba(7,11,18,0.98) 100%)",
            padding: "42px 24px 18px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              backgroundColor: primaryAccent,
              display: "inline-block",
            }}
          />
          <span
            style={{
              color: "#F8FAFC",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 0.8,
            }}
          >
            {activeScene?.photoTag}
          </span>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 4. KHỐI THẺ BẰNG CHỨNG / QUY TRÌNH ĐỒNG BỘ (y: 940px -> 1365px)     */}
      {/* =================================================================== */}
      <div
        style={{
          position: "absolute",
          top: 940,
          left: 48,
          right: 48,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {(activeScene?.cards || []).map((card: any, idx: number) => {
          const cardPop = spring({
            frame: Math.max(0, localFrame - (idx + 1) * 10),
            fps,
            config: { damping: 13, stiffness: 160 },
          });

          return (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 20,
                backgroundColor: "rgba(15, 23, 42, 0.88)",
                border: `2.5px solid ${primaryAccent}66`,
                borderLeft: `8px solid ${primaryAccent}`,
                borderRadius: 24,
                padding: "22px 26px",
                transform: `translateY(${interpolate(
                  cardPop,
                  [0, 1],
                  [25, 0]
                )}px)`,
                opacity: cardPop,
                boxShadow: "0 16px 40px rgba(0,0,0,0.65)",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    color: primaryAccent,
                    fontSize: 19,
                    fontWeight: 900,
                    letterSpacing: 1,
                    marginBottom: 6,
                  }}
                >
                  {card.tag}
                </div>
                <div
                  style={{
                    color: "#FFFFFF",
                    fontSize: 28,
                    fontWeight: 800,
                    lineHeight: 1.25,
                  }}
                >
                  {card.title}
                </div>
                <div
                  style={{
                    color: "#CBD5E1",
                    fontSize: 22,
                    fontWeight: 500,
                    marginTop: 6,
                    lineHeight: 1.3,
                  }}
                >
                  {card.desc}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: primaryAccent,
                  color: "#04070B",
                  padding: "12px 20px",
                  borderRadius: 16,
                  fontSize: 20,
                  fontWeight: 900,
                  whiteSpace: "nowrap",
                }}
              >
                {card.status}
              </div>
            </div>
          );
        })}
      </div>

      {/* =================================================================== */}
      {/* 5. THANH PHỤ ĐỀ KARAOKE ĐỒNG BỘ DƯỚI ĐÁY (bottom: 92px)             */}
      {/* =================================================================== */}
      <div
        style={{
          position: "absolute",
          bottom: 92,
          left: 48,
          right: 48,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {visibleWords.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "10px 14px",
              backgroundColor: "rgba(9, 13, 22, 0.92)",
              padding: "24px 28px",
              borderRadius: 28,
              border: "2px solid rgba(255,255,255,0.18)",
              boxShadow: "0 18px 45px rgba(0,0,0,0.85)",
              width: "100%",
            }}
          >
            {visibleWords.map((item: any, idx: number) => {
              const isCurrent =
                currentTimeSec >= item.start && currentTimeSec <= item.end;
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

              return (
                <span
                  key={`${item.word}-${idx}`}
                  style={{
                    fontSize: 46,
                    fontWeight: 900,
                    padding: "4px 14px",
                    borderRadius: 12,
                    backgroundColor: isCurrent ? primaryAccent : "transparent",
                    color: isCurrent ? "#04070B" : "#FFFFFF",
                    transform: `scale(${isCurrent ? 0.95 + pop * 0.14 : 1})`,
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
      </div>

      {/* Thanh tiến trình dưới đáy */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 14,
          backgroundColor: "rgba(255,255,255,0.12)",
        }}
      >
        <div
          style={{
            width: `${progressPct}%`,
            height: "100%",
            background: `linear-gradient(90deg, #F97316, #10B981, #FACC15)`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
