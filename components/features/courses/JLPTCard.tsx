"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface JLPTCardProps {
  cat: {
    _id: string;
    title: string;
    slug: string;
    description?: string;
  };
  variants: Variants;
}

const colorMap: Record<string, string> = {
  "N5": "from-cyan-500/20 to-cyan-500/5",
  "N4": "from-emerald-500/20 to-emerald-500/5",
  "N3": "from-indigo-500/20 to-indigo-500/5",
  "N2": "from-purple-500/20 to-purple-500/5",
  "N1": "from-rose-500/20 to-rose-500/5",
};

const textGlowMap: Record<string, string> = {
  "N5": "text-primary drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]",
  "N4": "text-success drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]",
  "N3": "text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]",
  "N2": "text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]",
  "N1": "text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]",
};

/**
 * Komponen kartu level JLPT untuk halaman kursus.
 */
export function JLPTCard({ cat, variants }: JLPTCardProps) {
  const bgColor = colorMap[cat.title] || "from-primary/20 to-primary/5";
  const textGlow = textGlowMap[cat.title] || "text-primary drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]";
  const kanji = cat.title.includes("1") ? "壱" : cat.title.includes("2") ? "弐" : cat.title.includes("3") ? "参" : cat.title.includes("4") ? "肆" : "伍";

  return (
    <motion.div variants={variants} className="h-full">
      <Link
        href={`/courses/${cat.slug}`}
        className="group flex flex-col h-full"
      >
        <Card className={`flex flex-col h-full min-h-[260px] bg-card rounded-[2.5rem] p-8 border border-border shadow-2xl cursor-pointer hover:border-transparent transition-all duration-500 group relative overflow-hidden`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
          
          <div className="absolute -right-4 -top-8 text-[10rem] font-black text-foreground/[0.03] dark:text-foreground/[0.05] group-hover:text-foreground/[0.08] transition-all duration-700 pointer-events-none select-none font-japanese">
            {kanji}
          </div>

          <div className="relative z-10 flex flex-col h-full">
            <span className={`text-6xl md:text-7xl font-black text-foreground/20 group-hover:${textGlow} transition-all duration-500 mb-6 block tracking-tighter`}>
              {cat.title}
            </span>

            <p className="text-xs md:text-sm text-muted-foreground font-semibold leading-relaxed group-hover:text-foreground transition-colors mb-8">
              {cat.description || `Kuasai materi ${cat.title} dengan kurikulum terstruktur dan metode SRS.`}
            </p>

            <div className="mt-auto flex items-center justify-between pt-6 border-t border-border group-hover:border-white/10 transition-colors">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors">
                Mulai Jalur
              </span>
              <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background dark:group-hover:bg-background dark:group-hover:text-foreground group-hover:border-none transition-all duration-500 shadow-lg">
                <ArrowRight size={18} />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
