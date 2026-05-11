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
  const progressGradient = isSideQuest ? "from-warning to-warning/60" : "from-primary to-primary/60";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{ 
        contentVisibility: 'auto', 
        containIntrinsicSize: '0 300px',
        willChange: 'transform'
      }}
    >
      <Link href={`/courses/${categoryId}/${lesson.slug}`} className="group flex flex-col h-full">
        <Card className="p-8 bg-card/40 backdrop-blur-md border border-border/60 rounded-[2rem] group transition-all duration-500 flex flex-col items-start gap-8 cursor-pointer hover:border-foreground/10 hover:bg-card/60 h-full shadow-lg hover:shadow-2xl relative overflow-hidden">
          {/* Hover Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="flex justify-between items-start w-full relative z-10">
            <div
              className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center font-bold text-sm font-mono bg-background border border-border/50 transition-all duration-500 shadow-sm ${
                isSideQuest 
                  ? "text-warning/60 group-hover:bg-warning group-hover:text-warning-foreground group-hover:border-warning group-hover:opacity-100" 
                  : "text-primary/60 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary group-hover:opacity-100"
              }`}
            >
              {(index + 1).toString().padStart(2, "0")}
            </div>
            
            {progress > 0 && (
              <div className="px-3 py-1.5 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors shadow-sm">
                {progress}% Complete
              </div>
            )}
          </div>

          <div className="flex-1 relative z-10 w-full">
            <h4 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight mb-3 leading-[1.2] text-balance">
              {lesson.title}
            </h4>
            {lesson.summary && (
              <p className="text-muted-foreground text-[13px] font-medium line-clamp-3 opacity-60 group-hover:opacity-100 transition-opacity leading-relaxed">
                {lesson.summary}
              </p>
            )}
          </div>

          <div className="mt-auto pt-8 w-full flex items-center justify-between border-t border-border/40 relative z-10">
            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
              isSideQuest ? "text-warning/40 group-hover:text-warning" : "text-primary/40 group-hover:text-primary"
            }`}>
              View Lesson
            </span>
            <div
              className={`w-10 h-10 rounded-xl border border-border/50 flex items-center justify-center transition-all duration-500 bg-background shadow-sm ${
                isSideQuest ? "group-hover:bg-warning group-hover:text-warning-foreground" : "group-hover:bg-primary group-hover:text-primary-foreground"
              }`}
            >
              <ChevronRight size={16} aria-hidden="true" />
            </div>
          </div>

          {/* Bottom Progress Bar - Ultra Thin & Subtle */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={`h-full bg-gradient-to-r ${progressGradient} transition-all duration-1000`}
            />
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
