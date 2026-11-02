import React from "react";
import { Audio, Sequence, staticFile } from "remotion";

export interface SfxCue {
  file: string;
  from: number;
  volume?: number;
}

interface SoundTrackProps {
  voiceoverFile: string;
  bgmFile: string;
  bgmVolume?: number;
  sfxCues?: SfxCue[];
}

export const SoundTrack: React.FC<SoundTrackProps> = ({
  voiceoverFile,
  bgmFile,
  bgmVolume = 0.35,
  sfxCues = [],
}) => {
  return (
    <>
      {/* Background Music Layer */}
      <Audio src={staticFile(`audio/${bgmFile}`)} volume={bgmVolume} />

      {/* AI Vietnamese Voiceover Layer */}
      <Sequence from={5}>
        <Audio src={staticFile(`audio/${voiceoverFile}`)} volume={1.0} />
      </Sequence>

      {/* Timed Sound Effects (SFX) Layer */}
      {sfxCues.map((cue, idx) => (
        <Sequence key={idx} from={cue.from}>
          <Audio
            src={staticFile(`audio/${cue.file}`)}
            volume={cue.volume ?? 0.65}
          />
        </Sequence>
      ))}
    </>
  );
};
