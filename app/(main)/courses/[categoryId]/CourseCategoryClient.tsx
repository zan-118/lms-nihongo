/**
 * @file CourseCategoryClient.tsx
 * @description Antarmuka Daftar Materi untuk level spesifik. 
 * Menampilkan pilihan latihan (flashcard, kanji, survival), simulasi ujian, dan daftar pelajaran.
 * @module CourseCategoryClient
 */

"use client";

// ======================
// IMPORTS
// ======================
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  Layers,
  PenTool,
  Flame,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AppBreadcrumbs from "@/components/layout/AppBreadcrumbs";
import { LessonCard } from "@/components/features/course/LessonCard";
import { useUserStore } from "@/store/useUserStore";

// ======================
// CONFIG / CONSTANTS
// ======================
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

// ======================
// MAIN EXECUTION
// ======================

/**
 * Komponen CourseCategoryClient: Menampilkan struktur kurikulum level spesifik.
 */
interface Lesson {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
}

export default function CourseCategoryClient({
  data,
  categoryId,
}: {
  data: {
    category: {
      title: string;
      description?: string;
      type: string;
    };
    lessons: Lesson[];
  };
  categoryId: string;
}) {
  const isSideQuest = data.category.type === "general";
  const themeColor = isSideQuest ? "text-warning text-warning" : "text-primary text-primary";
  const themeBorder = isSideQuest ? "border-warning" : "border-primary";
  const completedLessons = useUserStore((s) => s.completedLessons);

  // ======================
  // RENDER
  // ======================
  return (
    <div className="w-full px-4 md:px-6 relative overflow-hidden bg-background text-foreground transition-colors duration-300 min-h-screen pt-12 pb-24">
      {/* Background Decor Ambient */}
      <div
        className={`absolute top-0 left-[-10%] w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none ${isSideQuest ? "bg-warning/5" : "bg-primary/5"}`}
      />
      <div className="absolute bottom-[20%] right-[-5%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        className="max-w-5xl mx-auto relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* HEADER & BREADCRUMB SECTION */}
        <header className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <AppBreadcrumbs 
              items={[
                { label: "Pusat Belajar", href: "/courses" },
                { label: data.category.title, active: true }
              ]} 
            />
            <Button
              variant="ghost"
              asChild
              className="w-fit h-auto py-2.5 px-5 rounded-xl border border-border bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-all text-[9px] font-bold uppercase tracking-widest neo-inset shadow-none"
            >
              <Link href="/courses">← Kembali</Link>
            </Button>
          </div>

          <motion.nav
            variants={itemVariants}
            className="mb-8 flex items-center gap-4"
          >
            <div className="h-[1px] flex-1 bg-border" />
            <span
              className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded border hidden sm:block ${isSideQuest ? "bg-warning/10 text-warning text-warning border-warning/20" : "bg-primary/10 text-primary text-primary border-primary/20"}`}
            >
              {isSideQuest ? "Bahan Belajar Seru" : "Jalur Utama"}
            </span>
          </motion.nav>

          <motion.h1
            variants={itemVariants}
            className={`text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-8 drop-shadow-lg ${isSideQuest ? "text-warning" : "text-foreground"}`}
          >
            {data.category.title}
          </motion.h1>

          {data.category.description && (
            <motion.div
              variants={itemVariants}
              className={`p-6 md:p-8 rounded-2xl border-l-4 bg-card border-border shadow-sm ${themeBorder}`}
            >
              <p className="text-sm md:text-lg text-muted-foreground font-medium leading-relaxed">
                {data.category.description}
              </p>
            </motion.div>
          )}
        </header>

        {/* AREA LATIHAN SECTION */}
        {!isSideQuest && (
          <motion.section variants={itemVariants} className="mb-20 md:mb-24">
            <div className="mb-6 md:mb-8 flex items-center gap-4">
              <h3
                className={`text-lg md:text-xl font-black uppercase tracking-tight flex items-center gap-3 ${themeColor}`}
              >
                Area Latihan
              </h3>
              <div className="h-[1px] flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              <Link href={`/tools/flashcards?category=${categoryId}`} className="group flex flex-col h-full">
                <Card className="p-6 md:p-8 bg-card border border-border rounded-2xl hover:border-primary/40 hover:bg-primary/[0.02] transition-all duration-300 flex flex-col items-center text-center gap-5 h-full cursor-pointer relative overflow-hidden group hover:shadow-xl">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-muted border border-border rounded-xl text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-inner relative z-10">
                    <Layers size={24} aria-hidden="true" />
                  </div>
                  <div className="mt-auto relative z-10">
                    <p className="text-lg md:text-xl font-black text-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors uppercase tracking-tight mb-1">
                      Kosakata
                    </p>
                    <p className="text-muted-foreground text-[9px] font-bold uppercase tracking-widest">
                      Mode Flashcard
                    </p>
                  </div>
                </Card>
              </Link>

              <Link href={`/tools/flashcards?category=${categoryId}`} className="group flex flex-col h-full">
                <Card className="p-6 md:p-8 bg-card border border-border rounded-2xl hover:border-secondary/40 hover:bg-secondary/[0.02] transition-all duration-300 flex flex-col items-center text-center gap-5 h-full cursor-pointer relative overflow-hidden group hover:shadow-xl">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-muted border border-border rounded-xl text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-secondary-foreground transition-all duration-300 shadow-inner relative z-10">
                    <PenTool size={24} aria-hidden="true" />
                  </div>
                  <div className="mt-auto relative z-10">
                    <p className="text-lg md:text-xl font-black text-foreground group-hover:text-secondary transition-colors uppercase tracking-tight mb-1">
                      Kamus Kanji
                    </p>
                    <p className="text-muted-foreground text-[9px] font-bold uppercase tracking-wider">
                      Baca & Tulis
                    </p>
                  </div>
                </Card>
              </Link>

              <Link href={`/tools/flashcards?category=${categoryId}`} className="group flex flex-col h-full">
                <Card className="p-6 md:p-8 bg-card border border-border rounded-2xl hover:border-destructive/40 hover:bg-destructive/[0.02] transition-all duration-300 flex flex-col items-center text-center gap-5 h-full cursor-pointer relative overflow-hidden group hover:shadow-xl">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-muted border border-border rounded-xl text-destructive flex items-center justify-center group-hover:bg-destructive group-hover:text-destructive-foreground transition-all duration-300 shadow-inner relative z-10">
                    <Flame size={24} aria-hidden="true" />
                  </div>
                  <div className="mt-auto relative z-10">
                    <p className="text-lg md:text-xl font-black text-foreground group-hover:text-destructive dark:group-hover:text-destructive transition-colors uppercase tracking-tight mb-1">
                      Survival
                    </p>
                    <p className="text-muted-foreground text-[9px] font-bold uppercase tracking-widest">
                      Adu Kecepatan
                    </p>
                  </div>
                </Card>
              </Link>
            </div>
          </motion.section>
        )}

        {/* DAFTAR SILABUS SECTION */}
        <motion.section variants={itemVariants} className="pb-12">
          <div className="mb-6 md:mb-8 flex items-center gap-4">
            <h3
              className={`text-lg md:text-xl font-black uppercase tracking-wider flex items-center gap-3 ${themeColor}`}
            >
              Daftar Materi
            </h3>
            <div className="h-[1px] flex-1 bg-border" />
          </div>

          {data.lessons && data.lessons.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {data.lessons.map((lesson: Lesson, index: number) => (
                <LessonCard
                  key={lesson._id}
                  lesson={lesson}
                  index={index}
                  categoryId={categoryId}
                  isSideQuest={isSideQuest}
                  progress={completedLessons[lesson._id] && !completedLessons[lesson._id].isDeleted ? 100 : 0}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 md:py-32 bg-muted/20 border border-dashed border-border rounded-2xl text-center px-8 relative overflow-hidden group">
              <div className="w-20 h-20 bg-muted border border-border rounded-2xl flex items-center justify-center mb-8 group-hover:border-primary/30 transition-all duration-500">
                <Sparkles size={32} className="text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
              </div>
              
              <h4 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tight mb-3">
                Materi Lagi Diracik!
              </h4>
              <p className="max-w-md text-muted-foreground text-xs md:text-sm font-semibold leading-relaxed">
                Bagian ini masih dalam proses pengembangan. Sabar ya, materi terbaik sedang disiapkan buat kamu!
              </p>
            </div>
          )}
        </motion.section>
      </motion.div>
    </div>
  );
}
