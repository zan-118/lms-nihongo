/**
 * LOKASI FILE: app/(main)/library/verbs/VerbListClient.tsx
 * KONSEP: Mobile-First Neumorphic (Matriks Konjugasi Kata Kerja)
 * POLA: Card Grid + Popup Modal untuk detail konjugasi
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Home,
  Library,
  Activity,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

// Domain Components & Hooks
import { VerbData } from "@/components/features/library/verbs/types";
import { useVerbFilter } from "@/components/features/library/verbs/useVerbFilter";
import { VerbCard } from "@/components/features/library/verbs/VerbCard";
import { VerbDetailModal } from "@/components/features/library/verbs/VerbDetailModal";
import { VerbFlashcardView } from "@/components/features/library/verbs/VerbFlashcardView";

export default function VerbListClient({
  initialVerbs,
}: {
  initialVerbs: VerbData[];
}) {
  const [selectedVerb, setSelectedVerb] = useState<VerbData | null>(null);
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [drillMode, setDrillMode] = useState<"meaning" | "masu" | "te" | "nai" | "ta">("meaning");
  const [showRomaji, setShowRomaji] = useState(true);

  const {
    searchTerm,
    handleSearchChange,
    activeGroup,
    handleGroupChange,
    currentPage,
    handlePageChange,
    totalPages,
    filteredVerbs,
    paginatedVerbs,
  } = useVerbFilter(initialVerbs);

  // Flashcard Mode View
  if (isFlashcardMode && filteredVerbs.length > 0) {
    return (
      <VerbFlashcardView
        filteredVerbs={filteredVerbs}
        drillMode={drillMode}
        setDrillMode={setDrillMode}
        onBack={() => setIsFlashcardMode(false)}
      />
    );
  }

  return (
    <div className="w-full flex flex-col flex-1 pb-24 px-4 md:px-8 lg:px-12">
      {/* Breadcrumb Navigation */}
      <nav className="mb-8 md:mb-12 flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-xs font-bold text-muted-foreground uppercase tracking-widest">
        <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1.5 md:gap-2">
          <Home size={14} /> <span className="hidden sm:inline">Beranda</span>
        </Link>
        <span className="text-muted-foreground/20">/</span>
        <Link href="/library" className="hover:text-primary transition-colors flex items-center gap-1.5 md:gap-2">
          <Library size={14} /> <span className="hidden sm:inline">Pustaka</span>
        </Link>
        <span className="text-muted-foreground/20">/</span>
        <span className="text-primary flex items-center gap-1.5 md:gap-2">
          <RefreshCw size={14} /> <span className="hidden sm:inline">Kata Kerja</span>
          <span className="sm:hidden">Kata Kerja</span>
        </span>
      </nav>

      {/* Header Section */}
      <header className="mb-10 md:mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-10 border-b border-border pb-8 md:pb-12">
          <div className="flex items-center gap-5 md:gap-6">
            <Card className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-2xl bg-primary/10 border-primary/20 flex items-center justify-center neo-inset shadow-none">
              <RefreshCw size={28} className="text-primary md:w-8 md:h-8" />
            </Card>
            <div className="text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-none mb-2">
                Kamus <span className="text-primary">Kata Kerja</span>
              </h1>
              <span className="text-xs md:text-xs text-muted-foreground font-medium tracking-tight uppercase tracking-widest">Eksplorasi perubahan morfologi kata kerja bahasa Jepang.</span>
            </div>
          </div>
          <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
             <div className="flex flex-col items-start md:items-end gap-1">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Jumlah Kata</span>
                <span className="text-xs md:text-xs font-black text-foreground">{filteredVerbs.length} Kata</span>
             </div>
             <Button
               onClick={() => setIsFlashcardMode(true)}
               className="h-auto py-4 px-6 md:py-5 md:px-8 rounded-xl md:rounded-2xl bg-primary hover:bg-foreground text-white dark:text-foreground font-bold uppercase tracking-widest transition-all shadow-lg border-none text-xs md:text-sm"
             >
               Mulai Latihan
             </Button>
          </div>
        </div>
      </header>

      {/* Filter & Search Section */}
      <div className="mb-10 md:mb-16 bg-card p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-border neo-card shadow-sm">
        <div className="flex flex-col gap-6 md:gap-8">
           <div className="relative group w-full">
            <Search
              className="absolute left-5 md:left-7 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10"
              size={20}
            />
            <Input
              placeholder="Cari berdasarkan kata dasar, arti, atau romaji..."
              className="w-full pl-12 md:pl-16 pr-6 md:pr-8 py-6 md:py-8 h-auto bg-muted/30 border-border rounded-2xl md:rounded-[2rem] text-sm md:text-base text-foreground placeholder:text-muted-foreground font-medium neo-inset shadow-none focus-visible:ring-primary/30"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 md:gap-3">
             {[null, 1, 2, 3].map((g) => (
               <Button
                 key={g === null ? "all" : g}
                 variant="ghost"
                 onClick={() => handleGroupChange(g)}
                 className={`px-4 py-2 md:px-6 md:py-3 h-auto rounded-xl text-xs md:text-xs font-bold uppercase tracking-widest transition-all border ${
                   activeGroup === g 
                     ? "bg-primary text-primary-foreground border-none shadow-lg" 
                     : "bg-muted border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                 }`}
               >
                 {g === null ? "Semua Golongan" : `Golongan ${g}`}
               </Button>
             ))}
          </div>

          <div className="w-full lg:w-auto flex items-center justify-between lg:justify-end gap-4 px-4 py-3 bg-muted/20 border border-border rounded-xl md:rounded-2xl neo-inset">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Tampilkan Romaji</span>
              <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-tight">Pemandu bacaan Latin</span>
            </div>
            <Switch 
              checked={showRomaji} 
              onCheckedChange={setShowRomaji}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 items-start">
        <AnimatePresence mode="popLayout">
          {filteredVerbs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full py-20 md:py-28 text-center border border-dashed border-border rounded-2xl bg-muted/20 neo-inset shadow-none px-4"
            >
              <div className="flex justify-center mb-5">
                 <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                    <Search size={24} className="text-muted-foreground" />
                 </div>
              </div>
              <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest">
                Maaf, kata kerja tidak ditemukan dalam database.
              </p>
            </motion.div>
          ) : (
            paginatedVerbs.map((verb, idx) => (
              <VerbCard
                key={verb._id}
                verb={verb}
                idx={idx}
                showRomaji={showRomaji}
                onClick={() => setSelectedVerb(verb)}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-10 md:mt-14 flex flex-col items-center gap-5">
          <div className="flex items-center gap-3 text-xs md:text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <span>Halaman <span className="text-primary">{currentPage}</span> dari {totalPages}</span>
            <span className="text-border">|</span>
            <span>{filteredVerbs.length} Kata Kerja</span>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2 flex-wrap justify-center">
            <Button
              variant="ghost"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(1)}
              className="w-10 h-10 md:w-12 md:h-12 p-0 rounded-xl bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronsLeft size={16} />
            </Button>

            <Button
              variant="ghost"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              className="w-10 h-10 md:w-12 md:h-12 p-0 rounded-xl bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
            </Button>

            {(() => {
              const pages: number[] = [];
              const maxVisible = 5;
              let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
              const end = Math.min(totalPages, start + maxVisible - 1);
              if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
              for (let i = start; i <= end; i++) pages.push(i);

              return (
                <>
                  {start > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => handlePageChange(1)}
                        className="w-10 h-10 md:w-12 md:h-12 p-0 rounded-xl bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 text-xs md:text-sm font-bold transition-all"
                      >
                        1
                      </Button>
                      {start > 2 && <span className="text-muted-foreground px-1">…</span>}
                    </>
                  )}
                  {pages.map((page) => (
                    <Button
                      key={page}
                      variant="ghost"
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 md:w-12 md:h-12 p-0 rounded-xl text-xs md:text-sm font-bold transition-all ${
                        page === currentPage
                          ? "bg-primary text-primary-foreground border-none shadow-lg"
                          : "bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                  {end < totalPages && (
                    <>
                      {end < totalPages - 1 && <span className="text-muted-foreground px-1">…</span>}
                      <Button
                        variant="ghost"
                        onClick={() => handlePageChange(totalPages)}
                        className="w-10 h-10 md:w-12 md:h-12 p-0 rounded-xl bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 text-xs md:text-sm font-bold transition-all"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </>
              );
            })()}

            <Button
              variant="ghost"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              className="w-10 h-10 md:w-12 md:h-12 p-0 rounded-xl bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={16} />
            </Button>

            <Button
              variant="ghost"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(totalPages)}
              className="w-10 h-10 md:w-12 md:h-12 p-0 rounded-xl bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronsRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Conjugation Detail Modal */}
      <VerbDetailModal
        selectedVerb={selectedVerb}
        onClose={() => setSelectedVerb(null)}
      />

      <footer className="mt-16 md:mt-24 pt-10 md:pt-16 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6">
         <div className="flex items-center gap-3">
            <Activity size={16} className="text-primary animate-pulse" />
            <span className="text-muted-foreground font-bold text-xs md:text-xs uppercase tracking-widest">Sistem Morfologi Siap</span>
         </div>
         <Link href="/library" className="w-full sm:w-auto">
            <Button variant="ghost" className="w-full px-8 py-6 md:px-10 md:py-7 h-auto text-xs md:text-xs font-bold uppercase tracking-widest rounded-2xl bg-muted border border-border neo-card shadow-none hover:bg-primary hover:text-primary-foreground transition-all gap-3 group">
               <ChevronLeft size={16} className="group-hover:-translate-x-1.5 transition-transform duration-300" /> Kembali ke Pustaka
            </Button>
         </Link>
      </footer>
    </div>
  );
}
