"use client";

import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { BookOpen, Home, Library, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// Domain Components
import { GrammarCard } from "@/components/features/grammar/GrammarCard";
import { GrammarLevelNav } from "@/components/features/grammar/GrammarLevelNav";
import { GrammarSearch } from "@/components/features/grammar/GrammarSearch";
import { GrammarEmptyState } from "@/components/features/grammar/GrammarEmptyState";

const LEVELS = ["n5", "n4", "n3", "n2", "n1"];
const ITEMS_PER_PAGE = 12;

interface GrammarArticle {
  _id: string;
  title: string;
  slug: string;
}

interface GrammarClientProps {
  initialArticles?: GrammarArticle[];
}

export default function GrammarClient({ initialArticles = [] }: GrammarClientProps) {
  const [selectedLevel, setSelectedLevel] = useState("n5");
  const [searchTerm, setSearchTerm] = useState("");
  const [articles, setArticles] = useState<GrammarArticle[]>(initialArticles);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Hindari fetch ulang jika ini render pertama dan kita sudah punya data awal untuk N5
    if (selectedLevel === "n5" && articles.length > 0 && articles.length === (initialArticles?.length || 0)) {
      return;
    }

    async function fetchGrammar() {
      setLoading(true);
      const baseLevel = selectedLevel.toLowerCase();
      const jlptLevel = `jlpt-${baseLevel}`;

      const queryStr = `*[_type == "grammar_article" && (course_category->slug.current match $baseLevel + "*" || course_category->slug.current match "jlpt-" + $baseLevel + "*")] | order(title asc) { 
        _id, 
        title, 
        "slug": slug.current 
      }`;

      try {
        const data = await client.fetch(queryStr, { baseLevel, jlptLevel });
        setArticles(data);
        setCurrentPage(1); // Reset page on level change
      } catch (error) {
        console.error("Gagal memuat tata bahasa:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGrammar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLevel]);

  const filteredArticles = articles.filter(art => 
    art.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (!mounted) return null;

  return (
    <div className="max-w-7xl mx-auto w-full relative z-10 pt-4 md:pt-10">
      <nav className="mb-6 md:mb-10 flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-xs font-bold text-muted-foreground uppercase tracking-widest">
        <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1.5 md:gap-2">
          <Home size={14} /> <span className="hidden sm:inline">Beranda</span>
        </Link>
        <span className="text-muted-foreground/20">/</span>
        <Link href="/library" className="hover:text-primary transition-colors flex items-center gap-1.5 md:gap-2">
          <Library size={14} /> <span className="hidden sm:inline">Pustaka</span>
        </Link>
        <span className="text-muted-foreground/20">/</span>
        <span className="text-primary flex items-center gap-1.5 md:gap-2">
          <BookOpen size={14} /> <span className="hidden sm:inline">Tata Bahasa</span>
          <span className="sm:hidden">Tata Bahasa</span>
        </span>
      </nav>

      <header className="mb-6 md:mb-12">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 md:gap-8 border-b border-border pb-6 md:pb-12">
          <div className="flex items-center gap-4 md:gap-6">
            <Card className="w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-2xl bg-primary/10 border-primary/20 flex items-center justify-center neo-inset shadow-none">
              <BookOpen size={24} className="text-primary md:w-8 md:h-8" />
            </Card>
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-none mb-1 md:mb-2">
                Panduan <span className="text-primary">Tata Bahasa</span>
              </h1>
              <span className="text-[10px] md:text-xs text-muted-foreground font-medium tracking-tight uppercase tracking-widest">Pahami pola kalimat biar naklukin JLPT.</span>
            </div>
          </div>

          <GrammarLevelNav 
            levels={LEVELS}
            selectedLevel={selectedLevel}
            onLevelChange={(lvl) => {
              setSelectedLevel(lvl);
              setSearchTerm("");
            }}
          />
        </div>
      </header>

      <GrammarSearch value={searchTerm} onChange={setSearchTerm} />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 items-stretch min-h-[400px]">
        <AnimatePresence>
          {loading ? (
            [...Array(6)].map((_, i) => (
              <Card key={i} className="h-48 md:h-56 bg-card/40 backdrop-blur-xl border-border rounded-[2rem] overflow-hidden p-6 relative">
                <div className="flex justify-between items-start mb-6">
                  <Skeleton className="w-10 h-10 rounded-2xl bg-background/5" />
                  <Skeleton className="w-16 h-6 rounded-xl bg-background/5" />
                </div>
                <Skeleton className="w-3/4 h-8 rounded-xl bg-background/5 mb-4" />
                <Skeleton className="w-1/2 h-4 rounded-lg bg-background/5 mt-auto" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
              </Card>
            ))
          ) : paginatedArticles.length > 0 ? (
            paginatedArticles.map((article, idx) => (
              <GrammarCard
                key={article._id}
                article={article}
                index={idx}
                selectedLevel={selectedLevel}
              />
            ))
          ) : (
            <GrammarEmptyState 
              searchTerm={searchTerm}
              selectedLevel={selectedLevel}
              onResetSearch={() => setSearchTerm("")}
            />
          )}
        </AnimatePresence>
      </section>

      {/* Pagination Controls */}
      {totalPages > 1 && !loading && (
        <div className="flex flex-col items-center gap-6 mt-16 pb-12">
          <div className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">
            Halaman <span className="text-primary">{currentPage}</span> dari {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-xl bg-card border border-border text-muted-foreground hover:text-primary transition-all disabled:opacity-30"
            >
              <ChevronsLeft size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-xl bg-card border border-border text-muted-foreground hover:text-primary transition-all disabled:opacity-30"
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
                        ? "bg-primary text-primary-foreground shadow-lg" 
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
              className="w-10 h-10 rounded-xl bg-card border border-border text-muted-foreground hover:text-primary transition-all disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-xl bg-card border border-border text-muted-foreground hover:text-primary transition-all disabled:opacity-30"
            >
              <ChevronsRight size={18} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
