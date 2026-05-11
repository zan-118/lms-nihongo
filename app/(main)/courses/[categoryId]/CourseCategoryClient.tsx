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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AppBreadcrumbs from "@/components/layout/AppBreadcrumbs";
import { LessonCard } from "@/components/features/course/LessonCard";
import { useUserStore } from "@/store/useUserStore";
import { useState } from "react";

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

const ITEMS_PER_PAGE = 12;

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
  const completedLessons = useUserStore((s) => s.completedLessons);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil((data.lessons?.length || 0) / ITEMS_PER_PAGE);
  const paginatedLessons = (data.lessons || []).slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ======================
  // RENDER
  // ======================
  return (
    <div className="w-full px-6 md:px-12 relative overflow-hidden bg-background text-foreground transition-colors duration-500 min-h-screen pt-20 pb-32">
      {/* Background Decor Ambient - Refined for premium feel */}
      <div
        className={`absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none opacity-20 ${isSideQuest ? "bg-warning" : "bg-primary"}`}
      />
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[140px] pointer-events-none opacity-30" />

      <motion.div
        className="max-w-6xl mx-auto relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* HEADER SECTION - Asymmetrical & Dramatic */}
        <header className="mb-[89px]">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-[34px] mb-[21px]">
            <div className="max-w-3xl">
              <div className="flex items-center gap-[13px] mb-8">
                <AppBreadcrumbs 
                  items={[
                    { label: "Courses", href: "/courses" },
                    { label: data.category.title, active: true }
                  ]} 
                />
              </div>

              <motion.div
                variants={itemVariants}
                className="flex items-center gap-4 mb-8"
              >
                <span
                  className={`text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border ${
                    isSideQuest 
                      ? "bg-warning/5 text-warning border-warning/20 shadow-[0_0_15px_rgba(var(--warning-rgb),0.1)]" 
                      : "bg-primary/5 text-primary border-primary/20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]"
                  }`}
                >
                  {isSideQuest ? "Side Quest" : "Main Route"}
                </span>
                <div className="h-[1px] w-[34px] bg-border" />
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className={`text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8 text-balance ${isSideQuest ? "text-warning" : "text-foreground"}`}
              >
                {data.category.title}
              </motion.h1>

              {data.category.description && (
                <motion.p
                  variants={itemVariants}
                  className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl text-balance"
                >
                  {data.category.description}
                </motion.p>
              )}
            </div>

            <motion.div variants={itemVariants} className="hidden lg:block pb-2">
              <Button
                variant="ghost"
                asChild
                className="h-[55px] px-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:bg-card hover:border-border/80 transition-all text-xs font-bold uppercase tracking-widest"
              >
                <Link href="/courses">
                  <ChevronLeft className="mr-2" size={16} /> Kembali ke Kursus
                </Link>
              </Button>
            </motion.div>
          </div>
        </header>

        {/* AREA LATIHAN SECTION - Refined Grid */}
        {!isSideQuest && (
          <motion.section variants={itemVariants} className="mb-[55px]">
            <div className="mb-8 flex items-center gap-5">
              <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground/60 flex items-center gap-3">
                <Sparkles size={14} className={themeColor} /> Area Latihan
              </h3>
              <div className="h-[1px] flex-1 bg-border/40" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[
                { 
                  title: "Kosakata", 
                  desc: "Asah hafalan lewat flashcard", 
                  icon: Layers, 
                  color: "primary", 
                  href: `/tools/flashcards?category=${categoryId}` 
                },
                { 
                  title: "Lab Kanji", 
                  desc: "Latihan baca & tulis kanji", 
                  icon: PenTool, 
                  color: "secondary", 
                  href: `/tools/flashcards?category=${categoryId}` 
                },
                { 
                  title: "Mode Survival", 
                  desc: "Uji kecepatan ingatanmu", 
                  icon: Flame, 
                  color: "destructive", 
                  href: `/tools/flashcards?category=${categoryId}` 
                },
              ].map((item, i) => (
                <Link key={i} href={item.href} className="group">
                  <Card className="p-8 bg-card/40 backdrop-blur-md border border-border rounded-3xl hover:border-foreground/20 hover:bg-card/60 transition-all duration-500 flex flex-col gap-8 h-full cursor-pointer relative overflow-hidden group hover:shadow-2xl">
                    <div className={`w-14 h-14 bg-background border border-border rounded-2xl text-${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                      <item.icon size={24} aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight mb-2">
                        {item.title}
                      </h4>
                      <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
                        {item.desc}
                      </p>
                    </div>
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="text-muted-foreground" size={20} />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* DAFTAR SILABUS SECTION */}
        <motion.section variants={itemVariants} className="pb-32">
          <div className="mb-8 flex items-center gap-5">
            <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground/60">
              Daftar Pelajaran
            </h3>
            <div className="h-[1px] flex-1 bg-border/40" />
          </div>

          {data.lessons && data.lessons.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedLessons.map((lesson: Lesson, index: number) => (
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
            <div className="flex flex-col items-center justify-center py-32 glass rounded-[2.5rem] text-center px-[55px] border-dashed border-2">
              <div className="w-[89px] h-[89px] bg-background border border-border rounded-3xl flex items-center justify-center mb-8">
                <Sparkles size={40} className="text-muted-foreground/40" aria-hidden="true" />
              </div>
              
              <h4 className="text-3xl font-bold text-foreground tracking-tight mb-4 uppercase">
                Content Incoming
              </h4>
              <p className="max-w-md text-muted-foreground text-sm font-medium leading-relaxed">
                We&apos;re currently crafting the perfect lessons for this section. Stay tuned for a premium learning experience!
              </p>
            </div>
          )}

          {/* Pagination Controls - Refined */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-8 mt-[55px]">
              <div className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.3em]">
                Page <span className="text-foreground">{currentPage}</span> of {totalPages}
              </div>
              <div className="flex items-center gap-3 p-2 bg-card/40 backdrop-blur-sm border border-border rounded-2xl">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="w-11 h-11 rounded-xl hover:bg-background transition-all disabled:opacity-20"
                >
                  <ChevronsLeft size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-11 h-11 rounded-xl hover:bg-background transition-all disabled:opacity-20"
                >
                  <ChevronLeft size={18} />
                </Button>

                <div className="flex items-center gap-1.5 px-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "ghost"}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-11 h-11 rounded-xl font-bold transition-all ${
                          currentPage === pageNum 
                            ? `bg-foreground text-background shadow-xl` 
                            : "hover:bg-background text-muted-foreground"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-11 h-11 rounded-xl hover:bg-background transition-all disabled:opacity-20"
                >
                  <ChevronRight size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="w-11 h-11 rounded-xl hover:bg-background transition-all disabled:opacity-20"
                >
                  <ChevronsRight size={18} />
                </Button>
              </div>
            </div>
          )}
        </motion.section>
      </motion.div>
    </div>
  );
}
