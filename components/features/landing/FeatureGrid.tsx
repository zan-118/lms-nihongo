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
      className="grid grid-cols-1 md:grid-cols-3 gap-[55px] mb-[89px]"
    >
      {[
        {
          title: "Hafal Tanpa Lupa",
          desc: "Gunakan algoritma cerdas untuk mengunci kosakata dalam ingatan jangka panjangmu secara otomatis.",
          icon: BrainCircuit,
          color: "primary"
        },
        {
          title: "Pustaka Lengkap",
          desc: "Akses ribuan tata bahasa, matriks kata kerja, dan kamus praktis dalam satu genggaman.",
          icon: Library,
          color: "secondary"
        },
        {
          title: "Siap Ujian JLPT",
          desc: "Latih kesiapanmu dengan simulasi ujian waktu nyata yang akurat untuk target kelulusanmu.",
          icon: Zap,
          color: "warning"
        }
      ].map((feature, idx) => (
        <motion.div key={idx} variants={itemVariants} className="h-full">
          <Card className="p-[34px] group relative overflow-hidden transition-all duration-500 flex flex-col h-full bg-card/10 backdrop-blur-xl border border-border rounded-[34px] hover:border-foreground/10 hover:bg-card/20 shadow-none">
            <div className="mb-[34px] p-5 bg-background border border-border w-fit rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-sm text-primary">
              <feature.icon size={28} className={`text-${feature.color}`} />
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-[13px] text-foreground group-hover:text-primary transition-colors">
              {feature.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed flex-1 font-medium group-hover:text-foreground/80 transition-colors">
              {feature.desc}
            </p>
          </Card>
        </motion.div>
      ))}
    </motion.section>
  );
}
