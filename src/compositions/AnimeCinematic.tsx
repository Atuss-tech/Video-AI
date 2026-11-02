import React from "react";
import { AiSceneShowcase } from "../components/AiSceneShowcase";

export const AnimeCinematic: React.FC = () => {
  return (
    <AiSceneShowcase
      styleBadge="🌸 STYLE 04 // MAKOTO SHINKAI / ANIME CINEMATIC"
      accentColor="#F43F5E"
      image1="anime_1.jpg"
      image2="anime_2.jpg"
      caption1="Cảnh 1: Phong cách Anime Makoto Shinkai — Hoàng hôn rực rỡ trên thành phố Cyberpunk"
      caption2="Cảnh 2: Nhân vật Anime điều khiển dàn giao diện Hologram như nhạc trưởng"
      voiceoverFile="vo_04.mp3"
      bgmFile="bgm_beat.wav"
    />
  );
};
