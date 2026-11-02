import React from "react";
import { AiSceneShowcase } from "../components/AiSceneShowcase";

export const ProductWebShowcase: React.FC = () => {
  return (
    <AiSceneShowcase
      styleBadge="💎 STYLE 03 // LUXURY STUDIO PRODUCT PHOTOGRAPHY"
      accentColor="#EC4899"
      image1="prod_1.jpg"
      image2="prod_2.jpg"
      caption1="Cảnh 1: Quảng cáo Mỹ phẩm / Serum cao cấp với giọt nước & ánh sáng Studio"
      caption2="Cảnh 2: Quảng cáo Tai nghe Công nghệ với hạt sóng âm Neon lơ lửng"
      voiceoverFile="vo_03.mp3"
      bgmFile="bgm_tech.wav"
    />
  );
};
