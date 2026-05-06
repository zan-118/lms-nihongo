"use client";

import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Home, Library, Search, BookText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GrammarCard } from "@/components/features/grammar/GrammarCard";
import { Skeleton } from "@/components/ui/skeleton";

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

          <nav className="inline-flex p-1.5 bg-muted/50 dark:bg-black/40 backdrop-blur-md rounded-2xl md:rounded-[2rem] border border-border dark:border-white/5 shadow-2xl overflow-x-auto w-full xl:w-auto no-scrollbar relative">
            {LEVELS.map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  setSelectedLevel(lvl);
                  setSearchTerm("");
                }}
                className={`relative flex-1 md:flex-none px-6 md:px-10 py-3 md:py-4 h-auto rounded-xl md:rounded-[1.5rem] text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 z-10 ${
                  selectedLevel === lvl
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {selectedLevel === lvl && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-xl md:rounded-[1.5rem] shadow-[0_0_20px_rgba(0,238,255,0.4)] z-[-1]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{lvl}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* SEARCH SECTION */}
      <div className="mb-10 md:mb-16 relative group max-w-2xl">
        <div className="absolute inset-y-0 left-5 md:left-7 flex items-center pointer-events-none z-10">
          <Search className="text-muted-foreground group-focus-within:text-primary transition-colors duration-300" size={20} />
        </div>
        <Input
          placeholder="Cari pola kalimat (contoh: ~te kureru)..."
          className="w-full pl-14 md:pl-16 pr-8 py-5 md:py-7 h-auto bg-card/40 backdrop-blur-xl border-white/5 rounded-2xl md:rounded-[2rem] text-sm md:text-lg text-foreground placeholder:text-muted-foreground/30 font-bold shadow-2xl focus-visible:ring-primary/30 focus-visible:border-primary/50 transition-all duration-500"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
        {/* Decorative Ring */}
        <div className="absolute inset-0 rounded-2xl md:rounded-[2rem] border border-primary/0 group-focus-within:border-primary/20 pointer-events-none transition-all duration-500 scale-[1.01]" />
      </div>

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
                {/* Aura Shimmer */}
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
            <Card className="col-span-full py-20 md:py-32 bg-card/20 backdrop-blur-sm border border-dashed border-white/10 rounded-[2.5rem] text-center px-6 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-center mb-8">
                  <div className="w-20 h-20 rounded-[2rem] bg-primary/5 flex items-center justify-center border border-primary/10 shadow-[0_0_30px_rgba(0,238,255,0.1)]">
                    <BookText size={32} className="text-primary/40" />
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-foreground uppercase tracking-tight mb-4">
                  {searchTerm ? "Pola Kalimat Tidak Ditemukan" : "Materi Belum Tersedia"}
                </h3>
                <p className="text-muted-foreground font-medium text-sm md:text-base max-w-md mx-auto mb-10 leading-relaxed">
                  {searchTerm 
                    ? `Waduh, hasil buat "${searchTerm}" gak ketemu nih. Coba cari kata kunci lain atau periksa ejaanmu.` 
                    : `Sabar ya, Sensei kami lagi ngeracik materi buat level ${selectedLevel.toUpperCase()}. Pantau terus!`}
                </p>
                {searchTerm && (
                  <Button 
                    onClick={() => setSearchTerm("")}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-10 py-6 h-auto font-black uppercase tracking-[0.2em] text-xs transition-all shadow-[0_0_20px_rgba(0,238,255,0.3)]"
                  >
                    Reset Pencarian
                  </Button>
                )}
              </div>
              {/* Background Ambient Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
            </Card>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
