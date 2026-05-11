"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { BookOpen, ChevronRight, GraduationCap, ChevronLeft, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Material {
  title: string;
  difficulty: string;
  slug: string;
  category?: string;
}

interface ReadingListClientProps {
  materials: Material[];
}

const ITEMS_PER_PAGE = 9;

export default function ReadingListClient({ materials }: ReadingListClientProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil((materials?.length || 0) / ITEMS_PER_PAGE);
  const paginatedMaterials = (materials || []).slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-primary">
          <BookOpen size={24} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Perpustakaan Digital</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter">
          Graded Reading
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl font-medium">
          Pilih bacaan yang sesuai dengan level Anda. Klik pada kata yang sulit untuk melihat arti dan mendengarkan pengucapannya.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {paginatedMaterials.map((material, index) => (
            <motion.div
              key={material.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/library/reading/${material.slug}`}>
                <div className="group h-full p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-3xl border border-border hover:border-primary/40 transition-all duration-500 relative overflow-hidden flex flex-col justify-between">
                  {/* Hover Glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-all" />
                  
                  <div className="space-y-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 uppercase font-black tracking-widest px-3 py-1">
                        {material.difficulty}
                      </Badge>
                      <div className="p-2 rounded-xl bg-background/5 group-hover:bg-primary/10 border border-border group-hover:border-primary/20 transition-all">
                        <GraduationCap size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {material.category || "General Reading"}
                      </span>
                      <h3 className="text-2xl font-black text-foreground leading-tight group-hover:text-primary transition-colors">
                        {material.title}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between relative z-10">
                    <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                      Mulai Membaca
                    </span>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-background/5 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>

        {materials.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4">
             <div className="w-20 h-20 rounded-full bg-background/5 border border-dashed border-border flex items-center justify-center mx-auto">
                <BookOpen size={32} className="text-muted-foreground opacity-30" />
             </div>
             <p className="text-muted-foreground font-medium">Belum ada materi bacaan yang tersedia.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-6 pt-12">
          <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
            Halaman <span className="text-primary">{currentPage}</span> dari {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground transition-all disabled:opacity-30"
            >
              <ChevronsLeft size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground transition-all disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "ghost"}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all ${
                      currentPage === pageNum 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                        : "bg-card border border-border text-muted-foreground hover:border-primary/40"
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
              className="w-10 h-10 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground transition-all disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground transition-all disabled:opacity-30"
            >
              <ChevronsRight size={18} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
