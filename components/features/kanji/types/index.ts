/**
 * @file index.ts
 * @description Tipe data untuk fitur Kanji Stroke & Information.
 */

export interface StrokeData {
  path: string;
  index: number;
}

export interface KanjiSvgData {
  character: string;
  strokes: StrokeData[];
  numbers: { x: string; y: string; value: string }[];
  viewBox: string;
}

export type PlaybackStatus = "playing" | "paused" | "finished";

export interface KanjiPlaybackControl {
  status: PlaybackStatus;
  speed: number;
  currentStrokeIndex: number;
  showNumbers: boolean;
}
