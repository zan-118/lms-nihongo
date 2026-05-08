/**
 * @file index.ts
 * @description Tipe data untuk fitur Listening Comprehension (Karaoke-Style).
 */

import { TypedObject } from "@/components/ui/portable-text/SharedPortableText";

export interface TranscriptLine {
  _key: string;
  text: string | TypedObject[]; // Bisa text biasa atau Portable Text (VocabTrigger)
  startTime: number; // Dalam detik
  endTime: number; // Dalam detik
  speaker?: string;
  translation?: string;
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizItem {
  _id: string;
  question: string;
  options: QuizOption[];
  explanation?: string;
}

export interface ListeningTaskData {
  _id: string;
  title: string;
  audioUrl: string;
  transcript: TranscriptLine[];
  description?: string;
  quiz?: QuizItem[];
}

export interface ListeningState {
  currentTime: number;
  activeIndex: number;
  isScrolling: boolean;
  activeTab: "transcript" | "quiz";
}

