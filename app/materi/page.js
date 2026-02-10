import { client } from "@/sanity/lib/client";
import Link from "next/link";

// PAKSA NEXT.JS UNTUK MENGAMBIL DATA TERBARU (NO CACHE)
export const revalidate = 0;

export default async function MateriPage() {
  // Query mengambil data materi dari Sanity
  // Tambahkan filter status agar hanya yang sudah di-publish muncul (opsional)
  const query = `*[_type == "materi"] | order(orderIndex asc) {
    title,
    "slug": slug.current,
    category,
    orderIndex
  }`;

  // Gunakan cache: 'no-store' untuk keamanan ekstra di level fetch
  const lessons = await client.fetch(query, {}, { cache: "no-store" });

  return (
    <div className="min-h-screen bg-[#1f242d] py-20 px-8 font-bodyFont">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <header className="mb-20">
          <p className="text-[#0ef] font-bold text-[10px] uppercase tracking-[0.5em] mb-4 font-titleFont">
            Learning Path
          </p>
          <h1 className="text-6xl md:text-7xl font-black italic text-white tracking-tighter uppercase font-titleFont leading-none">
            Materi Pembelajaran
          </h1>
          <div className="h-1 w-20 bg-[#0ef] mt-6 shadow-[0_0_15px_#0ef]"></div>
        </header>

        {/* GRID MATERI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {lessons?.map((lesson) => (
            <Link
              key={lesson.slug}
              href={`/materi/${lesson.slug}`}
              className="group"
            >
              <div className="bg-gradient-to-br from-[#1e2024] to-[#23272b] shadow-shadowOne p-10 h-full border border-white/5 rounded-[2rem] transition-all duration-500 group-hover:border-[#0ef]/40 group-hover:-translate-y-3 relative overflow-hidden">
                <span className="absolute -right-4 -bottom-4 text-white/[0.03] text-7xl font-black italic group-hover:text-[#0ef]/5 transition-colors">
                  {(lesson.orderIndex || 0).toString().padStart(2, "0")}
                </span>

                <span className="text-[#0ef] font-bold text-[9px] uppercase tracking-[0.2em] block mb-6 font-titleFont">
                  {lesson.category || "N5 Level"}
                </span>

                <h3 className="text-2xl font-black text-white mb-6 italic group-hover:text-[#0ef] transition-colors uppercase font-titleFont leading-tight">
                  {lesson.title}
                </h3>

                <div className="flex items-center gap-3 text-[#c4cfde] font-bold text-[10px] uppercase tracking-widest group-hover:text-white transition-colors">
                  <span className="h-[1px] w-5 bg-[#c4cfde] group-hover:w-8 group-hover:bg-[#0ef] transition-all"></span>
                  Mulai Belajar
                </div>
              </div>
            </Link>
          ))}
        </div>

        {(!lessons || lessons.length === 0) && (
          <div className="text-center py-20 bg-[#1e2024] rounded-[2rem] shadow-shadowOne border border-white/5">
            <p className="text-[#c4cfde]/40 italic font-medium tracking-widest uppercase text-xs">
              Materi sedang disinkronisasi atau belum dipublikasikan...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
