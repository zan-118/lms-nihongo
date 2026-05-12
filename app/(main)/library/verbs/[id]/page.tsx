/**
 * @file page.tsx
 * @description Halaman detail kata kerja (Verb Detail).
 * Menampilkan informasi mendalam tentang kata kerja, termasuk contoh, mnemonic, dan konjugasi lengkap.
 * @module VerbDetailPage
 */

import { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity.fetch";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ChevronLeft, 
  Sparkles, 
  Layers,
  ArrowRightLeft,
  Link as LinkIcon,
  Home,
  Library,
  Activity
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TTSReader from "@/components/features/tools/tts/TTSReader";
import { SmartJapanese } from "@/components/ui/SmartJapanese";
import { verbOnlyDetailQuery } from "@/lib/queries";
import * as wanakana from "wanakana";

interface VerbRelatedKanji {
  _id: string;
  character: string;
  meaning: string;
  onyomi: string;
  kunyomi: string;
  slug: string;
}

interface VerbExample {
  japanese: string;
  indonesian: string;
  furigana?: string;
  romaji?: string;
}

interface VerbDetail {
  _id: string;
  slug: string;
  group: number;
  jisho: string;
  meaning: string;
  masu: string;
  furigana?: string;
  te?: string;
  nai?: string;
  ta?: string;
  teiru?: string;
  tai?: string;
  nakereba?: string;
  kanou?: string;
  shieki?: string;
  ukemi?: string;
  katei?: string;
  ikou?: string;
  teshimau?: string;
  meirei?: string;
  transitivity?: string;
  mnemonic?: string;
  audioUrl?: string;
  relatedKanji?: VerbRelatedKanji[];
  examples?: VerbExample[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  
  const verb = await sanityFetch<VerbDetail | null>({
    query: verbOnlyDetailQuery,
    params: { id: decodedId },
    tags: ["verb_dictionary"],
  });

  if (!verb) {
    return {
      title: "Kata Kerja Tidak Ditemukan | NihongoRoute",
    };
  }

  return {
    title: `${verb.jisho} (${verb.meaning}) - Kamus Kata Kerja | NihongoRoute`,
    description: `Pelajari konjugasi, arti, dan contoh kalimat untuk kata kerja ${verb.jisho}.`,
  };
}

export default async function VerbDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  
  const verb = await sanityFetch<VerbDetail | null>({
    query: verbOnlyDetailQuery,
    params: { id: decodedId },
    tags: ["verb_dictionary"],
  });

  if (!verb) return notFound();

  const getBadgeColor = (group: number) => {
    switch (group) {
      case 1:
        return "text-destructive bg-destructive/10 border-destructive/20";
      case 2:
        return "text-success bg-success/10 border-success/20";
      case 3:
        return "text-primary bg-primary/10 border-primary/20";
      default:
        return "text-muted-foreground bg-muted border-border";
    }
  };



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
          <Link href="/library/verbs" className="hover:text-primary transition-all flex items-center gap-1.5 md:gap-2 group">
            <Activity size={14} aria-hidden="true" className="group-hover:scale-110 transition-transform" /> 
            <span className="hidden sm:inline">Kata Kerja</span>
          </Link>
          <span className="opacity-20">/</span>
          <span className="text-primary flex items-center gap-1.5 md:gap-2 drop-shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]">
            {verb.jisho}
          </span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(0,auto)] animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
          {/* 1. Hero Bento (Informasi Utama) */}
          <Card className="p-8 md:p-12 bg-card/40 backdrop-blur-xl border-border rounded-[2rem] hover:border-primary/40 transition-all group overflow-hidden relative md:col-span-2 lg:col-span-2 md:row-span-2 flex flex-col items-center justify-center text-center shadow-2xl glass">
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <TTSReader text={verb.jisho} minimal={false} />
            </div>
            <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
              <Badge variant="outline" className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl ${getBadgeColor(verb.group)}`}>
                Golongan {verb.group}
              </Badge>
              {verb.transitivity && (
                <Badge variant="outline" className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl ${
                  verb.transitivity === "transitive" 
                    ? "text-warning bg-warning/10 border-warning/20" 
                    : "text-primary bg-primary/10 border-primary/20"
                }`}>
                  {verb.transitivity === "transitive" ? "Transitif" : "Intransitif"}
                </Badge>
              )}
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground font-japanese leading-none tracking-tighter mb-4 drop-shadow-sm mt-12">
              <SmartJapanese word={verb.jisho} furigana={verb.furigana} />
            </h1>
            <p className="text-sm md:text-base font-black text-muted-foreground uppercase tracking-[0.4em] opacity-50 mb-6">
              {wanakana.toRomaji(verb.furigana || verb.jisho)}
            </p>
            <div className="h-1.5 w-16 bg-primary rounded-full mb-6 shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] mx-auto" />
            <p className="text-2xl md:text-3xl font-black text-foreground leading-tight">
              {verb.meaning}
            </p>
          </Card>

          {/* 2. Core Conjugation Bento (The "Big Three") */}
          <Card className="p-6 bg-card/20 backdrop-blur-xl border-border rounded-[2rem] hover:border-primary/40 transition-all group overflow-hidden relative col-span-1 glass flex flex-col justify-center gap-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowRightLeft size={14} aria-hidden="true" className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Bentuk Dasar</span>
            </div>
            <div className="space-y-3">
              {[
                { label: "Sopan (Masu)", value: verb.masu },
                { label: "Sambung (Te)", value: verb.te },
                { label: "Negatif (Nai)", value: verb.nai },
              ].map((conj, i) => conj.value && (
                <div key={i} className="flex flex-col p-3 bg-[rgba(var(--muted-rgb),0.2)] border border-border rounded-xl hover:border-primary/30 transition-colors">
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">{conj.label}</span>
                  <span className="text-lg font-bold text-foreground font-japanese">{conj.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* 4. Complex Forms Bento */}
          <Card className="p-6 bg-card/20 backdrop-blur-xl border-border rounded-[2rem] hover:border-primary/40 transition-all group overflow-hidden relative col-span-1 md:col-span-1 glass flex flex-col justify-center gap-4">
            <div className="flex items-center gap-2 mb-2">
              <Layers size={14} aria-hidden="true" className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Bentuk Kompleks</span>
            </div>
            <div className="space-y-3">
              {[
                { label: "Harus (Nakereba)", value: verb.nakereba },
                { label: "Terlanjur (Teshimau)", value: verb.teshimau },
                { label: "Ingin (Tai)", value: verb.tai },
              ].map((conj, i) => conj.value && (
                <div key={i} className="flex flex-col p-3 bg-[rgba(var(--muted-rgb),0.2)] border border-border rounded-xl hover:border-primary/30 transition-colors">
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">{conj.label}</span>
                  <span className="text-lg font-bold text-foreground font-japanese">{conj.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* 3. Advanced Morphology Bento */}
          <Card className="p-6 md:p-8 bg-card/20 backdrop-blur-xl border-border rounded-[2rem] hover:border-primary/40 transition-all group overflow-hidden relative md:col-span-full lg:col-span-2 glass">
            <div className="flex items-center gap-3 mb-6">
              <ArrowRightLeft size={18} aria-hidden="true" className="text-primary" />
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Morfologi Lanjutan</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Bisa (Kanou)", value: verb.kanou },
                { label: "Menyuruh (Shieki)", value: verb.shieki },
                { label: "Pasif (Ukemi)", value: verb.ukemi },
                { label: "Ajakan (Ikou)", value: verb.ikou },
                { label: "Perintah (Meirei)", value: verb.meirei },
                { label: "Lampau (Ta)", value: verb.ta },
                { label: "Sedang (Teiru)", value: verb.teiru },
                { label: "Syarat (Ba/Tara)", value: verb.katei },
              ].map((conj, i) => conj.value && (
                <div key={i} className="p-4 bg-[rgba(var(--muted-rgb),0.2)] border border-border rounded-xl flex flex-col justify-center hover:border-primary/30 transition-colors">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1">{conj.label}</span>
                  <span className="text-base md:text-lg font-bold text-foreground font-japanese">{conj.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* 5. Examples & Notes Bento */}
          <Card className="p-6 md:p-8 bg-card/20 backdrop-blur-xl border-border rounded-[2rem] hover:border-primary/40 transition-all group overflow-hidden relative md:col-span-full lg:col-span-2 glass flex flex-col gap-6">
            {/* Mnemonic (If any) */}
            {verb.mnemonic && (
              <div className="p-5 bg-warning/5 border border-warning/20 rounded-2xl relative overflow-hidden group/mnemonic">
                <div className="absolute -top-4 -right-4 p-4 opacity-[0.05] group-hover/mnemonic:scale-110 transition-transform duration-700 text-warning">
                  <Sparkles size={60} />
                </div>
                <div className="flex items-center gap-2 mb-3 relative z-10">
                  <Sparkles size={14} aria-hidden="true" className="text-warning" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-warning">Mnemonic Memory</span>
                </div>
                <p className="text-sm font-medium text-warning leading-relaxed italic relative z-10">
                  &quot;{verb.mnemonic}&quot;
                </p>
              </div>
            )}

            {/* Examples */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Layers size={18} aria-hidden="true" className="text-primary" />
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Contoh Penggunaan</h2>
              </div>
              <div className="space-y-4">
                {verb.examples?.map((ex: VerbExample, i: number) => (
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
                {(!verb.examples || verb.examples.length === 0) && (
                  <p className="text-xs text-muted-foreground italic">Belum ada contoh kalimat untuk kata ini.</p>
                )}
              </div>
            </div>

            {/* Related Kanji Section */}
            {verb.relatedKanji && verb.relatedKanji.length > 0 && (
              <div className="pt-4 border-t border-border/50 mt-auto">
                <div className="flex items-center gap-3 mb-4">
                  <LinkIcon size={16} aria-hidden="true" className="text-primary" />
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">Karakter Kanji Terkait</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {verb.relatedKanji?.map((kanji: VerbRelatedKanji) => (
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
          </Card>
        </div>

        {/* Action Footer */}
        <footer className="mt-20 pt-16 border-t border-border flex flex-col md:flex-row items-center justify-between gap-8">
          <Link href="/library/verbs" className="w-full md:w-auto">
            <Button variant="ghost" className="w-full px-10 py-8 h-auto text-[11px] md:text-xs font-black uppercase tracking-[0.2em] rounded-2xl bg-[rgba(var(--muted-rgb),0.3)] border border-border hover:bg-[rgba(var(--muted-rgb),0.5)] hover:border-primary/30 transition-all gap-4 group">
              <ChevronLeft size={20} aria-hidden="true" className="group-hover:-translate-x-2 transition-transform" /> Kembali ke Daftar Kata Kerja
            </Button>
          </Link>
        </footer>
      </div>
    </main>
  );
}
