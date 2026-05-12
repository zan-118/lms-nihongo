/**
 * @file app/(main)/tools/flashcards/page.tsx
 * @description Pusat Latihan Flashcard (General Flashcards).
 * Terdiri dari 3 langkah: Pilih Kategori -> Pilih Mode Latihan -> Sesi Master.
 * @module FlashcardsPage
 */

"use client";

import React, { useState, useEffect, Suspense } from "react";
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  RotateCw, 
  ChevronLeft, 
  Layers,
  ArrowRight,
  BookOpen,
  Flame,
  PenTool
} from "lucide-react";
import FlashcardMaster from "@/components/features/flashcards/master/FlashcardMaster";
import { MasterCardData } from "@/components/features/flashcards/master/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
}

type ModeLatihan = "vocab" | "kanji" | "survival";

function FlashcardsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");

  // State Step Alur
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | "all" | null>(null);
  const [selectedMode, setSelectedMode] = useState<ModeLatihan | null>(null);
  
  // State Data
  const [cards, setCards] = useState<MasterCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingCards, setIsFetchingCards] = useState(false);
  const [hasAutoFetched, setHasAutoFetched] = useState(false);

  // Mengambil daftar kategori untuk Layar 1
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const query = `*[_type == "course_category"] { _id, title, slug }`;
        const data = await client.fetch(query);
        setCategories(data);
      } catch (error) {
        console.error("Gagal memuat kategori:", error);
        toast.error("Gagal memuat daftar kategori");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Trigger otomatis jika masuk via URL ?category=slug (Bypass Layar 1)
  useEffect(() => {
    if (categorySlug && !hasAutoFetched) {
      setHasAutoFetched(true);
      setSelectedCategory(categorySlug);
    }
  }, [categorySlug, hasAutoFetched]);

  // Fungsi Fetch Cards dan Eksekusi Layar 3
  const fetchCardsAndStart = async (mode: ModeLatihan) => {
    setIsFetchingCards(true);
    setSelectedMode(mode);
    try {
      let query = "";
      let params = {};
      const idOrSlug = selectedCategory;

      if (idOrSlug === "all") {
        if (mode === "kanji") {
          query = `*[_type == "kanji" && showInFlashcard != false][0...50] { _id, "_type": _type, "word": character, meaning, "details": { onyomi, kunyomi }, examples, "slug": coalesce(slug.current, character) }`;
        } else {
          query = `{
            "vocab": *[_type == "vocab" && showInFlashcard != false][0...50] { _id, "_type": _type, word, meaning, romaji, furigana, "slug": slug.current },
            "verbs": *[_type == "verb_dictionary" && showInFlashcard != false][0...50] { _id, "_type": _type, "word": jisho, meaning, romaji, furigana, "slug": slug.current }
          }`;
        }
      } else {
        const exactLevel = idOrSlug ? idOrSlug.toUpperCase() : "";
        params = { exactLevel };
        if (mode === "kanji") {
          query = `*[_type == "kanji" && showInFlashcard != false && jlptLevel == $exactLevel][0...50] { _id, "_type": _type, "word": character, meaning, "details": { onyomi, kunyomi }, examples, "slug": coalesce(slug.current, character) }`;
        } else {
          query = `{
            "vocab": *[_type == "vocab" && showInFlashcard != false && jlptLevel == $exactLevel][0...50] { _id, "_type": _type, word, meaning, romaji, furigana, "slug": slug.current },
            "verbs": *[_type == "verb_dictionary" && showInFlashcard != false && jlptLevel == $exactLevel][0...50] { _id, "_type": _type, "word": jisho, meaning, romaji, furigana, "slug": slug.current }
          }`;
        }
      }

      const rawData = await client.fetch(query, params);
      let combined = [];
      if (mode === "kanji") {
         combined = rawData;
      } else {
         combined = [...(rawData.vocab || []), ...(rawData.verbs || [])];
      }
      
      combined = combined.sort(() => Math.random() - 0.5);
      
      if (combined.length === 0) {
        toast.error("Moushiwake arimasen - Data kartu untuk mode ini belum tersedia.");
        setSelectedMode(null); // Kembali ke Layar 2 (Pilih Mode) jika kosong
      } else {
        setCards(combined);
      }
    } catch (error) {
      console.error("Gagal memuat kartu:", error);
      toast.error("Terjadi kendala saat memuat kartu.");
      setSelectedMode(null);
    } finally {
      setIsFetchingCards(false);
    }
  };

  // Navigasi Kembali Dinamis untuk Layar 2 (Pilih Mode)
  const handleBackFromMode = () => {
    if (categorySlug) {
      router.push(`/courses/${categorySlug}`);
    } else {
      setSelectedCategory(null);
    }
  };

  // Status Loading (Awal)
  if (isLoading && !categorySlug) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <RotateCw className="text-primary animate-spin mb-4" size={32} />
        <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs animate-pulse font-bold">
          Menyiapkan Pustaka...
        </p>
      </div>
    );
  }

  // Tampilan Loading Kartu (Transisi ke Layar 3)
  if (isFetchingCards) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <RotateCw className="text-primary animate-spin mb-4" size={32} />
        <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs animate-pulse font-bold">
          Mengumpulkan kartu...
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!selectedCategory ? (
        // ======================
        // LAYAR 1: SELEKSI KATEGORI
        // ======================
        <motion.div 
          key="selection"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-8 py-12"
        >
          <header className="mb-12">
            <nav className="mb-6 italic">
              <Button asChild variant="ghost" className="h-auto text-muted-foreground text-xs font-bold uppercase tracking-widest px-0 hover:bg-transparent hover:text-foreground">
                <Link href="/tools">← Kembali ke Peralatan</Link>
              </Button>
            </nav>
            <h1 className="text-4xl md:text-5xl font-black text-foreground uppercase tracking-tight italic">
              Pilih <span className="text-primary">Materi</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-2 max-w-xl font-medium leading-relaxed">
              Pilih level atau kategori yang ingin kamu latih.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <Card 
              onClick={() => setSelectedCategory("all")}
              className="group p-6 rounded-3xl border border-primary/20 bg-primary/5 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 cursor-pointer flex flex-col gap-4 relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                <Layers size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-foreground">Semua Materi</h3>
                <p className="text-xs text-muted-foreground font-medium mt-1 leading-relaxed">
                  Campuran dari seluruh koleksi yang tersedia.
                </p>
              </div>
              <ArrowRight size={20} className="absolute bottom-6 right-6 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Card>

            {categories.map((cat) => (
              <Card 
                key={cat._id}
                onClick={() => setSelectedCategory(cat.slug.current)}
                className="group p-6 rounded-3xl border border-border bg-card/50 hover:border-primary/40 hover:bg-primary/[0.02] transition-all duration-300 cursor-pointer flex flex-col gap-4 relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-foreground">{cat.title}</h3>
                  <p className="text-xs text-muted-foreground font-medium mt-1 leading-relaxed">
                    Fokus pada materi level {cat.title}.
                  </p>
                </div>
                <ArrowRight size={20} className="absolute bottom-6 right-6 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Card>
            ))}
          </div>
        </motion.div>
      ) : !selectedMode ? (
        // ======================
        // LAYAR 2: SELEKSI MODE LATIHAN
        // ======================
        <motion.div 
          key="mode"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-8 py-12"
        >
          <header className="mb-12">
            <nav className="mb-6 italic">
              <Button 
                onClick={handleBackFromMode}
                variant="ghost" 
                className="h-auto text-muted-foreground text-xs font-bold uppercase tracking-widest px-0 hover:bg-transparent hover:text-foreground"
              >
                {categorySlug ? "← Kembali ke Materi" : "← Kembali ke Kategori"}
              </Button>
            </nav>
            <h1 className="text-4xl md:text-5xl font-black text-foreground uppercase tracking-tight italic">
              Mode <span className="text-primary">Latihan</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-2 max-w-xl font-medium leading-relaxed">
              Kamu memilih kategori <strong className="text-foreground uppercase">{selectedCategory === "all" ? "Semua Materi" : selectedCategory}</strong>. Sekarang pilih cara kamu ingin berlatih.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card 
              onClick={() => fetchCardsAndStart('vocab')}
              className="group p-8 rounded-3xl border border-primary/20 bg-card hover:border-primary/60 hover:bg-primary/[0.02] transition-all duration-300 cursor-pointer flex flex-col items-center text-center gap-5 relative overflow-hidden shadow-sm hover:shadow-xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted border border-border text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-500 shadow-inner">
                <Layers size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">Kosakata</h3>
                <p className="text-xs text-muted-foreground font-medium mt-2 leading-relaxed">
                  Latihan flashcard memori standar. Ingat arti dan bacaan kartu dengan santai.
                </p>
              </div>
            </Card>

            <Card 
              onClick={() => fetchCardsAndStart('kanji')}
              className="group p-8 rounded-3xl border border-secondary/20 bg-card hover:border-secondary/60 hover:bg-secondary/[0.02] transition-all duration-300 cursor-pointer flex flex-col items-center text-center gap-5 relative overflow-hidden shadow-sm hover:shadow-xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted border border-border text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-secondary-foreground group-hover:scale-110 transition-all duration-500 shadow-inner">
                <PenTool size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-foreground group-hover:text-secondary transition-colors">Kamus Kanji</h3>
                <p className="text-xs text-muted-foreground font-medium mt-2 leading-relaxed">
                  Fitur lengkap Canvas menulis huruf. Pahami Onyomi, Kunyomi dan contoh katanya.
                </p>
              </div>
            </Card>

            <Card 
              onClick={() => fetchCardsAndStart('survival')}
              className="group p-8 rounded-3xl border border-destructive/20 bg-card hover:border-destructive/60 hover:bg-destructive/[0.02] transition-all duration-300 cursor-pointer flex flex-col items-center text-center gap-5 relative overflow-hidden shadow-sm hover:shadow-xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted border border-border text-destructive flex items-center justify-center group-hover:bg-destructive group-hover:text-destructive-foreground group-hover:scale-110 transition-all duration-500 shadow-inner">
                <Flame size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-foreground group-hover:text-destructive transition-colors">Survival</h3>
                <p className="text-xs text-muted-foreground font-medium mt-2 leading-relaxed">
                  Uji nyali! Modus tantangan ketat dengan Hit Points (HP) dan batas waktu.
                </p>
              </div>
            </Card>
          </div>
        </motion.div>
      ) : (
        // ======================
        // LAYAR 3: MODE LATIHAN FLASHCARD MASTER
        // ======================
        <motion.div 
          key="session"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 w-full px-4 md:px-8 relative overflow-hidden flex flex-col items-center"
        >
          <div className="relative z-10 w-full max-w-2xl mt-4 sm:mt-8">
            <header className="flex justify-between items-center mb-10">
              <Button
                onClick={() => setSelectedMode(null)}
                variant="ghost"
                className="text-muted-foreground hover:text-foreground text-xs font-bold uppercase tracking-widest bg-muted/50 h-auto px-4 py-2.5 rounded-xl border border-border"
              >
                <ChevronLeft size={14} className="mr-2" /> Ganti Mode
              </Button>
              <Badge
                variant="outline"
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 h-auto ${
                  selectedMode === "kanji" 
                    ? "bg-secondary/10 border-secondary/30 text-secondary" 
                    : selectedMode === "survival"
                    ? "bg-destructive/10 border-destructive/30 text-destructive"
                    : "bg-primary/10 border-primary/30 text-primary"
                }`}
              >
                {selectedMode === "survival" ? <Flame size={16} /> : selectedMode === "kanji" ? <PenTool size={16} /> : <Zap size={16} />}
                <span>Mode {selectedMode}</span>
              </Badge>
            </header>

            <FlashcardMaster
              key={cards[0]?._id}
              cards={cards}
              type={selectedMode === "kanji" ? "kanji" : "vocab"}
              mode={selectedMode === "survival" ? "tantangan" : "latihan"}
              isFixedMode={true}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ======================
// MAIN EXPORT WRAPPER
// ======================
export default function FlashcardsPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <RotateCw className="text-primary animate-spin mb-4" size={32} />
        <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs animate-pulse font-bold">
          Memuat Modul...
        </p>
      </div>
    }>
      <FlashcardsContent />
    </Suspense>
  );
}
