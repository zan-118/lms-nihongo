"use client";

import { useState, useEffect } from "react";
import { getGrammarArticles } from "@/app/actions/library.actions";
import { AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/Pagination";

// Domain Components
import { GrammarCard } from "@/components/features/grammar/GrammarCard";
import { GrammarSearch } from "@/components/features/grammar/GrammarSearch";
import { GrammarEmptyState } from "@/components/features/grammar/GrammarEmptyState";
import { GrammarHeader } from "@/components/features/grammar/GrammarHeader";

const LEVELS = ["n5", "n4", "n3", "n2", "n1"];
const ITEMS_PER_PAGE = 12;

interface GrammarArticle {
  id?: string;
  _id: string;
  title: string;
  slug: string;
  jlptLevel?: string;
  meaning?: string;
  formation?: string;
  notes?: string;
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
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  useEffect(() => {
    if (selectedLevel === "n5" && articles.length > 0 && articles.length === (initialArticles?.length || 0)) {
      return;
    }

    async function fetchGrammar() {
      setLoading(true);
      try {
        const data = await getGrammarArticles(selectedLevel);
        requestAnimationFrame(() => {
          setArticles(data);
          setCurrentPage(1); 
        });
      } catch (error) {
        console.error("Gagal memuat tata bahasa:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGrammar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLevel]);

  const filteredArticles = articles.filter(art => {
    const term = searchTerm.toLowerCase();
    const titleMatch = art.title.toLowerCase().includes(term);
    const meaningMatch = art.meaning?.toLowerCase().includes(term) || false;
    const formationMatch = art.formation?.toLowerCase().includes(term) || false;
    const notesMatch = art.notes?.toLowerCase().includes(term) || false;
    return titleMatch || meaningMatch || formationMatch || notesMatch;
  });

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      setCurrentPage(1);
    });
  }, [searchTerm]);

  if (!mounted) return null;

  return (
    <div className="max-w-7xl mx-auto w-full relative z-10 pt-4 md:pt-10">
      <GrammarHeader 
        levels={LEVELS}
        selectedLevel={selectedLevel}
        onLevelChange={(lvl) => {
          setSelectedLevel(lvl);
          setSearchTerm("");
        }}
      />

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
                key={article.id || article._id}
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

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className="mt-16 pb-12"
      />
    </div>
  );
}
