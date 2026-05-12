/**
 * @file page.tsx
 * @description Halaman detail Kanji (Kanji Detail).
 * Menampilkan animasi goresan, cara baca, mnemonic, dan kosakata terkait.
 * @module KanjiDetailPage
 */

import { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity.fetch";
import { kanjiQuery } from "@/lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ChevronLeft, 
  Sparkles, 
  Link as LinkIcon,
  Play,
  Home,
  Library,
  Languages
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SmartJapanese } from "@/components/ui/SmartJapanese";
import KanjiStrokePlayer from "@/components/features/kanji/components/KanjiStrokePlayer";
import { PortableText } from "@portabletext/react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const kanji = await sanityFetch<any>({
    query: kanjiQuery,
    params: { id: decodedId },
    tags: ["kanji"],
  });

  if (!kanji) {
    return {
      title: "Kanji Tidak Ditemukan | NihongoRoute",
    };
  }

  return {
    title: `${kanji.character} (${kanji.meaning}) | NihongoRoute`,
    description: `Pelajari cara menulis, cara baca, dan mnemonic untuk kanji ${kanji.character}.`,
  };
}

export default async function KanjiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const kanji = await sanityFetch<any>({
    query: kanjiQuery,
    params: { id: decodedId },
    tags: ["kanji"],
  });

  if (!kanji) notFound();

  return (
    <main className="w-full bg-background px-4 md:px-8 lg:px-12 relative overflow-hidden flex flex-col justify-start min-h-screen pb-32 transition-colors duration-300">
      {/* Ambient Background Glows */}
      <div className="absolute top-[5%] -left-[10%] w-[45%] h-[45%] bg-secondary/10 blur-[130px] rounded-full pointer-events-none z-0 animate-pulse" />
      <div className="absolute bottom-[20%] -right-[15%] w-[35%] h-[35%] bg-primary/5 blur-[130px] rounded-full pointer-events-none z-0" />
      
      {/* Background Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--foreground-rgb),0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--foreground-rgb),0.01)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto w-full relative z-10 pt-8 md:pt-16">
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
          <Link href="/library/kanji" className="hover:text-primary transition-all flex items-center gap-1.5 md:gap-2 group">
            <Languages size={14} aria-hidden="true" className="group-hover:scale-110 transition-transform" /> 
            <span className="hidden sm:inline">Kanji</span>
          </Link>
          <span className="opacity-20">/</span>
          <span className="text-primary flex items-center gap-1.5 md:gap-2 drop-shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]">
            {kanji.character}
          </span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(0,auto)] animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
          {/* 1. Stroke & Visual Bento (Fokus Utama) */}
          <Card className="p-8 md:p-12 bg-card/20 backdrop-blur-xl border-border rounded-[2.5rem] hover:border-primary/40 transition-all flex flex-col items-center justify-center group relative overflow-hidden md:col-span-2 lg:col-span-2 md:row-span-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-[4rem] -mr-8 -mt-8 blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-tr-[4rem] -ml-8 -mb-8 blur-3xl group-hover:bg-secondary/20 transition-all duration-700" />
            
            <div className="w-full max-w-[200px] md:max-w-[300px] relative z-10 flex justify-center">
              <KanjiStrokePlayer 
                character={kanji.character} 
                sanitySvg={kanji.strokeOrderSvg}
                size={200}
              />
            </div>

            <div className="mt-8 flex flex-col items-center gap-3 relative z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tighter uppercase text-center drop-shadow-sm">
                {kanji.meaning}
              </h1>
              <Badge variant="outline" className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl bg-primary/10 text-primary border-primary/20">
                 JLPT {kanji.jlpt || "N/A"}
              </Badge>
            </div>
          </Card>

          {/* 2. Onyomi Bento (Cara Baca Mandarin) */}
          <Card className="p-8 bg-card/20 backdrop-blur-xl border-border rounded-[2.5rem] hover:border-primary/40 transition-all relative overflow-hidden flex flex-col justify-center col-span-1 group">
            <div className="absolute top-4 right-6 opacity-[0.05] group-hover:scale-110 transition-transform text-primary">
              <Play size={40} aria-hidden="true" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block mb-3 relative z-10">Onyomi</span>
            <span className="text-3xl md:text-4xl font-japanese font-black text-foreground leading-tight tracking-tight relative z-10">
              {kanji.onyomi || "—"}
            </span>
          </Card>

          {/* 3. Kunyomi Bento (Cara Baca Jepang) */}
          <Card className="p-8 bg-card/20 backdrop-blur-xl border-border rounded-[2.5rem] hover:border-primary/40 transition-all relative overflow-hidden flex flex-col justify-center col-span-1 group">
            <div className="absolute top-4 right-6 opacity-[0.05] group-hover:scale-110 transition-transform text-success">
              <Play size={40} aria-hidden="true" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-success block mb-3 relative z-10">Kunyomi</span>
            <span className="text-3xl md:text-4xl font-japanese font-black text-foreground leading-tight tracking-tight relative z-10">
              {kanji.kunyomi || "—"}
            </span>
          </Card>

          {/* 4. Radicals Bento (Akar Kata) */}
          <Card className="p-8 bg-card/20 backdrop-blur-xl border-border rounded-[2.5rem] hover:border-primary/40 transition-all md:col-span-3 lg:col-span-2 flex flex-col justify-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground block mb-4">Radikal Utama</span>
            <div className="flex flex-wrap gap-3">
              {kanji.radicals && kanji.radicals.length > 0 ? (
                kanji.radicals.map((rad: string, i: number) => (
                  <Badge key={i} variant="secondary" className="px-5 py-2.5 rounded-xl bg-muted/40 border border-border text-2xl font-japanese hover:border-primary/40 transition-all">
                    {rad}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground italic">Tidak ada data radikal.</span>
              )}
            </div>
          </Card>

          {/* 5. Mnemonic Bento (Jembatan Keledai) */}
          {kanji.mnemonics && (
            <Card className="p-8 md:p-10 bg-card/20 backdrop-blur-xl border-border rounded-[2.5rem] hover:border-primary/40 transition-all md:col-span-full lg:col-span-2 relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <Sparkles size={20} className="text-warning" aria-hidden="true" />
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Memory Mnemonic</h2>
              </div>
              <div className="prose dark:prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-p:text-warning italic font-medium relative z-10">
                <PortableText value={kanji.mnemonics} />
              </div>
            </Card>
          )}

          {/* 6. Related Context Bento (Kosakata Terkait) */}
          <Card className="p-8 md:p-10 bg-card/20 backdrop-blur-xl border-border rounded-[2.5rem] hover:border-primary/40 transition-all md:col-span-full lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <LinkIcon size={20} className="text-primary" aria-hidden="true" />
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Kosakata Terkait</h2>
            </div>
            
            {kanji.relatedVocab && kanji.relatedVocab.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {kanji.relatedVocab.map((vocab: { _id: string; word: string; furigana: string; meaning: string; romaji?: string; slug?: string }) => (
                  <Link key={vocab._id} href={`/library/vocab/${vocab.slug}`}>
                    <Card className="p-6 bg-card/20 border-border rounded-2xl flex items-center gap-4 hover:bg-card/40 hover:border-primary/30 transition-all group cursor-pointer shadow-none">
                      <div className="flex-1 min-w-0">
                        <div className="text-xl font-bold text-foreground font-japanese group-hover:text-primary transition-colors">
                          <SmartJapanese word={vocab.word} furigana={vocab.furigana} />
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-1">{vocab.meaning}</p>
                      </div>
                      <ChevronLeft size={16} className="rotate-180 text-muted-foreground/30 group-hover:text-primary transition-colors" aria-hidden="true" />
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">Belum ada kosakata yang terhubung ke karakter ini.</p>
            )}
          </Card>
        </div>

        {/* Footer Actions */}
        <footer className="mt-20 pt-16 border-t border-border flex flex-col md:flex-row items-center justify-between gap-8">
          <Link href="/library/kanji" className="w-full md:w-auto">
            <Button variant="ghost" className="w-full px-10 py-8 h-auto text-[11px] md:text-xs font-black uppercase tracking-[0.2em] rounded-2xl bg-muted/30 border border-border hover:bg-muted/50 hover:border-primary/30 transition-all gap-4 group shadow-none">
              <ChevronLeft size={20} className="group-hover:-translate-x-2 transition-transform" aria-hidden="true" /> Kembali ke Daftar Kanji
            </Button>
          </Link>
        </footer>
      </div>
    </main>
  );
}
