import { useEffect, useMemo, type ElementType } from "react";
import { useUIStore } from "@/store/useUIStore";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import { ReadingData, ReadingMode } from "../types";

export function useReadingLogic(data: ReadingData) {
  const readingState = useUIStore((state) => state.readingState);
  const setReadingState = useUIStore((state) => state.setReadingState);
  const { mode, showTranslation } = readingState;

  // Sync data to global store on mount for FAB access
  useEffect(() => {
    setReadingState({
      audioUrl: data.audioUrl,
      textToSpeak: data.body,
      isTTSDisabled: data.isTTSDisabled,
    });
  }, [data, setReadingState]);

  // Split content into paragraphs
  const content = useMemo(() => {
    const paragraphs = data.body.split(/\n+/).filter(p => p.trim());
    const hiraganaParagraphs = data.hiragana.split(/\n+/).filter(p => p.trim());
    const translationParagraphs = data.translation.split(/\n+/).filter(p => p.trim());
    
    return {
      paragraphs,
      hiraganaParagraphs,
      translationParagraphs
    };
  }, [data.body, data.hiragana, data.translation]);

  const modes: { id: ReadingMode; label: string; icon: ElementType }[] = [
    { id: "kanji", label: "Kanji", icon: BookOpen },
    { id: "furigana", label: "Furigana", icon: Eye },
    { id: "hiragana", label: "Hiragana", icon: EyeOff },
  ];

  const toggleTranslation = () => {
    setReadingState({ showTranslation: !showTranslation });
  };

  const setMode = (newMode: ReadingMode) => {
    setReadingState({ mode: newMode });
  };

  return {
    mode,
    showTranslation,
    paragraphs: content.paragraphs,
    hiraganaParagraphs: content.hiraganaParagraphs,
    translationParagraphs: content.translationParagraphs,
    modes,
    toggleTranslation,
    setMode,
    readingState
  };
}
