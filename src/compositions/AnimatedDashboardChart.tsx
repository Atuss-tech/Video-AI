import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SoundTrack } from "../components/SoundTrack";

export const AnimatedDashboardChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bars = [
    { label: "Tháng 1", value: 32, color: "#38BDF8" },
    { label: "Tháng 2", value: 48, color: "#6366F1" },
    { label: "Tháng 3", value: 65, color: "#8B5CF6" },
    { label: "Tháng 4", value: 84, color: "#EC4899" },
    { label: "Tháng 5", value: 100, color: "#10B981" },
  ];

  const revenueCounter = interpolate(frame, [10, 140], [12400, 148900], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const conversionCounter = interpolate(frame, [10, 140], [1.8, 8.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#060B19",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        color: "#F8FAFC",
        padding: "56px 80px",
      }}
    >
      <SoundTrack
        voiceoverFile="vo_06.mp3"
        bgmFile="bgm_tech.wav"
        bgmVolume={0.35}
        sfxCues={[
          { file: "sfx_pop.wav", from: 25, volume: 0.5 },
          { file: "sfx_pop.wav", from: 41, volume: 0.55 },
          { file: "sfx_pop.wav", from: 57, volume: 0.6 },
          { file: "sfx_pop.wav", from: 73, volume: 0.65 },
          { file: "sfx_bell.wav", from: 89, volume: 0.65 },
        ]}
      />
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          paddingBottom: 24,
        }}
      >
        <div>
          <span
            style={{
              color: "#10B981",
              fontWeight: 800,
              fontSize: 16,
              letterSpacing: 2,
            }}
          >
            STYLE 06 // REAL-TIME ANIMATED UI DASHBOARD & 5-COLUMN CHART
          </span>
          <h1 style={{ fontSize: 46, fontWeight: 900, margin: "8px 0 0" }}>
            Báo Cáo Tăng Trưởng & KPI Thời Gian Thực
          </h1>
        </div>
        <div
          style={{
            backgroundColor: "rgba(16, 185, 129, 0.15)",
            border: "1px solid #10B981",
            color: "#34D399",
            padding: "10px 22px",
            borderRadius: 999,
            fontWeight: 800,
            fontSize: 18,
          }}
        >
          ● LIVE DATA SYNC
        </div>
      </div>

      {/* Top KPI Cards */}
      <div style={{ display: "flex", gap: 28, marginTop: 28 }}>
        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(30, 41, 59, 0.55)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20,
            padding: "22px 28px",
          }}
        >
          <div style={{ fontSize: 16, color: "#94A3B8", fontWeight: 600 }}>
            DOANH THU THÁNG (USD)
          </div>
          <div style={{ fontSize: 48, fontWeight: 900, marginTop: 6, color: "#38BDF8" }}>
            ${Math.round(revenueCounter).toLocaleString("en-US")}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(30, 41, 59, 0.55)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20,
            padding: "22px 28px",
          }}
        >
          <div style={{ fontSize: 16, color: "#94A3B8", fontWeight: 600 }}>
            TỶ LỆ CHUYỂN ĐỔI (CR%)
          </div>
          <div style={{ fontSize: 48, fontWeight: 900, marginTop: 6, color: "#10B981" }}>
            {conversionCounter.toFixed(1)}% ▲
          </div>
        </div>

        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(30, 41, 59, 0.55)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20,
            padding: "22px 28px",
          }}
        >
          <div style={{ fontSize: 16, color: "#94A3B8", fontWeight: 600 }}>
            VIDEO ĐÃ RENDER TỰ ĐỘNG
          </div>
          <div style={{ fontSize: 48, fontWeight: 900, marginTop: 6, color: "#F472B6" }}>
            {Math.round(interpolate(frame, [0, 140], [12, 450], { extrapolateRight: "clamp" }))} clips
          </div>
        </div>
      </div>

      {/* 5-Column Animated Bar Chart */}
      <div
        style={{
          marginTop: 32,
          flex: 1,
          backgroundColor: "rgba(15, 23, 42, 0.8)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 24,
          padding: "36px 56px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 40,
        }}
      >
        {bars.map((bar, idx) => {
          const barSpring = spring({
            frame: frame - (25 + idx * 16),
            fps,
            config: { damping: 12, stiffness: 100 },
          });
          const heightPx = (bar.value / 100) * 340 * barSpring;

          return (
            <div
              key={idx}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: bar.color,
                  opacity: barSpring,
                }}
              >
                +{Math.round(bar.value * barSpring)}%
              </div>
              <div
                style={{
                  width: "100%",
                  height: Math.max(8, heightPx),
                  background: `linear-gradient(180deg, ${bar.color}, ${bar.color}44)`,
                  borderRadius: "16px 16px 6px 6px",
                  boxShadow: `0 0 30px ${bar.color}55`,
                  borderTop: `3px solid #FFFFFF`,
                }}
              />
              <div style={{ fontSize: 20, fontWeight: 700, color: "#CBD5E1" }}>
                {bar.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
