import React from "react";
import { AiSceneShowcase } from "../components/AiSceneShowcase";

export const VoxDocumentary: React.FC = () => {
  return (
    <AiSceneShowcase
      styleBadge="📸 STYLE 01 // PHOTOREALISTIC VOX DOCUMENTARY (8K AI)"
      accentColor="#FACC15"
      image1="doc_1.jpg"
      image2="doc_2.jpg"
      caption1="Cảnh 1: Trung tâm điều khiển AI toàn cầu tái hiện bằng ảnh điện ảnh 8K"
      caption2="Cảnh 2: Từ cỗ máy cơ học cổ điển dịch chuyển sang kỷ nguyên cáp quang AI"
      voiceoverFile="vo_01.mp3"
      bgmFile="bgm_doc.wav"
    />
  );
};
