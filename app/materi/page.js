"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default function MateriList() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      const { data } = await supabase
        .from("lessons")
        .select("*")
        .order("order_index", { ascending: true });
      if (data) setLessons(data);
      setLoading(false);
    };
    fetchLessons();
  }, []);

  // Fungsi untuk memotong teks agar tidak kepanjangan di card
  const getSnippet = (text) => {
    if (!text) return "Belum ada deskripsi materi.";
    return text.length > 80 ? text.substring(0, 80) + "..." : text;
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <p className="font-black italic text-slate-300 animate-pulse uppercase tracking-[0.3em]">
          Loading Curriculum...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <nav className="p-8 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-blue-600 transition"
          >
            ← Dashboard
          </Link>
          <h1 className="font-black text-black italic text-xl tracking-tighter">
            Learning Path.
          </h1>
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
            {lessons.length}
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto p-6 space-y-6 mt-4">
        {lessons.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
              Belum ada bab yang tersedia
            </p>
          </div>
        ) : (
          lessons.map((lesson, idx) => (
            <Link
              href={`/materi/${lesson.slug}`}
              key={lesson.id}
              className="block group"
            >
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group-hover:shadow-2xl group-hover:shadow-blue-100 group-hover:border-blue-200 transition-all duration-300 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                  <span className="text-8xl font-black italic">{idx + 1}</span>
                </div>

                <div className="flex items-start gap-6 relative z-10">
                  {/* Number Badge */}
                  <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-xl group-hover:bg-blue-600 group-hover:rotate-6 transition-all shadow-lg">
                    {idx + 1}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[9px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase tracking-widest">
                        {lesson.level}
                      </span>
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">
                        Core Lesson
                      </span>
                    </div>

                    <h3 className="font-black text-xl text-slate-800 leading-none mb-3 group-hover:text-blue-600 transition-colors tracking-tight">
                      {lesson.title}
                    </h3>

                    {/* INI BAGIAN YANG MENAMPILKAN CUPLIKAN MATERI */}
                    <p className="text-slate-900 text-sm font-medium leading-relaxed mb-6">
                      {getSnippet(lesson.content)}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        5-10 Latihan Soal
                      </span>
                      <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                        Pelajari →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </main>
    </div>
  );
}
