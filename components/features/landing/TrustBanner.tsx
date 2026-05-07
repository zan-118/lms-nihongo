"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Komponen Trust Banner untuk Landing Page.
 */
export function TrustBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full"
    >
      <Card className="p-8 md:p-12 rounded-[2.5rem] flex flex-col lg:flex-row items-center justify-between gap-10 bg-card/50 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:border-primary/40 hover:shadow-primary/10">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all duration-700" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] group-hover:bg-blue-500/20 transition-all duration-700" />
        
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-muted/50 backdrop-blur-xl border border-white/10 flex items-center justify-center rounded-2xl shrink-0 group-hover:border-primary/40 group-hover:scale-110 transition-all duration-500 shadow-xl">
            <ShieldCheck size={36} className="text-primary" />
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-foreground font-black uppercase text-2xl md:text-3xl tracking-tight mb-2">
              Sepenuhnya <span className="text-primary drop-shadow-[0_0_10px_rgba(0,238,255,0.4)]">Gratis Untukmu</span>
            </h4>
            <p className="text-muted-foreground text-sm md:text-base font-medium max-w-xl leading-relaxed">
              Dibuat dengan sepenuh hati untuk membantu siapa saja yang ingin belajar 
              bahasa Jepang tanpa harus terhalang biaya. Bergabunglah dengan komunitas pembelajar kami.
            </p>
          </div>
        </div>
        <Button
          asChild
          variant="link"
          className="text-primary font-black uppercase tracking-[0.4em] text-xs md:text-sm flex items-center gap-3 hover:gap-6 transition-all whitespace-nowrap shrink-0 group hover:no-underline relative z-10"
        >
          <Link href="/support">
            Kontribusi Project <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </Button>
      </Card>
    </motion.section>
  );
}
