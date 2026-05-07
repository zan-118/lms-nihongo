"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DailyMission } from "@/lib/daily";

interface DailyMissionCardProps {
  hasMounted: boolean;
  mission: DailyMission | null;
}

/**
 * Komponen kartu misi harian di sidebar.
 */
export function DailyMissionCard({ hasMounted, mission }: DailyMissionCardProps) {
  if (!hasMounted || !mission) {
    return <Skeleton className="h-32 w-full rounded-2xl" />;
  }

  return (
    <div className="bg-muted/30 border border-border/50 rounded-2xl p-4 relative overflow-hidden group/target">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      <div className="flex justify-between items-start mb-3 relative z-10">
        <span className="text-xs font-black text-foreground uppercase tracking-wider">Target Hari Ini</span>
        <Trophy size={14} className="text-amber-500 group-hover/target:rotate-12 transition-transform" />
      </div>
      <div className="space-y-3 relative z-10">
         <div>
            <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase mb-1.5">
              <span>Materi Selesai</span>
              <span className="text-foreground">{mission.lessonProgress}/{mission.lessonGoal}</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (mission.lessonProgress / mission.lessonGoal) * 100)}%` }}
                className="h-full bg-primary shadow-[0_0_10px_rgba(0,238,255,0.5)]" 
              />
            </div>
         </div>
         <Link href="/courses">
           <Button variant="ghost" className="w-full h-8 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary text-xs font-black uppercase tracking-widest border border-primary/10">
             Lanjutkan Belajar
           </Button>
         </Link>
      </div>
    </div>
  );
}
