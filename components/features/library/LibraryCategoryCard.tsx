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
        <Card className="h-full p-6 md:p-8 rounded-[2rem] border border-border bg-card/40 backdrop-blur-xl glass hover:border-primary/50 hover:bg-primary/[0.05] hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.1)] transition-all duration-500 flex flex-col group shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-primary/10 transition-all duration-500" />
          
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-background border border-border rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-none transition-all duration-500 text-primary shadow-inner">
              {icon}
            </div>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">0{index + 1}</span>
          </div>

          <div className="flex-1 space-y-3 relative z-10">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] block opacity-70 group-hover:opacity-100 transition-opacity">
              {label}
            </span>
            <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors duration-300 leading-tight">
              {title}
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-medium group-hover:text-foreground/80 transition-colors line-clamp-3">
              {desc}
            </p>
          </div>

          <div className="mt-10 pt-6 border-t border-border/50 flex items-center justify-between relative z-10">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] group-hover:text-primary transition-colors">Akses Modul</span>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-background border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-none transition-all duration-500 shadow-sm">
               <ArrowRight size={16} />
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}
