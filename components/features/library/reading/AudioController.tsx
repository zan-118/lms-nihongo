"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Square, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioControllerProps {
  audioUrl?: string;
  textToSpeak?: string;
  isTTSDisabled?: boolean;
}

export default function AudioController({ audioUrl, textToSpeak, isTTSDisabled }: AudioControllerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTTS, setIsTTS] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ttsRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Stop everything on unmount
  useEffect(() => {
    return () => {
      stopAll();
    };
  }, []);

  const stopAll = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsTTS(false);
  };

  const toggleNativeAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => {
        console.error("Audio playback error:", err);
        setError("Gagal memutar audio native.");
      });
      setIsPlaying(true);
    }
  };

  const toggleTTS = () => {
    if (!textToSpeak) return;

    if (isPlaying && isTTS) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else if (!isPlaying && isTTS) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
    } else {
      stopAll();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "ja-JP";
      utterance.rate = 0.9; // Slightly slower for learning
      
      utterance.onend = () => {
        setIsPlaying(false);
        setIsTTS(false);
      };

      utterance.onerror = (e) => {
        console.error("TTS Error:", e);
        setError("Gagal menjalankan AI Voice.");
        setIsPlaying(false);
        setIsTTS(false);
      };

      ttsRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      setIsTTS(true);
    }
  };

  const handlePlayPause = () => {
    if (audioUrl) {
      toggleNativeAudio();
    } else if (!isTTSDisabled) {
      toggleTTS();
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4">
      {error && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 text-destructive text-xs animate-in fade-in slide-in-from-bottom-2">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 p-2 rounded-full bg-card/40 backdrop-blur-3xl border border-white/5 shadow-2xl ring-1 ring-white/10">
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-300 active:scale-95"
          onClick={handlePlayPause}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </Button>

        <div className="flex flex-col pr-6 pl-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/70 mb-0.5">
            {audioUrl ? "Native Voice" : "AI Smart Voice"}
          </span>
          <span className="text-xs font-bold text-foreground">
            {isPlaying ? (isTTS ? "Membaca teks..." : "Memutar audio...") : "Siap mendengarkan?"}
          </span>
        </div>

        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
          />
        )}

        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 rounded-full hover:bg-white/5 text-muted-foreground transition-all"
          onClick={stopAll}
          disabled={!isPlaying}
        >
          <Square size={16} />
        </Button>
      </div>
    </div>
  );
}
