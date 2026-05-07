"use client";

import { useUserStore } from "@/store/useUserStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";

interface ContinueLearningProps {
  courseMetadata: Array<{
    _id: string;
    title: string;
    slug: string;
    lessons: Array<{
      _id: string;
      title: string;
      slug: string;
    }>;
  }>;
}

export default function ContinueLearning({ courseMetadata }: ContinueLearningProps) {
  const completedLessons = useUserStore(s => s.completedLessons);

  // Logic to find active course and next lesson
  const activeData = useMemo(() => {
    if (!courseMetadata || courseMetadata.length === 0) return null;

    // 1. Calculate progress for each category
    const stats = courseMetadata.map(cat => {
      const completedInCat = cat.lessons.filter(lesson => {
          const record = completedLessons[lesson._id];
          return record && record.completedAt;
      });
      
      const totalLessons = cat.lessons.length;
      const progress = totalLessons > 0 
        ? (completedInCat.length / totalLessons) * 100 
        : 0;
      
      // Find last updated lesson in this category
      const lastUpdate = cat.lessons.reduce((max, lesson) => {
        const ts = completedLessons[lesson._id]?.updatedAt || 0;
        return ts > max ? ts : max;
      }, 0);

      return { ...cat, progress, lastUpdate, completedCount: completedInCat.length, totalLessons };
    });

    // 2. Find "Active" course (has progress but not 100%, and most recently updated)
    // If none has progress, pick the first category (usually N5)
    let active = stats
      .filter(s => s.progress > 0 && s.progress < 100)
      .sort((a, b) => b.lastUpdate - a.lastUpdate)[0] as typeof stats[number] | undefined;

    if (!active) {
       // If no partially completed course, check if any course is not 100%
       active = stats.find(s => s.progress < 100);
    }

    if (!active || !active.lessons || active.lessons.length === 0) return null;

    // 3. Find next lesson in active course
    const nextLessonIndex = active.lessons.findIndex(l => !completedLessons[l._id]?.completedAt);
    const nextLesson = active.lessons[nextLessonIndex] || active.lessons[0];

    if (!nextLesson) return null;

    return {
      courseTitle: active.title,
      courseSlug: active.slug,
      progress: active.progress,
      lessonTitle: nextLesson.title,
      lessonSlug: nextLesson.slug,
      completedCount: active.completedCount,
      totalLessons: active.totalLessons,
      isNew: active.progress === 0
    };
  }, [courseMetadata, completedLessons]);

  if (!activeData) return null;

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col">
        <h2 className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mb-2 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-cyber-neon" />
          Lanjutkan Belajar
        </h2>
        <div className="flex items-end justify-between mb-4">
           <h3 className="text-lg md:text-xl font-black text-foreground uppercase tracking-tight">
             {activeData.isNew ? "Mulai Petualangan" : "Kembali ke Jalur"}
           </h3>
           <Link href="/courses" className="text-[10px] font-bold text-primary hover:text-foreground transition-colors uppercase tracking-widest flex items-center gap-1 group">
             Lihat Semua <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>
      </div>

      <Card className="group relative overflow-hidden border-white/10 bg-white/[0.03] backdrop-blur-xl p-0 rounded-[2rem] transition-all duration-500 hover:border-primary/40">
        {/* Progress Background Glow */}
        <div 
          className="absolute left-0 top-0 bottom-0 bg-primary/5 transition-all duration-1000 ease-out" 
          style={{ width: `${activeData.progress}%` }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
          {/* Icon/Thumbnail Area */}
          <div className="shrink-0 relative">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-blue-500/20 border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden">
               {activeData.progress === 100 ? (
                 <CheckCircle2 size={40} className="text-emerald-400" />
               ) : (
                 <BookOpen size={40} className="text-primary group-hover:scale-110 transition-transform duration-500" />
               )}
               {/* Cyber Lines */}
               <div className="absolute inset-0 opacity-20 pointer-events-none">
                 <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent" />
                 <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent" />
               </div>
            </div>
            
            {/* Percentage Badge */}
            <div className="absolute -bottom-2 -right-2 bg-foreground text-background text-[10px] font-black px-3 py-1 rounded-full border border-white/10 shadow-xl">
              {Math.round(activeData.progress)}%
            </div>
          </div>

          {/* Info Area */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col gap-1 mb-3">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-80">
                {activeData.courseTitle}
              </span>
              <h4 className="text-xl md:text-2xl font-black text-foreground tracking-tight line-clamp-1">
                {activeData.lessonTitle}
              </h4>
            </div>
            
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={`w-1.5 h-3 rounded-full border border-background ${i < Math.floor(activeData.progress / 33) ? 'bg-primary shadow-[0_0_8px_rgba(0,238,255,0.6)]' : 'bg-white/10'}`} />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {activeData.completedCount} / {activeData.totalLessons} Selesai
                </span>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="w-full md:w-auto shrink-0">
            <Button asChild className="w-full md:w-auto h-16 md:h-20 px-10 rounded-[1.5rem] bg-foreground text-background hover:bg-primary hover:text-primary-foreground font-black uppercase tracking-widest transition-all duration-300 group shadow-2xl border-none">
              <Link href={`/courses/${activeData.courseSlug}/${activeData.lessonSlug}`}>
                {activeData.isNew ? "Mulai" : "Lanjutkan"}
                <div className="ml-3 w-8 h-8 rounded-full bg-background/20 flex items-center justify-center group-hover:bg-primary-foreground/20 transition-colors">
                  <Play size={16} fill="currentColor" />
                </div>
              </Link>
            </Button>
          </div>
        </div>

        {/* Bottom Progress Bar (Slim) */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${activeData.progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-primary to-blue-500 shadow-[0_0_10px_rgba(0,238,255,0.5)]"
          />
        </div>
      </Card>
    </div>
  );
}
