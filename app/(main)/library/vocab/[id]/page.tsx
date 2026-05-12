/**
 * @file page.tsx
 * @description Halaman detail kosakata (Vocab Detail).
 * Menampilkan informasi mendalam tentang kata, termasuk contoh, mnemonic, dan konjugasi.
 * @module VocabDetailPage
 */

import { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity.fetch";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ChevronLeft, 
  Home, 
  Library, 
  Book, 
  Sparkles, 
  Layers,
  ArrowRightLeft,
  Link as LinkIcon,
  Info
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TTSReader from "@/components/features/tools/tts/TTSReader";
import { SmartJapanese } from "@/components/ui/SmartJapanese";
import { vocabDetailQuery } from "@/lib/queries";

interface VocabRelatedKanji {
  _id: string;
  character: string;
  meaning: string;
  onyomi: string;
  kunyomi: string;
  slug: string;
}

interface VocabRelatedWord {
  _id: string;
  slug?: string;
  word: string;
  meaning: string;
  furigana?: string;
  romaji?: string;
}

interface VocabExample {
  japanese: string;
  indonesian: string;
  furigana?: string;
  romaji?: string;
}

interface VocabDetail {
  _id: string;
  slug: string;
  word: string;
  furigana?: string;
  romaji?: string;
  meaning: string;
  hinshi?: string;
  pitchAccent?: string;
  mnemonic?: string;
  showInFlashcard?: boolean;
  jlptLevel?: string;
  audioUrl?: string;
  relatedKanji?: VocabRelatedKanji[];
  synonyms?: VocabRelatedWord[];
  antonyms?: VocabRelatedWord[];
  examples?: VocabExample[];
  usageNotes?: string;
  negative?: string;
  past?: string;
  pastNegative?: string;
  teForm?: string;
  adverbial?: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  const vocab = await sanityFetch<VocabDetail | null>({
    query: vocabDetailQuery,
    params: { id: decodedId },
    tags: ["vocab", "verb_dictionary"],
  });

  if (!vocab) {
    return {
      title: "Kosakata Tidak Ditemukan | NihongoRoute",
    };
  }

  return {
    title: `${vocab.word} (${vocab.meaning}) | NihongoRoute Kosakata`,
    description: `Pelajari arti, cara baca, dan penggunaan kata ${vocab.word} (${vocab.romaji}) dalam bahasa Jepang.`,
  };
}

export default async function VocabDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  const vocab = await sanityFetch<VocabDetail | null>({
    query: vocabDetailQuery,
    params: { id: decodedId },
    tags: ["vocab", "verb_dictionary"],
  });

  if (!vocab) return notFound();

  const isAdjective = vocab.hinshi ? ["i-adjective", "na-adjective"].includes(vocab.hinshi) : false;

  return (
    <main className="w-full bg-background px-4 md:px-8 lg:px-12 relative overflow-hidden flex flex-col justify-start min-h-screen pb-32 transition-colors duration-300">
      {/* Ambient Background Glows */}
      <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse" />
      <div className="absolute bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-secondary/5 blur-[120px] rounded-full pointer-events-none z-0" />
      
      {/* Background Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--foreground-rgb),0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--foreground-rgb),0.01)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none z-0" />

      <div className="max-w-5xl mx-auto w-full relative z-10 pt-8 md:pt-16">
        {/* Breadcrumbs */}
        <nav className="mb-10 md:mb-16 flex flex-wrap items-center gap-2 md:gap-4 text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">
          <Link href="/dashboard" className="hover:text-primary transition-all flex items-center gap-1.5 md:gap-2 group">
            <Home size={14} aria-hidden="true" className="group-hover:scale-110 transition-transform" /> 
            <span className="hidden sm:inline">Beranda</span>
          </Link>
          <span className="opacity-20">/</span>
          <Link href="/library" className="hover:text-primary transition-all flex items-center gap-1.5 md:gap-2 group">
            <Library size={14} aria-hidden="true" className="group-hover:scale-110 transition-transform" /> 
            <span className="hidden sm:inline">Pustaka</span>
          </Link>
          <span className="opacity-20">/</span>
          <Link href="/library/vocab" className="hover:text-primary transition-all flex items-center gap-1.5 md:gap-2 group">
            <Book size={14} aria-hidden="true" className="group-hover:scale-110 transition-transform" /> 
            <span className="hidden sm:inline">Kosakata</span>
          </Link>
          <span className="opacity-20">/</span>
          <span className="text-primary flex items-center gap-1.5 md:gap-2 drop-shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]">
            {vocab.word}
          </span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(0,auto)]">
          {/* 1. Hero Bento (Fokus Utama) */}
          <Card className="p-8 md:p-12 bg-card/40 backdrop-blur-xl border-border rounded-[2rem] hover:border-primary/40 transition-all group overflow-hidden relative md:col-span-2 lg:col-span-2 md:row-span-2 flex flex-col items-center justify-center text-center shadow-2xl">
            <div className="absolute top-4 right-4 z-10">
              <TTSReader text={vocab.word} minimal={false} />
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground font-japanese leading-none tracking-tighter mb-4 drop-shadow-sm mt-8">
              <SmartJapanese word={vocab.word} furigana={vocab.furigana} />
            </h1>
            {vocab.romaji && (
              <p className="text-sm md:text-base font-black text-muted-foreground uppercase tracking-[0.4em] opacity-50 mb-6">
                {vocab.romaji}
              </p>
            )}
            <div className="h-1.5 w-16 bg-primary rounded-full mb-6 shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] mx-auto" />
            <p className="text-2xl md:text-3xl font-black text-foreground leading-tight">
              {vocab.meaning}
            </p>
          </Card>

          {/* 2. Meta Data Bento (Atribut Kata) */}
          <Card className="p-6 bg-card/20 backdrop-blur-xl border-border rounded-[2rem] hover:border-primary/40 transition-all group overflow-hidden relative col-span-1 flex flex-col justify-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Atribut Kata</span>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl bg-primary/10 text-primary border-primary/20">
                {vocab.hinshi || "Kosakata"}
              </Badge>
              {vocab.jlptLevel && (
                <Badge variant="outline" className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl bg-secondary/10 text-secondary border-secondary/20">
                  JLPT {vocab.jlptLevel}
                </Badge>
              )}
              {vocab.pitchAccent && (
                <Badge variant="secondary" className="px-3 py-1.5 text-[9px] font-bold tracking-widest bg-muted border-border">
                  PITCH: {vocab.pitchAccent}
                </Badge>
              )}
            </div>
          </Card>

          {/* 3. Mnemonic & Notes Bento */}
          <Card className="p-6 bg-warning/5 backdrop-blur-xl border-warning/20 rounded-[2rem] hover:border-warning/40 transition-all group overflow-hidden relative col-span-1 md:col-span-1 lg:col-span-1 flex flex-col gap-4">
            <div className="absolute -top-4 -right-4 p-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-700 text-warning">
              <Sparkles size={80} />
            </div>
            {vocab.mnemonic && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} aria-hidden="true" className="text-warning" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-warning">Mnemonic</span>
                </div>
                <p className="text-sm font-medium text-warning leading-relaxed italic">
                  &quot;{vocab.mnemonic}&quot;
                </p>
              </div>
            )}
            {vocab.usageNotes && (
              <div className={vocab.mnemonic ? "pt-4 border-t border-warning/10" : ""}>
                <div className="flex items-center gap-2 mb-2">
                  <Info size={14} aria-hidden="true" className="text-warning" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-warning">Catatan</span>
                </div>
                <p className="text-sm font-medium text-warning/90 leading-relaxed">
                  {vocab.usageNotes}
                </p>
              </div>
            )}
            {!vocab.mnemonic && !vocab.usageNotes && (
              <div className="flex items-center gap-2 opacity-50">
                 <Info size={14} aria-hidden="true" className="text-warning" />
                 <span className="text-xs italic text-warning">Belum ada catatan khusus.</span>
              </div>
            )}
          </Card>

          {/* 4. Conjugation Bento (Jika Kata Sifat) */}
          {isAdjective && (
            <Card className="p-6 md:p-8 bg-card/20 backdrop-blur-xl border-border rounded-[2rem] hover:border-primary/40 transition-all group overflow-hidden relative md:col-span-3 lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <ArrowRightLeft size={18} aria-hidden="true" className="text-primary" />
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Konjugasi Kata Sifat</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Negatif", value: vocab.negative },
                  { label: "Lampau", value: vocab.past },
                  { label: "Lampau Negatif", value: vocab.pastNegative },
                  { label: "Te-Form", value: vocab.teForm },
                  { label: "Adverbial", value: vocab.adverbial },
                ].map((conj, i) => conj.value && (
                  <div key={i} className="p-4 bg-[rgba(var(--muted-rgb),0.2)] border border-border rounded-xl">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1">{conj.label}</span>
                    <span className="text-base font-bold text-foreground font-japanese">{conj.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* 5. Examples Bento */}
          <Card className="p-6 md:p-8 bg-card/20 backdrop-blur-xl border-border rounded-[2rem] hover:border-primary/40 transition-all group overflow-hidden relative md:col-span-full lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Layers size={18} aria-hidden="true" className="text-primary" />
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Contoh Penggunaan</h2>
            </div>
            <div className="space-y-4">
              {vocab.examples?.map((ex: { japanese: string; indonesian: string; furigana?: string; romaji?: string }, i: number) => (
                <div key={i} className="p-5 bg-[rgba(var(--card-rgb),0.3)] border border-border rounded-2xl">
                  <div className="mb-3 flex flex-col gap-1">
                    <p className="text-lg md:text-xl font-bold text-foreground font-japanese leading-relaxed">
                      <SmartJapanese word={ex.japanese} furigana={ex.furigana} />
                    </p>
                    {ex.romaji && (
                      <span className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-[0.2em] font-sans opacity-60">
                        {ex.romaji}
                      </span>
                    )}
                  </div>
                  <div className="flex items-start gap-3 border-t border-border/50 pt-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                    <p className="text-sm font-medium text-muted-foreground italic">
                      {ex.indonesian}
                    </p>
                  </div>
                </div>
              ))}
              {(!vocab.examples || vocab.examples.length === 0) && (
                <p className="text-xs text-muted-foreground italic">Belum ada contoh kalimat untuk kata ini.</p>
              )}
            </div>
          </Card>

          {/* 6. Related Context Bento */}
          <Card className="p-6 md:p-8 bg-card/20 backdrop-blur-xl border-border rounded-[2rem] hover:border-primary/40 transition-all group overflow-hidden relative md:col-span-full lg:col-span-2 space-y-8">
            {/* Related Kanji */}
            {vocab.relatedKanji && vocab.relatedKanji.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <LinkIcon size={16} aria-hidden="true" className="text-primary" />
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">Karakter Kanji</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {vocab.relatedKanji.map((kanji: { _id: string; character: string; meaning: string; onyomi: string; kunyomi: string; slug: string }) => (
                    <Link key={kanji._id} href={`/library/kanji/${kanji.character}`}>
                      <div className="p-2 pr-4 bg-[rgba(var(--muted-rgb),0.3)] border border-border rounded-xl flex items-center gap-3 hover:border-primary/40 transition-all group/kanji">
                        <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-xl font-japanese group-hover/kanji:text-primary transition-colors">
                          {kanji.character}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-foreground uppercase">{kanji.meaning}</p>
                          <p className="text-[8px] font-bold text-muted-foreground mt-0.5">{kanji.onyomi} • {kanji.kunyomi}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Synonyms */}
            {vocab.synonyms && vocab.synonyms.length > 0 && (
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground block">Sinonim</span>
                <div className="flex flex-wrap gap-2">
                  {vocab.synonyms.map((s: { _id: string; word: string; meaning: string; romaji?: string; slug?: string }) => (
                    <Link key={s._id} href={`/library/vocab/${s.slug}`}>
                      <Badge variant="secondary" className="px-3 py-1.5 rounded-lg bg-muted border border-border hover:border-primary/40 transition-all cursor-pointer">
                        <span className="font-japanese mr-1.5">{s.word}</span>
                        <span className="text-[8px] opacity-60">({s.meaning})</span>
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Antonyms */}
            {vocab.antonyms && vocab.antonyms.length > 0 && (
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground block">Antonim</span>
                <div className="flex flex-wrap gap-2">
                  {vocab.antonyms.map((a: { _id: string; word: string; meaning: string; romaji?: string; slug?: string }) => (
                    <Link key={a._id} href={`/library/vocab/${a.slug}`}>
                      <Badge variant="secondary" className="px-3 py-1.5 rounded-lg bg-muted border border-border hover:border-destructive/40 transition-all cursor-pointer">
                        <span className="font-japanese mr-1.5">{a.word}</span>
                        <span className="text-[8px] opacity-60">({a.meaning})</span>
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {!(vocab.relatedKanji?.length) && !(vocab.synonyms?.length) && !(vocab.antonyms?.length) && (
               <p className="text-xs text-muted-foreground italic">Tidak ada referensi tambahan untuk kata ini.</p>
            )}
          </Card>
        </div>

        {/* Action Footer */}
        <footer className="mt-20 pt-16 border-t border-border flex flex-col md:flex-row items-center justify-between gap-8">
          <Link href="/library/vocab" className="w-full md:w-auto">
            <Button variant="ghost" className="w-full px-10 py-8 h-auto text-[11px] md:text-xs font-black uppercase tracking-[0.2em] rounded-2xl bg-[rgba(var(--muted-rgb),0.3)] border border-border hover:bg-[rgba(var(--muted-rgb),0.5)] hover:border-primary/30 transition-all gap-4 group">
              <ChevronLeft size={20} aria-hidden="true" className="group-hover:-translate-x-2 transition-transform" /> Kembali ke Daftar Kosakata
            </Button>
          </Link>
        </footer>
      </div>
    </main>
  );
}
