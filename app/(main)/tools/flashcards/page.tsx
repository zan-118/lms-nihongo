/**
 * @file app/(main)/tools/flashcards/page.tsx
 * @description Pusat Latihan Flashcard (General Flashcards).
 * Orchestrator untuk pemilihan kategori, mode, dan sesi latihan.
 */

"use client";

import React, { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  RotateCw, 
  ChevronLeft, 
  Flame,
  PenTool
} from "lucide-react";
import FlashcardMaster from "@/components/features/flashcards/master/FlashcardMaster";
import { MasterCardData } from "@/components/features/flashcards/master/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Modular Components
import { FlashcardSelection } from "@/components/features/flashcards/FlashcardSelection";
import { FlashcardModeSelection } from "@/components/features/flashcards/FlashcardModeSelection";

interface Category {
  id: string;
  title: string;
  slug: string;
}

type ModeLatihan = "vocab" | "kanji" | "survival";

function FlashcardsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | "all" | null>(null);
  const [selectedMode, setSelectedMode] = useState<ModeLatihan | null>(null);
  const [cards, setCards] = useState<MasterCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingCards, setIsFetchingCards] = useState(false);
  const [hasAutoFetched, setHasAutoFetched] = useState(false);

  // Mengambil daftar kategori dari Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("course_categories")
          .select("id, title, slug")
          .order("title", { ascending: true });

        if (error) throw error;
        setCategories((data || []).map(c => ({ id: c.id, title: c.title, slug: c.slug })));
      } catch (error) {
        console.error("Gagal memuat kategori:", error);
        toast.error("Gagal memuat daftar kategori");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Trigger otomatis jika masuk via URL ?category=slug
  useEffect(() => {
    if (categorySlug && !hasAutoFetched) {
      requestAnimationFrame(() => {
        setHasAutoFetched(true);
        setSelectedCategory(categorySlug);
      });
    }
  }, [categorySlug, hasAutoFetched]);

  const fetchCardsAndStart = async (mode: ModeLatihan) => {
    setIsFetchingCards(true);
    setSelectedMode(mode);
    try {
      const supabase = createClient();
      let combined: MasterCardData[] = [];

      if (mode === "kanji") {
        let query = supabase
          .from("kanji")
          .select("id, character, meaning, onyomi, kunyomi, examples")
          .neq("show_in_flashcard", false)
          .limit(50);

        if (selectedCategory !== "all" && selectedCategory) {
          query = query.eq("jlpt_level", selectedCategory.toUpperCase());
        }

        const { data, error } = await query;
        if (error) throw error;

        combined = (data || []).map(k => ({
          id: k.id,
          docType: "kanji",
          word: k.character,
          meaning: k.meaning,
          details: { onyomi: k.onyomi || undefined, kunyomi: k.kunyomi || undefined },
          slug: k.character,
        }));
      } else {
        let query = supabase
          .from("vocab")
          .select("id, word, meaning_id, romaji, furigana, slug")
          .neq("show_in_flashcard", false)
          .limit(50);

        if (selectedCategory !== "all" && selectedCategory) {
          query = query.eq("jlpt_level", selectedCategory.toUpperCase());
        }

        const { data, error } = await query;
        if (error) throw error;

        combined = (data || []).map(v => ({
          id: v.id,
          docType: "vocab",
          word: v.word,
          meaning: v.meaning_id || "",
          romaji: v.romaji || undefined,
          furigana: v.furigana || undefined,
          slug: v.slug || undefined,
        }));
      }

      combined = combined.sort(() => Math.random() - 0.5);

      if (combined.length === 0) {
        toast.error("Moushiwake arimasen - Data kartu untuk mode ini belum tersedia.");
        setSelectedMode(null);
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

  const handleBackFromMode = () => {
    if (categorySlug) {
      router.push(`/courses/${categorySlug}`);
    } else {
      setSelectedCategory(null);
    }
  };

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
        <FlashcardSelection
          categories={categories}
          onSelectCategory={setSelectedCategory}
        />
      ) : !selectedMode ? (
        <FlashcardModeSelection
          selectedCategory={selectedCategory}
          onBack={handleBackFromMode}
          onSelectMode={fetchCardsAndStart}
        />
      ) : (
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
              <Button onClick={() => setSelectedMode(null)} variant="ghost" className="text-muted-foreground hover:text-foreground text-xs font-bold uppercase tracking-widest bg-muted/50 h-auto px-4 py-2.5 rounded-xl border border-border">
                <ChevronLeft size={14} className="mr-2" /> Ganti Mode
              </Button>
              <Badge variant="outline" className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 h-auto ${selectedMode === "kanji" ? "bg-secondary/10 border-secondary/30 text-secondary" : selectedMode === "survival" ? "bg-destructive/10 border-destructive/30 text-destructive" : "bg-primary/10 border-primary/30 text-primary"}`}>
                {selectedMode === "survival" ? <Flame size={16} /> : selectedMode === "kanji" ? <PenTool size={16} /> : <Zap size={16} />}
                <span>Mode {selectedMode}</span>
              </Badge>
            </header>

            <FlashcardMaster
              key={cards[0]?.id}
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
