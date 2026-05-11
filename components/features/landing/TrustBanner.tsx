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
      className="w-full mb-[89px]"
    >
      <Card className="p-[55px] rounded-[34px] flex flex-col lg:flex-row items-center justify-between gap-[34px] bg-card/10 backdrop-blur-3xl border border-border shadow-none relative overflow-hidden group transition-all duration-700 hover:border-foreground/10">
        {/* Background Decorative Glow */}
        <div className="absolute -top-32 -left-32 w-89 h-89 bg-primary/5 rounded-full blur-[100px] group-hover:bg-primary/10 transition-all duration-700" />
        <div className="absolute -bottom-32 -right-32 w-89 h-89 bg-secondary/5 rounded-full blur-[100px] group-hover:bg-secondary/10 transition-all duration-700" />
        
        <div className="flex flex-col md:flex-row items-center gap-[34px] relative z-10">
          <div className="w-[89px] h-[89px] bg-background border border-border flex items-center justify-center rounded-2xl shrink-0 group-hover:scale-110 transition-all duration-700 shadow-sm">
            <ShieldCheck size={40} aria-hidden="true" className="text-primary" />
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-foreground font-bold text-3xl md:text-4xl tracking-tight mb-[13px]">
              Sepenuhnya <span className="text-primary">Gratis Untukmu</span>
            </h4>
            <p className="text-muted-foreground text-lg font-medium max-w-xl leading-relaxed text-balance">
              Dibuat dengan sepenuh hati untuk membantu siapa saja yang ingin belajar 
              bahasa Jepang tanpa terhalang biaya.
            </p>
          </div>
        </div>
        <Button
          asChild
          variant="ghost"
          className="h-[55px] px-8 bg-foreground/5 hover:bg-foreground hover:text-background transition-all text-xs font-bold uppercase tracking-widest rounded-2xl relative z-10"
        >
          <Link href="/support">
            Dukung Kami <ArrowRight size={16} aria-hidden="true" className="ml-3" />
          </Link>
        </Button>
      </Card>
    </motion.section>
  );
}
