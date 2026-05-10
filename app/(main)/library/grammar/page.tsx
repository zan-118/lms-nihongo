/**
 * @file app/(main)/library/grammar/page.tsx
 * @description Halaman indeks katalog panduan tata bahasa (Bunpou). Menggunakan teknik "Client-Side Fetching" untuk memfilter dan memuat daftar bab dari CMS secara asinkron berdasarkan level yang dipilih.
 * @module Client Component
 */

import { sanityFetch } from "@/lib/sanity.fetch";
import GrammarClient from "./GrammarClient";

export const metadata = {
  title: "Tata Bahasa Jepang | NihongoRoute",
  description: "Katalog lengkap tata bahasa Jepang (Bunpou) untuk level N5 hingga N1. Penjelasan mendalam dengan contoh kalimat dan audio.",
};

// Aktifkan ISR setiap 1 jam

export default async function GrammarArticlesPage() {
  // Pre-fetch artikel di sisi server
  const grammarData: any[] = await sanityFetch({
    query: `*[_type == "grammar_article"] | order(level.code asc, title asc) {
      _id,
      title,
      "slug": slug.current,
      description,
      "level_code": level->code
    }`,
    tags: ["grammar_article"],
  });

  return (
    <main className="w-full relative overflow-hidden flex flex-1 flex-col pb-24 px-4 md:px-8 lg:px-12 bg-background text-foreground transition-colors duration-300">
      {/* Background Neural Overlays */}
      <div className="neural-grid" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,238,255,0.05)_0%,transparent_70%)] pointer-events-none z-0" />

      <GrammarClient initialArticles={grammarData} />
    </main>
  );
}
