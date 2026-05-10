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
  Link as LinkIcon
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TTSReader from "@/components/features/tools/tts/TTSReader";
import { SmartJapanese } from "@/components/ui/SmartJapanese";
import { vocabDetailQuery } from "@/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const vocab = await sanityFetch({
    query: vocabDetailQuery,
    params: { id },
    tags: ["vocab"],
  });

  if (!vocab) {
    return {
      title: "Kosakata Tidak Ditemukan | NihongoRoute",
    };
  }

  return {
    title: `${vocab.word} (${vocab.meaning}) | NihongoRoute`,
    description: `Pelajari cara baca, arti, dan contoh kalimat untuk kata ${vocab.word}.`,
  };
}

export default async function VocabDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vocab = await sanityFetch({
    query: vocabDetailQuery,
    params: { id },
    tags: ["vocab"],
  });

  if (!vocab) notFound();

  const isAdjective = ["i-adjective", "na-adjective"].includes(vocab.hinshi);

  return (
    <main className="w-full bg-background px-4 md:px-8 lg:px-12 relative overflow-hidden flex flex-col justify-start min-h-screen pb-32 transition-colors duration-300">
      {/* Ambient Background Glows */}
      <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse" />
      <div className="absolute bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none z-0" />
      
      {/* Background Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none z-0" />

      <div className="max-w-5xl mx-auto w-full relative z-10 pt-8 md:pt-16">
        {/* Breadcrumbs */}
        <nav className="mb-10 md:mb-16 flex flex-wrap items-center gap-2 md:gap-4 text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">
          <Link href="/dashboard" className="hover:text-primary transition-all flex items-center gap-1.5 md:gap-2 group">
            <Home size={14} className="group-hover:scale-110 transition-transform" /> Beranda
          </Link>
          <span className="opacity-20">/</span>
          <Link href="/library" className="hover:text-primary transition-all flex items-center gap-1.5 md:gap-2 group">
            <Library size={14} className="group-hover:scale-110 transition-transform" /> Pustaka
          </Link>
          <span className="opacity-20">/</span>
          <Link href="/library/vocab" className="hover:text-primary transition-all flex items-center gap-1.5 md:gap-2 group">
            <Book size={14} className="group-hover:scale-110 transition-transform" /> Kosakata
          </Link>
          <span className="opacity-20">/</span>
          <span className="text-primary flex items-center gap-1.5 md:gap-2 drop-shadow-[0_0_10px_rgba(0,238,255,0.3)]">
            {vocab.word}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT COLUMN: Main Info & Conjugations */}
          <div className="lg:col-span-7 space-y-8">
            {/* Header Card */}
            <Card className="p-8 md:p-12 bg-card/40 backdrop-blur-xl border-border rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
              <div className="flex justify-between items-start mb-8">
                <Badge variant="outline" className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl bg-primary/10 text-primary border-primary/20">
                  {vocab.hinshi || "N/A"}
                </Badge>
                <div className="flex items-center gap-3">
                  {vocab.pitchAccent && (
                    <Badge variant="secondary" className="px-3 py-1 text-[9px] font-bold tracking-widest bg-muted border-border">
                      PITCH: {vocab.pitchAccent}
                    </Badge>
                  )}
                  <TTSReader text={vocab.word} minimal={false} />
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-start gap-4">
                <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-foreground font-japanese leading-none tracking-tighter mb-4 drop-shadow-sm">
                  <SmartJapanese word={vocab.word} furigana={vocab.furigana} />
                </h1>
                {vocab.romaji && (
                  <p className="text-sm md:text-base font-black text-muted-foreground uppercase tracking-[0.4em] opacity-40">
                    {vocab.romaji}
                  </p>
                )}
                <div className="h-1.5 w-24 bg-primary rounded-full mt-6 shadow-[0_0_15px_rgba(0,238,255,0.5)]" />
                <p className="text-3xl md:text-4xl font-black text-foreground mt-8 leading-tight">
                  {vocab.meaning}
                </p>
              </div>
            </Card>

            {/* Conjugations Section (Conditional) */}
            {isAdjective && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 ml-2">
                  <ArrowRightLeft size={18} className="text-primary" />
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Konjugasi Kata Sifat</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Negatif", value: vocab.negative },
                    { label: "Lampau", value: vocab.past },
                    { label: "Lampau Negatif", value: vocab.pastNegative },
                    { label: "Te-Form", value: vocab.teForm },
                    { label: "Adverbial", value: vocab.adverbial },
                  ].map((conj, i) => conj.value && (
                    <Card key={i} className="p-5 bg-card/30 border-border rounded-2xl glass hover:border-primary/30 transition-colors">
                      <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-2">{conj.label}</span>
                      <span className="text-lg font-bold text-foreground font-japanese">{conj.value}</span>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Examples Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 ml-2">
                <Layers size={18} className="text-primary" />
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Contoh Penggunaan</h2>
              </div>
              <div className="space-y-4">
                {vocab.examples?.map((ex: { japanese: string; indonesian: string }, i: number) => (
                  <Card key={i} className="p-6 md:p-8 bg-card/20 border-border rounded-[2rem] hover:bg-card/40 transition-all group">
                    <p className="text-xl md:text-2xl font-bold text-foreground font-japanese mb-4 leading-relaxed">
                      {ex.japanese}
                    </p>
                    <div className="flex items-center gap-3 border-t border-border/50 pt-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                      <p className="text-sm md:text-base font-medium text-muted-foreground italic">
                        {ex.indonesian}
                      </p>
                    </div>
                  </Card>
                ))}
                {(!vocab.examples || vocab.examples.length === 0) && (
                  <p className="text-xs text-muted-foreground italic ml-2">Belum ada contoh kalimat untuk kata ini.</p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar Info */}
          <div className="lg:col-span-5 space-y-8">
            {/* Mnemonic Card */}
            {vocab.mnemonic && (
              <Card className="p-8 bg-warning/5 border-warning/20 rounded-[2.5rem] relative overflow-hidden group shadow-xl">
                <div className="absolute -top-4 -right-4 p-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-700 text-warning">
                  <Sparkles size={80} />
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles size={16} className="text-warning" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-warning">Mnemonic Memory</span>
                </div>
                <p className="text-sm md:text-base font-medium text-amber-900/80 dark:text-amber-100/70 leading-relaxed italic">
                  &quot;{vocab.mnemonic}&quot;
                </p>
              </Card>
            )}

            {/* Related Kanji Section */}
            {vocab.relatedKanji && vocab.relatedKanji.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 ml-2">
                  <LinkIcon size={18} className="text-primary" />
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Karakter Kanji</h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {vocab.relatedKanji.map((kanji: { _id: string; character: string; meaning: string; onyomi: string; kunyomi: string; slug: string }) => (
                    <Link key={kanji._id} href={`/library/kanji/${kanji.slug}`}>
                      <Card className="p-4 bg-muted/20 border-border rounded-2xl flex items-center gap-4 hover:border-primary/40 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center text-2xl font-japanese group-hover:text-primary transition-colors">
                          {kanji.character}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-foreground uppercase truncate">{kanji.meaning}</p>
                          <div className="flex gap-2 mt-0.5">
                            <span className="text-[8px] font-bold text-primary/70">{kanji.onyomi}</span>
                            <span className="text-[8px] font-bold text-success/70">{kanji.kunyomi}</span>
                          </div>
                        </div>
                        <ChevronLeft size={16} className="rotate-180 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Synonyms & Antonyms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {vocab.synonyms && vocab.synonyms.length > 0 && (
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Sinonim</span>
                  <div className="flex flex-wrap gap-2">
                    {vocab.synonyms.map((s: { _id: string; word: string; meaning: string }) => (
                      <Link key={s._id} href={`/library/vocab/${s._id}`}>
                        <Badge variant="secondary" className="px-3 py-1.5 rounded-lg bg-muted border border-border hover:border-primary/40 transition-all cursor-pointer">
                          <span className="font-japanese mr-1.5">{s.word}</span>
                          <span className="text-[8px] opacity-60">({s.meaning})</span>
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {vocab.antonyms && vocab.antonyms.length > 0 && (
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Antonim</span>
                  <div className="flex flex-wrap gap-2">
                    {vocab.antonyms.map((a: { _id: string; word: string; meaning: string }) => (
                      <Link key={a._id} href={`/library/vocab/${a._id}`}>
                        <Badge variant="secondary" className="px-3 py-1.5 rounded-lg bg-muted border border-border hover:border-destructive/40 transition-all cursor-pointer">
                          <span className="font-japanese mr-1.5">{a.word}</span>
                          <span className="text-[8px] opacity-60">({a.meaning})</span>
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <footer className="mt-20 pt-16 border-t border-border flex flex-col md:flex-row items-center justify-between gap-8">
          <Link href="/library/vocab" className="w-full md:w-auto">
            <Button variant="ghost" className="w-full px-10 py-8 h-auto text-[11px] md:text-xs font-black uppercase tracking-[0.2em] rounded-2xl bg-muted/30 border border-border hover:bg-muted/50 hover:border-primary/30 transition-all gap-4 group">
              <ChevronLeft size={20} className="group-hover:-translate-x-2 transition-transform" /> Kembali ke Galeri
            </Button>
          </Link>
        </footer>
      </div>
    </main>
  );
}
