"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { BrainCircuit, Library, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

/**
 * Komponen Grid Fitur untuk Landing Page.
 */
export function FeatureGrid() {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-32"
    >
      {/* Hafal Tanpa Lupa */}
      <motion.div variants={itemVariants} className="h-full">
        <Card className="p-6 md:p-8 group relative overflow-hidden transition-all duration-300 flex flex-col h-full bg-card border border-border rounded-2xl hover:border-primary/40 hover:bg-primary/[0.02] shadow-lg">
          <div className="mb-8 p-4 bg-muted border border-border w-fit rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-inner text-primary group-hover:border-none relative z-10">
            <BrainCircuit size={24} />
          </div>
          <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-4 relative z-10 transition-colors duration-300 text-foreground group-hover:text-primary">
            Hafal Tanpa Lupa
          </h3>
          <p className="text-muted-foreground text-xs md:text-sm leading-relaxed flex-1 font-medium group-hover:text-foreground transition-colors duration-300 relative z-10">
            Gunakan algoritma cerdas untuk mengunci kosakata dalam ingatan jangka panjangmu secara otomatis.
          </p>
        </Card>
      </motion.div>

      {/* Pustaka Lengkap */}
      <motion.div variants={itemVariants} className="h-full">
        <Card className="p-6 md:p-8 group relative overflow-hidden transition-all duration-300 flex flex-col h-full bg-card rounded-2xl border border-border hover:border-secondary/40 hover:bg-secondary/[0.02] shadow-lg">
          <div className="mb-8 p-4 bg-muted border border-border w-fit rounded-xl group-hover:bg-secondary group-hover:text-secondary-foreground transition-all duration-300 shadow-inner text-secondary group-hover:border-none relative z-10">
            <Library size={24} />
          </div>
          <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-4 relative z-10 transition-colors duration-300 text-foreground group-hover:text-secondary">
            Pustaka Lengkap
          </h3>
          <p className="text-muted-foreground text-xs md:text-sm leading-relaxed flex-1 font-medium group-hover:text-foreground transition-colors duration-300 relative z-10">
            Akses ribuan tata bahasa, matriks kata kerja, dan kamus praktis dalam satu genggaman.
          </p>
        </Card>
      </motion.div>

      {/* Siap Ujian JLPT */}
      <motion.div variants={itemVariants} className="h-full">
        <Card className="p-6 md:p-8 group relative overflow-hidden transition-all duration-300 flex flex-col h-full bg-card rounded-2xl border border-border hover:border-warning/40 hover:bg-warning/[0.02] shadow-lg">
          <div className="mb-8 p-4 bg-muted border border-border w-fit rounded-xl group-hover:bg-warning group-hover:text-warning-foreground transition-all duration-300 shadow-inner text-warning group-hover:border-none relative z-10">
            <Zap size={24} />
          </div>
          <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-4 relative z-10 transition-colors duration-300 text-foreground group-hover:text-warning">
            Siap Ujian JLPT
          </h3>
          <p className="text-muted-foreground text-xs md:text-sm leading-relaxed flex-1 font-medium group-hover:text-foreground transition-colors duration-300 relative z-10">
            Latih kesiapanmu dengan simulasi ujian waktu nyata yang akurat untuk target kelulusanmu.
          </p>
        </Card>
      </motion.div>
    </motion.section>
  );
}
