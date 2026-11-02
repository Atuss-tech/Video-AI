import React from "react";
import { Composition, Folder } from "remotion";
import { AutoEditedVideo } from "./compositions/AutoEditedVideo";
import { SalesServiceVideo } from "./compositions/SalesServiceVideo";
import { VoxDocumentary } from "./compositions/VoxDocumentary";
import { ExplainerAnimation } from "./compositions/ExplainerAnimation";
import { ProductWebShowcase } from "./compositions/ProductWebShowcase";
import { AnimeCinematic } from "./compositions/AnimeCinematic";
import { TikTokReelsShort } from "./compositions/TikTokReelsShort";
import { AnimatedDashboardChart } from "./compositions/AnimatedDashboardChart";
import { YouTubeIntroCTA } from "./compositions/YouTubeIntroCTA";
import { KineticTypography } from "./compositions/KineticTypography";
import transcriptData from "./data/transcript.json";
import salesTimeline from "./data/sales_timeline.json";

export const RemotionRoot: React.FC = () => {
  const segments = Array.isArray(transcriptData) ? transcriptData : [];
  const lastEndSec =
    segments.length > 0 ? segments[segments.length - 1].end : 60.14;
  const autoEditFrames = Math.max(90, Math.round(lastEndSec * 30));
  const salesFrames = Math.max(
    90,
    Math.round((salesTimeline.totalDuration || 38.8) * 30)
  );

  return (
    <>
      <Folder name="00-Video-Ban-Dich-Vu-Va-Auto-Edit">
        <Composition
          id="00-Quang-Ba-Dich-Vu-Workflow"
          component={SalesServiceVideo}
          durationInFrames={salesFrames}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="00-Auto-Edited-Raw-Video"
          component={AutoEditedVideo}
          durationInFrames={autoEditFrames}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
      <Folder name="01-Tat-Ca-Style-Video-Mau">
        <Composition
          id="01-Vox-Documentary-8K-AI"
          component={VoxDocumentary}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="02-Pixar-3D-Animation"
          component={ExplainerAnimation}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="03-Studio-Product-Commercial"
          component={ProductWebShowcase}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="04-Anime-Makoto-Shinkai"
          component={AnimeCinematic}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="05-TikTok-Reels-Short-9x16"
          component={TikTokReelsShort}
          durationInFrames={240}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="06-Animated-Dashboard-Chart"
          component={AnimatedDashboardChart}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="07-YouTube-Intro-Subscribe-CTA"
          component={YouTubeIntroCTA}
          durationInFrames={210}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="08-Kinetic-Typography"
          component={KineticTypography}
          durationInFrames={210}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
