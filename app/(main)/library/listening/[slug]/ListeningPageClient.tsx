"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Headphones, Info, Trophy, CheckCircle2 } from "lucide-react";
import { ListeningTaskData } from "@/components/features/listening/types";
import ListeningKaraoke from "@/components/features/listening/components/ListeningKaraoke";
import ListeningQuiz from "@/components/features/listening/components/ListeningQuiz";
import { useListeningSync } from "@/components/features/listening/hooks/useListeningSync";
import AudioController from "@/components/features/reading/components/AudioController";
import { useUserStore } from "@/store/useUserStore";
import { useUIStore } from "@/store/useUIStore";
import { cn } from "@/lib/utils";
import { useEffect } from "react";


interface ListeningPageClientProps {
  data: ListeningTaskData;
}

export default function ListeningPageClient({ data }: ListeningPageClientProps) {
  const listeningState = useUIStore(state => state.listeningState);
  const setListeningState = useUIStore(state => state.setListeningState);
  const { activeTab } = listeningState;
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Sync data to global store on mount for FAB access
  useEffect(() => {
    const textToSpeak = data.transcript.map(t => {
      if (typeof t.text === "string") return t.text;
      if (Array.isArray(t.text)) {
        return (t.text as { children?: { text?: string }[] }[])
          .map(block => block.children?.map(child => child.text).join("") || "")
          .join(" ");
      }
      return "";
    }).join(" ");

    setListeningState({
      audioUrl: data.audioUrl,
      textToSpeak: textToSpeak,
    });
  }, [data, setListeningState]);

  
  const { 
    activeIndex, 
    handleTimeUpdate, 
    seekToLine, 
    externalSeek 
  } = useListeningSync(data.transcript);

  const completeLesson = useUserStore(state => state.completeLesson);
  const addXP = useUserStore(state => state.addXP);

  const handleQuizComplete = (score: number) => {
    setIsCompleted(true);
    // Reward XP based on score
    const reward = score * 50;
    addXP(reward);
    completeLesson(data._id);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-32 relative overflow-hidden">

      {/* Premium Ambient Background */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 -right-48 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Hero Section / Header */}
      <div className="relative w-full border-b border-border bg-card overflow-hidden">


        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] rounded-full -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                  <Headphones size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">
                  Listening Comprehension
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-foreground tracking-tighter leading-tight uppercase drop-shadow-sm">


                {data.title}
              </h1>
              {data.description && (
                <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed font-medium">


                  {data.description}
                </p>
              )}
            </div>

            {/* Tab Switcher & Audio Header */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <AudioController 
                audioUrl={data.audioUrl}
                textToSpeak={listeningState.textToSpeak}
                onTimeUpdate={handleTimeUpdate}
                externalSeek={externalSeek}
                compact={true}
              />

              <div className="flex p-1 bg-background/[0.03] dark:bg-background/[0.03] bg-black/[0.03] border border-border rounded-2xl backdrop-blur-md">
                <button
                  onClick={() => setListeningState({ activeTab: "transcript" })}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                    activeTab === "transcript" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Transcript
                </button>
                <button
                  onClick={() => setListeningState({ activeTab: "quiz" })}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                    activeTab === "quiz" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Take Quiz
                  {isCompleted && <CheckCircle2 size={12} />}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 lg:px-6 mt-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Interactive Area */}
          <div className="lg:col-span-8 relative min-h-[600px]">
            {/* BACKGROUND TRANSCRIPT (Always Rendered for Overlay Effect) */}
            <div className={cn(
              "transition-all duration-700",
              activeTab === "quiz" ? "blur-md scale-[0.98] opacity-30 pointer-events-none" : "blur-0 scale-100 opacity-100"
            )}>
              <ListeningKaraoke 
                transcript={data.transcript} 
                activeIndex={activeIndex}
                seekToLine={seekToLine}
              />
            </div>

            {/* QUIZ OVERLAY */}
            <AnimatePresence>
              {activeTab === "quiz" && (
                <motion.div
                  initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                  animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
                  exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                  className="absolute inset-0 z-50 flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 20, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="w-full max-w-2xl"
                  >
                    {data.quiz && data.quiz.length > 0 ? (
                      <ListeningQuiz 
                        questions={data.quiz} 
                        onComplete={handleQuizComplete} 
                      />
                    ) : (
                      <div className="p-12 text-center bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl">
                        <p className="text-muted-foreground">No quiz available for this task.</p>
                        <button 
                          onClick={() => setListeningState({ activeTab: "transcript" })}
                          className="mt-4 text-xs font-black uppercase text-primary tracking-widest hover:underline"
                        >
                          Back to Transcript
                        </button>

                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            {/* Mission Info */}
            <div className="p-6 rounded-3xl bg-background/[0.02] border border-white/5 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <Info size={18} className="text-primary/50" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Study Notes</h4>
              </div>
              <ul className="flex flex-col gap-4">
                <li className="flex gap-4 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Dengarkan audio secara menyeluruh sebelum mencoba menjawab kuis.
                  </p>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Klik pada baris transkrip untuk mengulangi bagian tertentu (Shadowing).
                  </p>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Gunakan tombol &quot;Translate&quot; jika kamu kesulitan memahami konteks kalimat.
                  </p>
                </li>
              </ul>
            </div>

            {/* Achievement Preview */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 flex flex-col gap-4 relative overflow-hidden group">
              <Trophy size={40} className="absolute -bottom-2 -right-2 text-primary/10 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Reward</span>
                <span className="text-xl font-black text-white">+{data.quiz ? data.quiz.length * 50 : 0} XP</span>
              </div>
              <p className="text-[10px] text-primary/60 font-medium leading-relaxed">
                Complete the quiz with 100% accuracy to earn maximum XP bonus.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Floating Audio Controller is now handled by FAB and Header */}
    </div>

  );
}
