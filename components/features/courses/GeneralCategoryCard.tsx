"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";

interface GeneralCategoryCardProps {
  cat: {
    _id: string;
    title: string;
    slug: string;
    description?: string;
    previews?: { _id: string; title: string; slug: string }[];
  };
  variants: Variants;
}

/**
 * Komponen kartu kategori umum untuk halaman kursus.
 */
export function GeneralCategoryCard({ cat, variants }: GeneralCategoryCardProps) {
  return (
    <motion.div variants={variants} className="h-full">
      <Card className="flex flex-col h-full bg-card rounded-[2.5rem] p-8 md:p-12 border border-border shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full -mr-20 -mt-20 pointer-events-none group-hover:bg-amber-500/10 transition-all duration-700" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-500/60 mb-3 block">
              Kategori Umum
            </span>
            <h4 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-none">
              {cat.title}
            </h4>
          </div>
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-muted border border-border flex items-center justify-center text-amber-600 dark:text-amber-500 shadow-inner">
            <BookOpen size={28} />
          </div>
        </div>

        <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed mb-10 max-w-xl relative z-10">
          {cat.description || "Eksplorasi materi bahasa Jepang di luar kurikulum standar JLPT."}
        </p>

        {cat.previews && cat.previews.length > 0 && (
          <div className="grid gap-3 mb-10 relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
              Pratinjau Materi:
            </span>
            {cat.previews.map((preview) => (
              <Link
                key={preview._id}
                href={`/courses/${cat.slug}/${preview.slug}`}
                className="group/item flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border hover:bg-amber-500/10 hover:border-amber-500/30 transition-all duration-300"
              >
                <span className="text-xs md:text-sm font-bold text-muted-foreground group-hover/item:text-foreground transition-colors">
                  {preview.title}
                </span>
                <ArrowRight size={14} className="text-muted-foreground/30 group-hover/item:text-amber-500 transition-colors" />
              </Link>
            ))}
          </div>
        )}

        <div className="mt-auto pt-8 border-t border-border relative z-10">
          <Link
            href={`/courses/${cat.slug}`}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-amber-500 hover:bg-foreground text-white dark:text-black font-black uppercase tracking-widest text-xs dark:hover:bg-white transition-all duration-300 shadow-lg"
          >
            Buka Semua Materi <ArrowRight size={16} />
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}
