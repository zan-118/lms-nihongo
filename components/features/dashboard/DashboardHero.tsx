"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Sparkles, BrainCircuit, Target, BookMarked, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { useSRSStore } from "@/store/useSRSStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import ProfileEditor from "../user/ProfileEditor";
import { Trophy, Flame, Star, ArrowRight } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

interface DashboardHeroProps {
  guestId: string;
  itemVariants: Variants;
}

export default function DashboardHero({ guestId, itemVariants }: DashboardHeroProps) {
  // ATOMIC SELECTORS (Strictly no destructuring)
  const name = useUserStore(s => s.name);
  const xp = useUserStore(s => s.xp);
  const level = useUserStore(s => s.level);
  const streak = useUserStore(s => s.streak);
  const srs = useSRSStore(s => s.srs);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const loading = useUIStore(s => s.loading);

  // Calculated values
  const [dueCount, setDueCount] = useState(0);
  const xpProgress = (xp % 1000) / 10;

  useEffect(() => {
    const now = Date.now();
    const count = Object.values(srs).filter(card => card.nextReview <= now).length;
    setDueCount(count);
  }, [srs]);

  return (
    <motion.div variants={itemVariants} className="flex flex-col gap-10 items-start w-full">
      <div className="flex-1 w-full flex flex-col items-center lg:items-start text-center lg:text-left">
        {loading ? (
          <Skeleton className="h-6 w-32 rounded-full mb-6" />
        ) : (
          <div className="flex flex-col items-center lg:items-start gap-3 mb-10">
            <Badge 
              variant="outline" 
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 w-fit border-white/10 backdrop-blur-md shadow-xl transition-all ${
                isAuthenticated 
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30' 
                  : 'bg-gradient-to-r from-primary/20 to-blue-500/20 text-primary border-primary/30'
              }`}
            >
              <Sparkles size={14} className="animate-pulse" /> 
              {isAuthenticated ? 'Student ID:' : 'Guest ID:'} {guestId}
            </Badge>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-40 ml-1">
              {isAuthenticated ? 'Cloud Sync Active' : 'Local Storage Mode'}
            </span>
          </div>
        )}
        
        {loading ? (
          <div className="space-y-4 mb-4">
            <Skeleton className="h-16 w-64 md:w-96" />
            <Skeleton className="h-4 w-48 md:w-64" />
          </div>
        ) : (
          <ProfileEditor />
        )}
      </div>

      {/* MAIN CALL TO ACTION - GLASSMORPHISM CARD */}
      <div className="w-full relative">
        {/* Background Decorative Glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
        
        {loading ? (
          <Skeleton className="h-[320px] w-full rounded-[2.5rem]" />
        ) : (
        <Card className="p-6 md:p-12 rounded-[2.5rem] bg-card/40 backdrop-blur-3xl border border-white/10 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:border-primary/40 hover:shadow-primary/10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Pulsing Icon */}
            <motion.div 
              animate={dueCount > 0 ? {
                scale: [1, 1.05, 1],
                boxShadow: ["0 0 0px rgba(0,238,255,0)", "0 0 20px rgba(0,238,255,0.3)", "0 0 0px rgba(0,238,255,0)"]
              } : {}}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 shadow-2xl border transition-all duration-500 ${
                dueCount > 0 
                  ? 'bg-primary/20 border-primary/40 text-primary' 
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
              }`}
            >
              {dueCount > 0 ? (
                <BrainCircuit size={48} className="drop-shadow-[0_0_10px_rgba(0,238,255,0.5)]" />
              ) : (
                <Trophy size={48} className="drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
              )}
            </motion.div>
            
            <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-tight mb-3 ${dueCount > 0 ? 'text-foreground' : 'text-emerald-400'}`}>
              {dueCount > 0 ? `Waktunya Sapa Ingatan, ${name}!` : `Ingatanmu Tajam, ${name}!`}
            </h3>
            <p className="text-muted-foreground text-sm md:text-base mb-10 font-medium max-w-md leading-relaxed">
              {dueCount > 0 
                ? `Ada ${dueCount} kosakata yang mulai memudar. Yuk, segarkan kembali ingatanmu!` 
                : "Luar biasa! Semua hafalanmu sudah aman. Siap untuk tantangan baru hari ini?"}
            </p>

            {/* QUICK STATS INSIDE HERO */}
            <div className="grid grid-cols-3 gap-4 mb-10 w-full max-w-sm">
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5 text-amber-500">
                  <Flame size={14} className="fill-current" />
                  <span className="text-sm font-black">
                    <AnimatedCounter value={streak} />
                  </span>
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Streak</span>
              </div>
              <div className="flex flex-col items-center gap-1 border-x border-white/5">
                <div className="flex items-center gap-1.5 text-primary">
                  <Star size={14} className="fill-current" />
                  <span className="text-sm font-black">Lvl {level}</span>
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Level</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5 text-blue-400">
                  <Target size={14} />
                  <span className="text-sm font-black">{Math.floor(xpProgress)}%</span>
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Progress</span>
              </div>
            </div>

            {dueCount > 0 ? (
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button asChild className="w-full h-16 bg-primary hover:bg-foreground text-primary-foreground font-black uppercase tracking-widest rounded-2xl text-xs transition-all shadow-[0_0_20px_rgba(0,238,255,0.3)] hover:shadow-[0_0_40px_rgba(0,238,255,0.5)] border-none">
                    <Link href="/review">
                      Mulai Review Sekarang <ArrowRight size={18} className="ml-2" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button asChild variant="outline" className="w-full h-16 bg-background/50 backdrop-blur-md border-white/10 hover:border-primary/50 hover:bg-primary/5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                    <Link href="/review?mode=quick">
                      <Zap size={18} className="mr-2 text-primary" /> Kuis Cepat
                    </Link>
                  </Button>
                </motion.div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button asChild className="w-full h-16 bg-foreground text-background hover:bg-emerald-500 hover:text-white font-black uppercase tracking-widest rounded-2xl text-xs transition-all shadow-xl border-none">
                    <Link href="/courses">
                      Pelajari Materi Baru <BookMarked size={18} className="ml-2" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button asChild variant="outline" className="w-full h-16 bg-background/50 backdrop-blur-md border-white/10 hover:border-primary/50 hover:bg-primary/5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                    <Link href="/review?mode=quick">
                      <Zap size={18} className="mr-2 text-primary" /> Kuis Cepat
                    </Link>
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        </Card>
        )}
        
        {/* SMART TIPS */}
        {!loading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-8 p-6 rounded-[1.5rem] bg-white/[0.02] backdrop-blur-xl border border-white/5 flex gap-5 items-center group hover:bg-white/[0.04] transition-all duration-300"
          >
            <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Tips Ahli</h4>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                Selesaikan sesi review sebelum jam 10 malam untuk mempertahankan bonus XP harianmu!
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
