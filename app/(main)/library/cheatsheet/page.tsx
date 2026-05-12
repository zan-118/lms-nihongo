/**
 * @file page.tsx
 * @description Halaman rute referensi kilat (Cheatsheets). 
 * Menangani penarikan data referensi statis dari Sanity CMS.
 * @module CheatsheetPage
 */

// ======================
// IMPORTS
// ======================
import { sanityFetch } from "@/lib/sanity.fetch";
import CheatsheetClient from "./CheatsheetClient";

// ======================
// CONFIG / CONSTANTS
// ======================

// ======================
// MAIN EXECUTION
// ======================

/**
 * Komponen CheatsheetPage: Menarik data cheatsheet dan merender CheatsheetClient.
 * 
 * @returns {JSX.Element} Halaman referensi kilat.
 */
export default async function CheatsheetPage() {
  // ======================
  // DATABASE OPERATIONS
  // ======================
  const sheets = await sanityFetch<any[]>({
    query: `*[_type == "cheatsheet"] | order(category asc, title asc) {
      _id, "slug": slug.current, title, category, items,
      linkedVocab[]->{ "jp": word, "label": meaning, romaji }
    }`,
    tags: ["cheatsheet"],
  });

  // ======================
  // RENDER
  // ======================
  return (
    <main className="w-full bg-background px-6 md:px-12 relative overflow-hidden flex flex-col justify-start min-h-screen">
      {/* Background Neural Overlays */}
      <div className="neural-grid" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--destructive-rgb),0.05)_0%,transparent_70%)] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col pt-10">
        <CheatsheetClient initialSheets={sheets} />
      </div>
    </main>
  );
}
