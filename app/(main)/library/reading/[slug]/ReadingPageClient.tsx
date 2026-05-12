"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AudioController from "@/components/features/reading/components/AudioController";
import FuriganaDisplay from "@/components/ui/FuriganaDisplay";
import { Card } from "@/components/ui/card";
import { 
  ChevronLeft, 
  Languages, 
  Maximize2, 
  Minimize2, 
  Type,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { ReadingProvider } from "@/components/features/reading/components/ReadingContext";
import { cn } from "@/lib/utils";
import { useReadingLogic } from "@/components/features/reading/hooks/useReadingLogic";
import { ReadingData } from "@/components/features/reading/types";
import { Button } from "@/components/ui/button";

interface ReadingPageClientProps {
  data: ReadingData;
}

function ReadingPageContent({ data }: ReadingPageClientProps) {
  const {
    mode,
    showTranslation,
    paragraphs,
    hiraganaParagraphs,
    romajiParagraphs,
    translationParagraphs,
    modes,
    toggleTranslation,
    setMode,
  } = useReadingLogic(data);

  const [isZenMode, setIsZenMode] = useState(false);
  const [fontSize, setFontSize] = useState<"standard" | "large" | "extra">("large");

  const fontSizeClasses = {
    standard: "text-xl md:text-2xl",
    large: "text-2xl md:text-4xl",
    extra: "text-4xl md:text-5xl",
  };

  return (
    <div className={cn(
      "min-h-screen transition-all duration-700 relative",
      isZenMode ? "bg-background pb-20" : "bg-background/95 pb-40"
    )}>
      {/* Immersive Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-success/5 blur-[150px] rounded-full animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--foreground-rgb),0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--foreground-rgb),0.01)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none opacity-20" />
      </div>

      {/* Top Navbar - Glassmorphic */}
      <AnimatePresence>
        {!isZenMode && (
          <motion.nav 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 inset-x-0 h-20 z-50 border-b border-border/40 glass flex items-center px-6 justify-between"
          >
            <div className="flex items-center gap-6">
              <Link 
                href="/library" 
                className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all"
              >
                <div className="p-2 rounded-xl bg-muted/30 group-hover:bg-primary/10 border border-border group-hover:border-primary/30 transition-all">
                  <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden md:block">Pustaka</span>
              </Link>
              <div className="h-6 w-px bg-border mx-2 hidden md:block" />
              <div className="flex flex-col">
                 <h2 className="text-sm font-black text-foreground truncate max-w-[200px] md:max-w-[400px]">
                   {data.title}
                 </h2>
                 <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Level {data.difficulty}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                onClick={() => setIsZenMode(true)}
                aria-label="Mode Zen"
              >
                <Maximize2 size={20} />
              </Button>
              <div className="h-6 w-px bg-border mx-1" />
              <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-muted/30 border border-border">
                {modes.map((m) => (
                  <Button
                    key={m.id}
                    variant={mode === m.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setMode(m.id)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 h-auto text-[10px] font-black uppercase tracking-wider",
                      mode === m.id && "shadow-lg shadow-primary/20"
                    )}
                  >
                    <m.icon size={14} className="mr-2" />
                    {m.label}
                  </Button>
                ))}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Floating Mode Exit for Zen Mode */}
      <AnimatePresence>
        {isZenMode && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed top-8 right-8 z-[100]"
          >
            <Button 
              size="lg" 
              className="rounded-full w-14 h-14 bg-background/80 backdrop-blur-xl border border-border shadow-2xl group hover:border-primary/40 transition-all"
              onClick={() => setIsZenMode(false)}
              aria-label="Keluar Mode Zen"
            >
              <Minimize2 size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Reading Container */}
      <div className={cn(
        "max-w-4xl mx-auto px-6 relative z-10 transition-all duration-1000",
        isZenMode ? "pt-24 md:pt-40" : "pt-32 md:pt-48"
      )}>
        {/* Immersive Header Decoration */}
        {!isZenMode && (
          <div className="flex flex-col items-center mb-24 md:mb-32 text-center">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
               <span className="text-primary font-black text-[10px] md:text-xs uppercase tracking-[0.4em]">Graded Reading Experience</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-[0.9] mb-12 max-w-3xl drop-shadow-2xl">
              {data.title}
            </h1>
            <div className="h-1.5 w-32 bg-gradient-to-r from-primary/0 via-primary to-primary/0 rounded-full" />
          </div>
        )}

        <div className="relative">
          {/* Audio & Settings Floating Sidebar (Desktop) */}
          <div className="hidden xl:block absolute -left-32 top-0 h-full">
            <div className="sticky top-40 flex flex-col items-center gap-6">
               <Card className="p-3 bg-card/30 border-border rounded-2xl glass flex flex-col gap-4 shadow-2xl">
                  <AudioController 
                    audioUrl={data.audioUrl} 
                    textToSpeak={data.body} 
                    isTTSDisabled={data.isTTSDisabled}
                    compact={true}
                  />
                  <div className="h-px w-8 bg-border mx-auto" />
                  <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setFontSize(fontSize === "standard" ? "large" : fontSize === "large" ? "extra" : "standard")} aria-label="Ubah Ukuran Font">
                    <Type size={20} />
                  </Button>
                  <Button 
                    variant={showTranslation ? "default" : "ghost"} 
                    size="icon" 
                    className={cn("rounded-xl transition-all", showTranslation && "text-primary-foreground shadow-lg")}
                    onClick={toggleTranslation}
                    aria-label="Toggle Terjemahan"
                  >
                    <Languages size={20} />
                  </Button>
               </Card>
            </div>
          </div>

          {/* Body Content */}
          <motion.article
            layout
            className={cn(
              "p-8 md:p-16 lg:p-24 rounded-[3rem] transition-all duration-700 relative",
              isZenMode 
                ? "bg-transparent shadow-none border-none" 
                : "bg-card/10 backdrop-blur-3xl border border-border/40 shadow-[0_40px_100px_-20px_rgba(var(--background-rgb),0.2)]"
            )}
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-50" />
            
            <div className="space-y-16 relative z-10">
              {paragraphs.map((para, idx) => (
                <div key={idx} className="group/para relative">
                  <FuriganaDisplay 
                    text={para} 
                    furigana={hiraganaParagraphs[idx] || ""} 
                    romaji={romajiParagraphs[idx]}
                    mode={mode}
                    size="medium"
                    interactive={true}
                    className={cn(
                      "transition-all duration-500",
                      fontSizeClasses[fontSize]
                    )}
                  />
                  
                  {/* Inline Translation on Hover/Click */}
                  <AnimatePresence>
                    {showTranslation && (
                      <motion.p 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="mt-6 text-base md:text-lg text-muted-foreground/80 italic font-medium leading-relaxed border-l-2 border-primary/20 pl-6"
                      >
                        {translationParagraphs[idx]}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Bottom Interaction */}
            {!isZenMode && (
              <div className="mt-24 pt-12 border-t border-border/40 flex flex-col items-center gap-8">
                 <div className="flex items-center gap-4">
                    <Sparkles size={20} className="text-warning animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Selesaikan Bacaan Untuk XP</span>
                 </div>
                 <Button className="px-16 py-8 h-auto rounded-2xl text-xs font-black uppercase tracking-[0.3em] bg-primary text-primary-foreground shadow-[0_20px_50px_-10px_rgba(var(--primary-rgb),0.4)] hover:shadow-[0_20px_70px_-10px_rgba(var(--primary-rgb),0.6)] hover:scale-105 active:scale-95 transition-all">
                   Tandai Selesai
                 </Button>
              </div>
            )}
          </motion.article>
        </div>
      </div>

      {/* Mobile Toolbar */}
      <AnimatePresence>
        {!isZenMode && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-8 inset-x-6 z-50 xl:hidden"
          >
            <Card className="p-3 bg-card/60 backdrop-blur-2xl border-border/60 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(var(--background-rgb),0.3)] flex items-center justify-between gap-2 max-w-md mx-auto">
              <AudioController 
                audioUrl={data.audioUrl} 
                textToSpeak={data.body} 
                isTTSDisabled={data.isTTSDisabled}
                compact={true}
              />
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="rounded-2xl" onClick={toggleTranslation} aria-label="Toggle Terjemahan">
                  <Languages size={18} className={cn(showTranslation && "text-primary")} />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-2xl" onClick={() => setIsZenMode(true)} aria-label="Masuk Mode Zen">
                  <Maximize2 size={18} />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
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
