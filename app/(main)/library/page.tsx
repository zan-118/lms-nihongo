"use client";

import { motion } from "framer-motion";
import { RefreshCw, BookOpen, BarChart2, Library, Database, Activity, Award, Headphones, Type } from "lucide-react";
import { Card } from "@/components/ui/card";

// Domain Components
import { LibraryCategoryCard } from "@/components/features/library/LibraryCategoryCard";
import { LibraryServerStatus } from "@/components/features/library/LibraryServerStatus";

export default function LibraryPage() {
  const categories = [
    {
      href: "/library/verbs",
      title: "Kamus Kata Kerja",
      desc: "Belajar perubahan kata kerja N5-N4. Dari bentuk Masu sampai Te, semua ada di sini.",
      icon: <RefreshCw size={28} />,
      label: "Kamus Verba",
      delay: 0.2
    },
    {
      href: "/library/grammar",
      title: "Panduan Tata Bahasa",
      desc: "Bahas pola kalimat jadi lebih mudah dengan contoh audio dan penjelasan yang simpel.",
      icon: <BookOpen size={28} />,
      label: "Pola Kalimat",
      delay: 0.3
    },
    {
      href: "/library/vocab",
      title: "Daftar Kosakata",
      desc: "Perkaya perbendaharaan kata N5-N2 Anda dengan ribuan entri yang dikurasi untuk persiapan JLPT.",
      icon: <Database size={28} />,
      label: "Perbendaharaan Kata",
      delay: 0.4
    },
    {
      href: "/library/cheatsheet",
      title: "Catatan Cepat",
      desc: "Referensi cepat untuk angka, partikel, dan materi dasar lainnya sebagai penunjang belajar harian.",
      icon: <BarChart2 size={28} />,
      label: "Panduan Cepat",
      delay: 0.5
    },
    {
      href: "/library/reading",
      title: "Graded Reading",
      desc: "Asah kemahiran membaca melalui teks interaktif yang dikategorikan sesuai standar level JLPT.",
      icon: <BookOpen size={28} />,
      label: "Bacaan Berjenjang",
      delay: 0.6
    },
    {
      href: "/exams",
      title: "Ujian & Sertifikasi",
      desc: "Uji kesiapan Anda menghadapi ujian JLPT sesungguhnya dengan simulasi skor yang akurat.",
      icon: <Award size={28} />,
      label: "Latihan Ujian",
      delay: 0.7
    },
    {
      href: "/library/kanji",
      title: "Pustaka Kanji",
      desc: "Dalami struktur ribuan kanji melalui visualisasi urutan goresan (stroke order) yang interaktif.",
      icon: <Type size={28} />,
      label: "Koleksi Kanji",
      delay: 0.8
    },
    {
      href: "/library/listening",
      title: "Latihan Menyimak",
      desc: "Tingkatkan kepekaan pendengaran melalui modul audio interaktif dan dukungan transkrip.",
      icon: <Headphones size={28} />,
      label: "Listening Lab",
      delay: 0.9
    }
  ];

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 relative overflow-hidden pb-24 bg-background text-foreground transition-colors duration-300 min-h-screen pt-8 md:pt-12">
      {/* Background Neural Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(var(--primary-rgb),0.05)_0%,transparent_50%)] pointer-events-none z-0" />
      <div className="neural-grid" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HEADER SECTION */}
        <header className="mb-10 md:mb-24">
          <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-10">
            <Card className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-2xl bg-primary/10 border-primary/20 flex items-center justify-center neo-inset shadow-none">
              <Library size={28} className="text-primary md:w-8 md:h-8" />
            </Card>
            <div className="flex flex-col">
              <span className="text-xs md:text-xs font-bold uppercase tracking-widest text-primary/50">Pusat Sumber Belajar</span>
              <div className="flex items-center gap-2 mt-1">
                 <Activity size={12} className="text-primary animate-pulse" />
                 <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none">Status: Siap Belajar</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 lg:gap-12">
            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl sm:text-4xl md:text-7xl lg:text-7xl font-black uppercase tracking-tight text-foreground mb-4 md:mb-10 drop-shadow-2xl leading-none md:leading-[0.85]"
              >
                Pustaka<br />
                <span className="text-primary drop-shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)]">Materi</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground text-xs md:text-base lg:text-xl max-w-2xl leading-relaxed font-medium"
              >
                Cari semua materi belajar kamu di sini. Mulai dari kata kerja sampai pola kalimat buat persiapan JLPT, semuanya lengkap.
              </motion.p>
            </div>
            
            <div className="shrink-0 hidden xl:block w-full lg:w-auto mt-8 lg:mt-0">
               <LibraryServerStatus />
            </div>
          </div>
        </header>

        {/* NAVIGATION GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 items-stretch">
          {categories.map((cat, idx) => (
            <LibraryCategoryCard 
              key={cat.href}
              {...cat}
              index={idx}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
