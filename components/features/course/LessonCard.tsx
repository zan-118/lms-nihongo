"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface LessonCardProps {
  lesson: {
    _id: string;
    title: string;
    slug: string;
    summary?: string;
  };
  index: number;
  categoryId: string;
  isSideQuest?: boolean;
  progress?: number; // 0 to 100
}

export function LessonCard({ lesson, index, categoryId, isSideQuest, progress = 0 }: LessonCardProps) {
  const progressGradient = isSideQuest ? "from-amber-500 to-orange-500" : "from-cyan-500 to-emerald-500";

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ 
        contentVisibility: 'auto', 
        containIntrinsicSize: '0 300px',
        willChange: 'transform'
      }}
    >
      <Link href={`/courses/${categoryId}/${lesson.slug}`} className="group flex flex-col h-full">
        <Card className="p-6 md:p-8 bg-card/40 backdrop-blur-xl border border-white/5 rounded-[2rem] group transition-all duration-500 flex flex-col items-start gap-6 cursor-pointer hover:border-primary/50 hover:bg-card/60 h-full shadow-2xl relative overflow-hidden">
          {/* Hover Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="flex justify-between items-start w-full relative z-10">
            <div
              className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center font-black text-lg font-mono bg-background/[0.03] border border-white/5 transition-all duration-500 ${
                isSideQuest 
                  ? "text-warning group-hover:bg-warning group-hover:text-white" 
                  : "text-primary text-primary group-hover:bg-primary dark:group-hover:bg-primary group-hover:text-white dark:group-hover:text-foreground"
              }`}
            >
              {(index + 1).toString().padStart(2, "0")}
            </div>
            
            {progress > 0 && (
              <div className="px-3 py-1 rounded-full bg-background/[0.05] border border-white/5 text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                {progress}% Selesai
              </div>
            )}
          </div>

          <div className="flex-1 relative z-10">
            <h4 className="text-xl md:text-2xl font-black text-foreground group-hover:text-primary transition-all uppercase tracking-tight mb-3 leading-tight">
              {lesson.title}
            </h4>
            {lesson.summary && (
              <p className="text-muted-foreground text-xs font-medium line-clamp-3 opacity-70 group-hover:opacity-100 transition-opacity leading-relaxed">
                {lesson.summary}
              </p>
            )}
          </div>

          <div className="mt-auto pt-6 w-full flex items-center justify-between border-t border-white/5 relative z-10">
            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
              isSideQuest ? "text-warning/50 group-hover:text-warning" : "text-primary/50 group-hover:text-primary"
            }`}>
              Baca Materi
            </span>
            <div
              className={`w-10 h-10 rounded-xl border border-white/5 flex items-center justify-center transition-all duration-500 bg-background/[0.03] ${
                isSideQuest ? "group-hover:bg-warning group-hover:text-white" : "group-hover:bg-primary group-hover:text-white dark:group-hover:text-foreground"
              } group-hover:shadow-[0_0_15px_rgba(0,238,255,0.3)]`}
            >
              <ChevronRight size={18} />
            </div>
          </div>

          {/* Bottom Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-background/[0.02]">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={`h-full bg-gradient-to-r ${progressGradient} shadow-[0_0_10px_rgba(0,238,255,0.5)]`}
            />
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
