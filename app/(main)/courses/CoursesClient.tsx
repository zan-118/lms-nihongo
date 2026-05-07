/**
 * @file CoursesClient.tsx
 * @description Antarmuka interaktif untuk halaman landing kursus.
 * Menampilkan kategori JLPT dan kategori umum (General) yang diambil dari Sanity.
 * @module CoursesClient
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import { JLPTCard } from "@/components/features/courses/JLPTCard";
import { GeneralCategoryCard } from "@/components/features/courses/GeneralCategoryCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

interface Category {
  _id: string;
  title: string;
  slug: string;
  type: string;
  description?: string;
  previews?: { _id: string; title: string; slug: string }[];
}

interface CoursesClientProps {
  categories: Category[];
}

export default function CoursesClient({ categories }: CoursesClientProps) {
  const jlptCategories = categories.filter((cat) => cat.type === "jlpt");
  const generalCategories = categories.filter((cat) => cat.type === "general");

  return (
    <div className="w-full px-6 relative overflow-hidden bg-background text-foreground transition-colors duration-300 min-h-screen pt-12 pb-24">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        className="max-w-7xl mx-auto relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* HERO HEADER */}
        <header className="mb-20">
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-foreground"
          >
            MAU MULAI <br />
            <span className="text-primary drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
              DARI
            </span>{" "}
            MANA?
          </motion.h1>
        </header>


        {/* SECTION: JLPT TRACKS */}
        {jlptCategories.length > 0 && (
          <motion.section variants={itemVariants} className="mb-24">
            <div className="flex items-center gap-6 mb-10">
              <h3 className="text-xs md:text-xs font-bold uppercase tracking-widest text-primary/60 dark:text-primary/50">
                Jalur Level JLPT
              </h3>
              <div className="h-[1px] flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {jlptCategories.map((cat) => (
                <JLPTCard key={cat._id} cat={cat} variants={itemVariants} />
              ))}
            </div>
          </motion.section>
        )}

        {/* SECTION: GENERAL TOPICS */}
        {generalCategories.length > 0 && (
          <motion.section variants={itemVariants}>
            <div className="flex items-center gap-6 mb-10">
              <h3 className="text-xs md:text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500/50">
                Topik Umum & Praktis
              </h3>
              <div className="h-[1px] flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {generalCategories.map((cat) => (
                <GeneralCategoryCard key={cat._id} cat={cat} variants={itemVariants} />
              ))}
            </div>
          </motion.section>
        )}
      </motion.div>
    </div>
  );
}
