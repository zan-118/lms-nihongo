"use client";

import React, { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Kanji {
  _id: string;
  character: string;
  meaning: string;
  onyomi: string[];
  kunyomi: string[];
  jlpt: string;
  slug: string;
}

interface KanjiListClientProps {
  kanjis: Kanji[];
}

export default function KanjiListClient({ kanjis }: KanjiListClientProps) {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string | null>(null);

  const filteredKanjis = kanjis.filter(k => {
    const matchesSearch = 
      k.character.includes(search) || 
      k.meaning.toLowerCase().includes(search.toLowerCase()) ||
      k.onyomi?.includes(search) ||
      k.kunyomi?.includes(search);
    
    const matchesFilter = !levelFilter || k.jlpt?.toUpperCase() === levelFilter?.toUpperCase();
    
    return matchesSearch && matchesFilter;
  });

  const levels = ["N5", "N4", "N3", "N2", "N1"];

  return (
    <div className="space-y-12">
      {/* Header & Filter */}
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tight text-foreground mb-4">
            Pustaka <span className="text-primary">Kanji</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Pelajari struktur dan cara penulisan kanji standar JLPT. Gunakan filter level untuk memfokuskan target pembelajaran Anda.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" aria-hidden="true" />
            <Input 
              placeholder="Cari kanji, arti, atau cara baca..." 
              className="pl-12 h-14 bg-card/40 backdrop-blur-xl border border-border rounded-2xl text-lg shadow-2xl focus:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {levels.map(lvl => (
              <Button
                key={lvl}
                variant={levelFilter === lvl ? "default" : "outline"}
                className={`h-14 px-6 rounded-2xl font-bold transition-all duration-300 ${
                  levelFilter === lvl 
                    ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]" 
                    : "bg-card/40 border border-border hover:bg-muted"
                }`}
                onClick={() => setLevelFilter(levelFilter === lvl ? null : lvl)}
              >
                {lvl}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredKanjis.map((kanji, idx) => (
            <motion.div
              key={kanji._id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ delay: Math.min(idx * 0.02, 0.5), type: "spring", stiffness: 100, damping: 20 }}
            >
              <Link href={`/library/kanji/${kanji.slug}`}>
                <Card className="group relative aspect-square flex flex-col items-center justify-center p-4 bg-card/30 backdrop-blur-3xl border border-border hover:border-primary/50 transition-all duration-500 rounded-[2rem] overflow-hidden hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.15)] cursor-pointer">
                  {/* Hover Background Accent */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* JLPT Tag */}
                  <div className="absolute top-4 right-4 text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                    {kanji.jlpt}
                  </div>

                  <span className="text-4xl md:text-5xl font-black text-foreground mb-2 group-hover:scale-110 transition-transform duration-500">
                    {kanji.character}
                  </span>
                  <span className="text-[10px] md:text-xs text-muted-foreground font-medium text-center line-clamp-1">
                    {kanji.meaning}
                  </span>

                  {/* Icon on Hover */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowRight size={14} className="text-primary" aria-hidden="true" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredKanjis.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center mb-6">
             <Search size={32} className="text-muted-foreground/50" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Data Kanji tidak ditemukan</h3>
          <p className="text-muted-foreground">Silakan periksa kembali kata kunci atau sesuaikan filter level JLPT.</p>
        </div>
      )}
    </div>
  );
}
