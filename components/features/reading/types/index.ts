/**
 * @file types/index.ts
 * @description Definisi tipe data untuk fitur Reading.
 */

export type ReadingMode = "kanji" | "furigana" | "hiragana";

export interface ReadingState {
  mode: ReadingMode;
  showTranslation: boolean;
  audioUrl?: string;
  textToSpeak?: string;
  isTTSDisabled?: boolean;
}

export interface ReadingData {
  title: string;
  difficulty: string;
  audioUrl?: string;
  isTTSDisabled?: boolean;
  body: any; // Can be string or PortableText array
  hiragana: any;
  translation: any; // Can be string or PortableText array
}
