import React from "react";
import { AiSceneShowcase } from "../components/AiSceneShowcase";

export const ExplainerAnimation: React.FC = () => {
  return (
    <AiSceneShowcase
      styleBadge="🧸 STYLE 02 // 3D PIXAR / DISNEY ANIMATION"
      accentColor="#38BDF8"
      image1="pixar_1.jpg"
      image2="pixar_2.jpg"
      caption1="Cảnh 1: Đạo diễn Robot 3D Pixar tự động bấm máy dựng phim trong Studio"
      caption2="Cảnh 2: Creator thảnh thơi thưởng thức cà phê khi AI xử lý toàn bộ khung hình"
      voiceoverFile="vo_02.mp3"
      bgmFile="bgm_tech.wav"
    />
  );
};
