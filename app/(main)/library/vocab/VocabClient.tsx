/**
 * LOKASI FILE: app/(main)/library/vocab/VocabClient.tsx
 * KONSEP: Mobile-First Neumorphic (Kamus Kosakata)
 * POLA: Server-Client Hybrid (Initial data from server, then client-side filtering/pagination via Sanity client)
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Home,
  Library,
  Book,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

// Domain Components & Hooks
import { VocabItem, LEVELS, HINSHI } from "@/components/features/library/vocab/types";
import { useVocabList } from "@/components/features/library/vocab/useVocabList";
import { VocabCard } from "@/components/features/library/vocab/VocabCard";
import { VocabFlashcardView } from "@/components/features/library/vocab/VocabFlashcardView";

export default function VocabClient({
  initialVocab,
}: {
  initialVocab: VocabItem[];
}) {
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [showRomaji, setShowRomaji] = useState(true);

  const {
    level,
    setLevel,
    hinshi,
    setHinshi,
    search,
    setSearch,
    vocabList,
    totalItems,
    loading,
    currentPage,
    totalPages,
    handlePageChange,
  } = useVocabList(initialVocab);

  // Practice Mode View
  if (isFlashcardMode && vocabList.length > 0) {
    return (
      <VocabFlashcardView
        vocabList={vocabList}
        onBack={() => setIsFlashcardMode(false)}
      />
    );
  }

  return (
    <div className="w-full flex flex-col flex-1 pb-24 px-4 md:px-8 lg:px-12">
      {/* Breadcrumb Navigation */}
      <nav className="mb-8 md:mb-12 flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-xs font-bold text-muted-foreground uppercase tracking-widest">
        <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1.5 md:gap-2">
          <Home size={14} /> Beranda
        </Link>
        <span className="text-muted-foreground/20">/</span>
        <Link href="/library" className="hover:text-primary transition-colors flex items-center gap-1.5 md:gap-2">
          <Library size={14} /> Pustaka
        </Link>
        <span className="text-muted-foreground/20">/</span>
        <span className="text-primary flex items-center gap-1.5 md:gap-2">
          <Book size={14} /> Kosakata
        </span>
      </nav>

      {/* Header Section */}
      <header className="mb-10 md:mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-10 border-b border-border pb-8 md:pb-12">
          <div className="flex items-center gap-5 md:gap-6">
            <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-2xl bg-primary/10 border-primary/20 flex items-center justify-center neo-inset shadow-none">
              <Book size={28} className="text-primary md:w-8 md:h-8" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-none mb-2">
                Pusat <span className="text-primary">Kosakata</span>
              </h1>
              <span className="text-xs md:text-xs text-muted-foreground font-medium tracking-tight uppercase tracking-widest">Ribuan kata untuk dikuasai.</span>
            </div>
          </div>
          <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
             <div className="flex flex-col items-start md:items-end gap-1">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Ditemukan</span>
                <span className="text-xs md:text-xs font-black text-foreground">{totalItems} Kata</span>
             </div>
             <Button
               onClick={() => setIsFlashcardMode(true)}
               disabled={vocabList.length === 0}
               className="h-auto py-4 px-6 md:py-5 md:px-8 rounded-xl md:rounded-2xl bg-primary hover:bg-foreground text-white dark:text-foreground font-bold uppercase tracking-widest transition-all shadow-lg border-none text-xs md:text-sm disabled:opacity-50"
             >
               Latih Halaman Ini
             </Button>
          </div>
        </div>
      </header>

      {/* Advanced Filter Panel */}
      <div className="mb-10 md:mb-16 bg-card p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-border neo-card shadow-sm">
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="relative group w-full">
            <Search
              className="absolute left-5 md:left-7 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10"
              size={20}
            />
            <Input
              placeholder="Cari kanji, hiragana, romaji, atau arti..."
              className="w-full pl-12 md:pl-16 pr-6 md:pr-8 py-6 md:py-8 h-auto bg-muted/30 border-border rounded-2xl md:rounded-[2rem] text-sm md:text-base text-foreground placeholder:text-muted-foreground font-medium neo-inset shadow-none focus-visible:ring-primary/30"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
            <div className="space-y-4">
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground block ml-1">Level JLPT</span>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {LEVELS.map((l) => (
                  <Button
                    key={l}
                    variant="ghost"
                    onClick={() => setLevel(l)}
                    className={`px-4 py-2 md:px-6 md:py-3 h-auto rounded-xl text-xs md:text-xs font-bold transition-all border ${
                      level === l 
                        ? "bg-primary text-primary-foreground border-none shadow-lg" 
                        : "bg-muted border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {l}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground block ml-1">Jenis Kata</span>
              <select
                value={hinshi}
                onChange={(e) => setHinshi(e.target.value)}
                className="w-full px-5 md:px-6 py-3 md:py-4 bg-muted border border-border rounded-xl md:rounded-2xl text-xs md:text-xs font-bold uppercase tracking-widest text-foreground outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
              >
                {HINSHI.map((h) => (
                  <option key={h.value} value={h.value} className="bg-card py-2 uppercase tracking-widest">{h.label}</option>
                ))}
              </select>
            </div>
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

      {/* Content Grid */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-32 flex flex-col items-center justify-center gap-6"
            >
              <div className="relative w-16 h-16">
                 <div className="absolute inset-0 rounded-full border-4 border-primary/10"></div>
                 <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              </div>
              <p className="text-xs md:text-xs font-black text-primary uppercase tracking-[0.3em] animate-pulse">Menyiapkan Kamus...</p>
            </motion.div>
          ) : vocabList.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-24 text-center border border-dashed border-border rounded-3xl bg-muted/20 neo-inset px-6"
            >
              <Search className="mx-auto mb-6 text-muted-foreground/30" size={48} />
              <p className="text-muted-foreground font-bold text-xs md:text-sm uppercase tracking-widest">
                Yah, kata yang kamu cari gak ketemu nih...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5"
            >
              {vocabList.map((item, idx) => (
                <VocabCard
                  key={item._id}
                  item={item}
                  idx={idx}
                  showRomaji={showRomaji}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 md:mt-16 flex flex-col items-center gap-6">
          <div className="flex items-center gap-4 text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">
            <span>Halaman <span className="text-primary">{currentPage}</span> dari {totalPages}</span>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2 flex-wrap justify-center">
            <Button
              variant="ghost"
              disabled={currentPage === 1 || loading}
              onClick={() => handlePageChange(1)}
              className="w-10 h-10 md:w-12 md:h-12 p-0 rounded-xl bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-30 transition-all"
            >
              <ChevronsLeft size={16} />
            </Button>

            <Button
              variant="ghost"
              disabled={currentPage === 1 || loading}
              onClick={() => handlePageChange(currentPage - 1)}
              className="w-10 h-10 md:w-12 md:h-12 p-0 rounded-xl bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-30 transition-all"
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

              return pages.map((page) => (
                <Button
                  key={page}
                  variant="ghost"
                  disabled={loading}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 md:w-12 md:h-12 p-0 rounded-xl text-xs md:text-sm font-black transition-all ${
                    page === currentPage
                      ? "bg-primary text-primary-foreground border-none shadow-lg"
                      : "bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                  }`}
                >
                  {page}
                </Button>
              ));
            })()}

            <Button
              variant="ghost"
              disabled={currentPage === totalPages || loading}
              onClick={() => handlePageChange(currentPage + 1)}
              className="w-10 h-10 md:w-12 md:h-12 p-0 rounded-xl bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={16} />
            </Button>

            <Button
              variant="ghost"
              disabled={currentPage === totalPages || loading}
              onClick={() => handlePageChange(totalPages)}
              className="w-10 h-10 md:w-12 md:h-12 p-0 rounded-xl bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-30 transition-all"
            >
              <ChevronsRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <footer className="mt-16 md:mt-24 pt-10 md:pt-16 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6">
         <div className="flex items-center gap-3">
            <Loader2 size={16} className={`text-primary ${loading ? 'animate-spin' : ''}`} />
            <span className="text-muted-foreground font-black text-[10px] md:text-xs uppercase tracking-[0.2em]">Basis Data Real-time</span>
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
