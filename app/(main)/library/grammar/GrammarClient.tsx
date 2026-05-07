"use client";

import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { BookOpen, Home, Library } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Domain Components
import { GrammarCard } from "@/components/features/grammar/GrammarCard";
import { GrammarLevelNav } from "@/components/features/grammar/GrammarLevelNav";
import { GrammarSearch } from "@/components/features/grammar/GrammarSearch";
import { GrammarEmptyState } from "@/components/features/grammar/GrammarEmptyState";

const LEVELS = ["n5", "n4", "n3", "n2", "n1"];

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

  useEffect(() => {
    // Hindari fetch ulang jika masih di level default (n5) dan ini render pertama
    if (selectedLevel === "n5" && articles === initialArticles && initialArticles.length > 0) {
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

  return (
    <div className="max-w-7xl mx-auto w-full relative z-10 pt-4 md:pt-10">
      <nav className="mb-6 md:mb-10 flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-xs font-bold text-muted-foreground uppercase tracking-widest">
        <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1.5 md:gap-2">
          <Home size={14} /> Beranda
        </Link>
        <span className="text-muted-foreground/20">/</span>
        <Link href="/library" className="hover:text-primary transition-colors flex items-center gap-1.5 md:gap-2">
          <Library size={14} /> Pustaka
        </Link>
        <span className="text-muted-foreground/20">/</span>
        <span className="text-primary flex items-center gap-1.5 md:gap-2">
          <BookOpen size={14} /> Tata Bahasa
        </span>
      </nav>

      <header className="mb-6 md:mb-12">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 md:gap-8 border-b border-border pb-6 md:pb-12">
          <div className="flex items-center gap-4 md:gap-6">
            <Card className="w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-2xl bg-primary/10 border-primary/20 flex items-center justify-center neo-inset shadow-none">
              <BookOpen size={24} className="text-primary md:w-8 md:h-8" />
            </Card>
            <div className="text-left">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-none mb-1 md:mb-2">
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

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 items-stretch">
        <AnimatePresence mode="popLayout">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <Card key={i} className="h-48 md:h-56 bg-card/40 backdrop-blur-xl border-white/5 rounded-[2rem] overflow-hidden p-6 relative">
                <div className="flex justify-between items-start mb-6">
                  <Skeleton className="w-10 h-10 rounded-2xl bg-white/5" />
                  <Skeleton className="w-16 h-6 rounded-xl bg-white/5" />
                </div>
                <Skeleton className="w-3/4 h-8 rounded-xl bg-white/5 mb-4" />
                <Skeleton className="w-1/2 h-4 rounded-lg bg-white/5 mt-auto" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
              </Card>
            ))
          ) : filteredArticles.length > 0 ? (
            filteredArticles.map((article, idx) => (
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
    </div>
  );
}
