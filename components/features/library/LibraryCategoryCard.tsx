"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface LibraryCategoryCardProps {
  href: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  label: string;
  delay: number;
  index: number;
}

/**
 * Komponen kartu kategori untuk halaman pustaka.
 */
export function LibraryCategoryCard({
  href,
  title,
  desc,
  icon,
  label,
  delay,
  index,
}: LibraryCategoryCardProps) {
  return (
    <Link href={href} className="group flex h-full">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        transition={{ delay }}
        className="w-full h-full"
      >
        <Card className="h-full p-5 md:p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:bg-primary/[0.03] hover:shadow-xl transition-all duration-300 flex flex-col group shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <div className="w-10 h-10 md:w-11 md:h-11 bg-muted rounded-xl flex items-center justify-center border border-border group-hover:bg-primary group-hover:text-white dark:group-hover:text-foreground group-hover:border-none transition-all duration-300 text-primary">
              {icon}
            </div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">0{index + 1}</span>
          </div>

          <div className="flex-1 space-y-1.5">
            <span className="text-xs font-bold text-primary/50 uppercase tracking-widest block">
              {label}
            </span>
            <h2 className="text-lg md:text-xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors duration-300 leading-snug">
              {title}
            </h2>
            <p className="text-xs md:text-xs text-muted-foreground leading-relaxed font-medium group-hover:text-foreground transition-colors">
              {desc}
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-xs md:text-xs font-bold text-muted-foreground uppercase tracking-wider group-hover:text-primary transition-colors">Akses Modul</span>
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-muted border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-white dark:group-hover:text-foreground group-hover:border-none transition-all duration-300">
               <ArrowRight size={14} />
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}
