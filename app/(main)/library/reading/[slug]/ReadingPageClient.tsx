"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import AudioController from "@/components/features/library/reading/AudioController";
import FuriganaDisplay from "@/components/ui/FuriganaDisplay";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Languages, BookOpen, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { ReadingProvider, useReading, ReadingMode } from "@/components/features/library/reading/ReadingContext";
import { cn } from "@/lib/utils";

interface ReadingPageClientProps {
  data: {
    title: string;
    difficulty: string;
    audioUrl?: string;
    isTTSDisabled?: boolean;
    body: string;
    hiragana: string;
    translation: string;
  };
}

function ReadingPageContent({ data }: ReadingPageClientProps) {
  const { mode, setMode, showTranslation, setShowTranslation } = useReading();
  
  // Split content into paragraphs
  const paragraphs = data.body.split(/\n+/).filter(p => p.trim());
  const hiraganaParagraphs = data.hiragana.split(/\n+/).filter(p => p.trim());
  const translationParagraphs = data.translation.split(/\n+/).filter(p => p.trim());

  const modes: { id: ReadingMode; label: string; icon: typeof Eye }[] = [
    { id: "kanji", label: "Kanji", icon: BookOpen },
    { id: "furigana", label: "Furigana", icon: Eye },
    { id: "hiragana", label: "Hiragana", icon: EyeOff },
  ];

  return (
    <div className="min-h-screen bg-background relative pb-40">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[100px] rounded-full animate-pulse" />
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-12 relative z-10">
        {/* Navigation & Header */}
        <div className="flex flex-col gap-8 mb-12">
          <Link 
            href="/library" 
            className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit"
          >
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-primary/10 border border-white/5 group-hover:border-primary/20 transition-all">
              <ChevronLeft size={18} />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">Back to Library</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-primary/40 text-primary bg-primary/5 px-4 py-1">
                  Level {data.difficulty}
                </Badge>
                <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                  Cyber-Glass Interactive Reader
                </span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-foreground tracking-tighter leading-none">
                {data.title}
              </h1>
            </div>

            {/* Reading Mode Switcher - Desktop/Tablet */}
            <div className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-xl shadow-2xl">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                    mode === m.id 
                      ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,238,255,0.4)]" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <m.icon size={14} />
                  {m.label}
                </button>
              ))}
              <div className="w-px h-4 bg-white/10 mx-2" />
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  showTranslation 
                    ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <Languages size={14} />
                ID
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 gap-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full"
          >
            {/* Japanese Text Glass Container */}
            <div className="p-8 md:p-20 rounded-[3rem] bg-card/30 backdrop-blur-[40px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-neural-pattern opacity-[0.03] pointer-events-none" />
              
              <div className="space-y-12 relative z-10">
                {paragraphs.map((para, idx) => (
                  <div key={idx} className="space-y-6">
                    <FuriganaDisplay 
                      text={para} 
                      furigana={hiraganaParagraphs[idx] || ""} 
                      mode={mode}
                      size="medium"
                      className="!leading-[2.4] text-xl md:text-2xl"
                    />
                    
                    {/* Inline translation if enabled - Optional, but keeping separate block as default */}
                    {showTranslation && translationParagraphs[idx] && (
                       <motion.p 
                         initial={{ opacity: 0, x: -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         className="text-emerald-500/60 italic text-sm md:text-lg font-medium border-l-2 border-emerald-500/20 pl-4"
                       >
                         {translationParagraphs[idx]}
                       </motion.p>
                    )}
                  </div>
                ))}
              </div>

              {/* Explicit Translation Toggle inside Card */}
              <div className="mt-16 pt-8 border-t border-white/5 flex justify-center">
                <button
                  onClick={() => setShowTranslation(!showTranslation)}
                  className={cn(
                    "group flex items-center gap-3 px-8 py-3 rounded-full text-sm font-black uppercase tracking-[0.2em] transition-all duration-500",
                    showTranslation
                      ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                      : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground border border-white/5"
                  )}
                >
                  <Languages size={18} className={cn("transition-transform duration-500", showTranslation && "rotate-180")} />
                  {showTranslation ? "Sembunyikan Terjemahan" : "Lihat Terjemahan"}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Full Translation Container (Optional secondary view) */}
          <AnimatePresence>
            {showTranslation && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: 20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: 20 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="w-full overflow-hidden"
              >
                <div className="p-8 md:p-16 rounded-[3rem] bg-emerald-500/[0.03] backdrop-blur-[20px] border border-emerald-500/10 shadow-xl relative group">
                   <div className="flex items-center gap-3 mb-8 opacity-60">
                     <Languages size={18} className="text-emerald-500" />
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Terjemahan Lengkap Indonesia</span>
                   </div>
                   <div className="space-y-8">
                      {translationParagraphs.map((t, i) => (
                        <p key={i} className="text-lg md:text-xl text-muted-foreground/90 italic leading-relaxed">
                          {t}
                        </p>
                      ))}
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Floating Controls */}
      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 md:hidden w-[92%] max-w-sm">
        <div className="p-1.5 rounded-full bg-background/40 backdrop-blur-[50px] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center justify-between gap-1 overflow-hidden">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-full transition-all duration-300",
                mode === m.id 
                  ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(0,238,255,0.3)] scale-[1.02]" 
                  : "text-muted-foreground hover:bg-white/5"
              )}
            >
              <m.icon size={16} />
              <span className="text-[7px] font-black uppercase tracking-widest">{m.label}</span>
            </button>
          ))}
          <div className="w-px h-6 bg-white/10" />
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-full transition-all duration-300",
              showTranslation 
                ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-[1.02]" 
                : "text-muted-foreground hover:bg-white/5"
            )}
          >
            <Languages size={16} />
            <span className="text-[7px] font-black uppercase tracking-widest">Trans</span>
          </button>
        </div>
      </div>

      {/* Persistent Audio Bar */}
      <AudioController 
        audioUrl={data.audioUrl} 
        textToSpeak={data.body}
        isTTSDisabled={data.isTTSDisabled}
      />
    </div>
  );
}

export default function ReadingPageClient({ data }: ReadingPageClientProps) {
  return (
    <ReadingProvider>
      <ReadingPageContent data={data} />
    </ReadingProvider>
  );
}
