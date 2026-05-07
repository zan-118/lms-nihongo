"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * Komponen Hero untuk Landing Page.
 */
export function Hero() {
  return (
    <section className="min-h-[75vh] flex flex-col items-center justify-center text-center mb-24">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-8"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Badge
            variant="outline"
            className="bg-cyan-400/10 border-cyan-400/20 px-4 py-2 rounded-xl flex items-center gap-2 shadow-none backdrop-blur-md"
          >
            <Sparkles size={14} className="text-cyan-600 dark:text-cyan-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
              Next-Gen Learning Platform
            </span>
          </Badge>
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-foreground mb-8"
      >
        Kuasai <br />
        <motion.span 
          initial={{ filter: "blur(20px)" }}
          animate={{ filter: "blur(0px)" }}
          transition={{ delay: 0.2, duration: 1 }}
          className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500 drop-shadow-sm dark:drop-shadow-[0_0_25px_rgba(34,211,238,0.4)]"
        >
          Bahasa Jepang.
        </motion.span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-muted-foreground text-sm md:text-lg max-w-2xl mb-12 leading-relaxed font-medium"
      >
        Belajar bahasa Jepang jadi lebih seru dan mudah. Gratis, modern, 
        dan didesain khusus untuk membantumu mahir lebih cepat.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
      >
        <Button
          asChild
          className="bg-primary hover:bg-foreground text-primary-foreground font-black uppercase tracking-widest h-auto py-4 px-10 rounded-xl shadow-[0_0_20px_rgba(0,238,255,0.3)] hover:shadow-[0_0_40px_rgba(0,238,255,0.5)] transition-all group border-none"
        >
          <Link href="/dashboard">
            Mulai Belajar Sekarang{" "}
            <ArrowRight
              size={18}
              className="ml-2 group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="h-auto py-4 px-10 bg-muted border border-border hover:bg-background transition-all text-foreground font-bold uppercase tracking-widest text-xs md:text-xs shadow-none rounded-xl"
        >
          <Link href="/courses">
            <PlayCircle size={18} className="mr-2 text-primary" /> Jelajahi Materi
          </Link>
        </Button>
      </motion.div>
    </section>
  );
}
