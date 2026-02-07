import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { notFound } from "next/navigation";

// Fungsi mengambil data dari tabel 'lessons' berdasarkan slug
async function getLesson(slug) {
  const { data, error } = await supabase
    .from("lessons") // Pastikan sama dengan halaman daftar (pakai 's')
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data;
}

// Menggunakan 'any' untuk params agar tidak bentrok dengan versi Next.js
export default async function LessonDetailPage({ params }) {
  // Wajib diawait untuk Next.js 15+
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const lesson = await getLesson(slug);

  if (!lesson) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar Minimalis */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 p-6">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Link
            href="/materi"
            className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-blue-600 transition"
          >
            ← Curriculum
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase tracking-widest">
              {lesson.level || "N5"}
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Header Materi */}
        <header className="mb-12">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-6 italic">
            {lesson.title}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="text-sm">
              <p className="font-black text-slate-900">NihongoPath Admin</p>
              <p className="text-slate-400 text-xs uppercase tracking-tighter">
                Materi Pelajaran
              </p>
            </div>
          </div>
        </header>

        {/* Area Content Markdown */}

        {/* Menggunakan Tailwind Typography 'prose' */}
        <article
          className="prose prose-slate max-w-none 
  text-slate-900 
  prose-headings:text-slate-900 
  prose-p:text-slate-700 
  prose-strong:text-blue-600
  prose-headings:font-black 
  prose-headings:italic"
        >
          <ReactMarkdown>{lesson.content}</ReactMarkdown>
        </article>

        {/* Footer Navigation */}
        <footer className="mt-24 pt-12 border-t border-slate-100">
          <div className="bg-slate-900 p-10 rounded-[3rem] text-center text-white relative overflow-hidden">
            {/* Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full -mr-16 -mt-16"></div>

            <p className="text-blue-400 font-black text-xs uppercase tracking-[0.3em] mb-4">
              Step Next
            </p>
            <h3 className="text-2xl font-black mb-8">
              Siap menguji pemahamanmu?
            </h3>
            <button className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all duration-300 shadow-xl shadow-blue-900/20">
              Mulai Kuis Bab Ini
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
