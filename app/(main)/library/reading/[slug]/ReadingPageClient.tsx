"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import AudioController from "@/components/features/reading/components/AudioController";
import FuriganaDisplay from "@/components/ui/FuriganaDisplay";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Languages } from "lucide-react";
import Link from "next/link";
import { ReadingProvider } from "@/components/features/reading/components/ReadingContext";
import { cn } from "@/lib/utils";
import { useReadingLogic } from "@/components/features/reading/hooks/useReadingLogic";
import { ReadingData } from "@/components/features/reading/types";

interface ReadingPageClientProps {
  data: ReadingData;
}

function ReadingPageContent({ data }: ReadingPageClientProps) {
  const {
    mode,
    showTranslation,
    paragraphs,
    hiraganaParagraphs,
    translationParagraphs,
    modes,
    toggleTranslation,
    setMode,
  } = useReadingLogic(data);

  return (
    <div className="min-h-screen bg-background relative pb-40">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[100px] rounded-full animate-pulse" />
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-12 relative z-10">
        {/* Navigation & Header */}
        <div className="flex flex-col gap-8 mb-12">
          <Link 
            href="/library" 
            className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit"
          >
            <div className="p-2 rounded-full bg-background/5 group-hover:bg-primary/10 border border-white/5 group-hover:border-primary/20 transition-all">
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
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  Interactive Reading
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight leading-tight">
                {data.title}
              </h1>
            </div>

            {/* Reading Mode Switcher - Desktop/Tablet */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex items-center gap-1 p-1 rounded-2xl bg-background/[0.03] border border-white/5 backdrop-blur-xl shadow-2xl">
                {modes.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                      mode === m.id 
                        ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,238,255,0.4)]" 
                        : "text-muted-foreground hover:text-foreground hover:bg-background/5"
                    )}
                  >
                    <m.icon size={14} />
                    <span className="hidden lg:inline">{m.label}</span>
                  </button>
                ))}
                <div className="w-px h-4 bg-background/10 mx-2" />
                <button
                  onClick={toggleTranslation}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    showTranslation 
                      ? "bg-success text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                      : "text-muted-foreground hover:text-foreground hover:bg-background/5"
                  )}
                >
                  <Languages size={14} />
                  ID
                </button>
              </div>

              {/* Audio Control in Header */}
              <div className="px-2 py-1 rounded-2xl bg-background/[0.03] border border-white/5 backdrop-blur-xl shadow-xl flex items-center gap-2">
                <AudioController 
                  audioUrl={data.audioUrl} 
                  textToSpeak={data.body} 
                  isTTSDisabled={data.isTTSDisabled}
                  compact={true}
                />
              </div>
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
            {/* Japanese Text Reading Container */}
            <div className="p-6 md:p-12 lg:p-16 rounded-[2.5rem] bg-card/20 backdrop-blur-3xl border border-white/5 shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-neural-pattern opacity-[0.005] pointer-events-none" />
              
              <div className="space-y-10 relative z-10">
                {paragraphs.map((para, idx) => (
                  <div key={idx} className="space-y-4">
                    <FuriganaDisplay 
                      text={para} 
                      furigana={hiraganaParagraphs[idx] || ""} 
                      mode={mode}
                      size="medium"
                      className="text-foreground/90"
                    />
                  </div>
                ))}
              </div>

              {/* Explicit Translation Toggle inside Card */}
              <div className="mt-16 pt-8 border-t border-white/5 flex justify-center">
                <button
                  onClick={toggleTranslation}
                  className={cn(
                    "group flex items-center gap-3 px-8 py-3 rounded-full text-sm font-semibold uppercase tracking-widest transition-all duration-300",
                    showTranslation
                      ? "bg-success text-white shadow-lg"
                      : "bg-background/5 text-muted-foreground hover:bg-background/10 hover:text-foreground border border-white/5"
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
                <div className="p-8 md:p-16 rounded-[3rem] bg-success/[0.03] backdrop-blur-[20px] border border-success/10 shadow-xl relative group">
                   <div className="flex items-center gap-3 mb-8 opacity-60">
                     <Languages size={18} className="text-success" />
                     <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-success">Terjemahan Lengkap Indonesia</span>
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

      {/* Bottom Padding for scroll space */}
      <div className="h-40" />
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
