"use client";
import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QuizComponent from "@/components/QuizComponent";

export default function MateriDetail({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return router.replace("/login");

      try {
        const query = `{
          "currentLesson": *[_type == "materi" && slug.current == $slug][0] {
            ...,
            "quizData": *[_type == "question" && package->slug.current == ^.quizReference] {
               questionText, options, correctAnswer,
               "imageUrl": image.asset->url,
               "audioUrl": audio.asset->url
            }
          },
          "sidebarMenu": *[_type == "materi"] | order(orderIndex asc) { title, slug, orderIndex }
        }`;
        const result = await client.fetch(query, { slug });
        setData(result);
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchData();
  }, [slug, router]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#1f242d] flex items-center justify-center font-bodyFont">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0ef] border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-[0_0_15px_#0ef]"></div>
          <p className="text-[#0ef] font-black tracking-[0.5em] uppercase text-[10px]">
            Decoding Content...
          </p>
        </div>
      </div>
    );

  if (!data?.currentLesson)
    return (
      <div className="min-h-screen bg-[#1f242d] text-[#0ef] flex items-center justify-center font-titleFont font-black text-2xl tracking-tighter">
        404 // CONTENT_NOT_FOUND
      </div>
    );

  const currentIndex = data.sidebarMenu.findIndex(
    (item) => item.slug.current === slug,
  );
  const prevLesson =
    currentIndex > 0 ? data.sidebarMenu[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < data.sidebarMenu.length - 1
      ? data.sidebarMenu[currentIndex + 1]
      : null;

  return (
    // PT-20 ditambahkan agar konten tidak tertutup Navbar setinggi 80px
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#1f242d] font-bodyFont pt-20">
      {/* AREA KONTEN UTAMA */}
      <div className="flex-1 p-6 lg:p-16 overflow-y-auto selection:bg-[#0ef] selection:text-[#1f242d]">
        <div className="max-w-4xl mx-auto">
          {/* 1. BREADCRUMBS INTERNAL (Opsional jika sudah ada di Navbar) */}
          <nav className="mb-10 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-[#c4cfde]/20">
            <Link href="/dashboard" className="hover:text-[#0ef]">
              Dashboard
            </Link>
            <span>/</span>
            <Link href="/materi" className="hover:text-[#0ef]">
              Curriculum
            </Link>
            <span>/</span>
            <span className="text-[#0ef]">{data.currentLesson.title}</span>
          </nav>

          <header className="mb-16">
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-[#1e2024] shadow-shadowOne rounded border border-[#0ef]/20 text-[#0ef] text-[10px] font-black tracking-widest uppercase italic">
                Vol.{" "}
                {data.currentLesson.orderIndex?.toString().padStart(2, "0") ||
                  "00"}
              </span>
              <div className="h-[1px] flex-1 bg-white/5"></div>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.9] font-titleFont">
              {data.currentLesson.title}
            </h1>
          </header>

          {/* ARTICLE CONTENT */}
          <article
            className="prose prose-invert prose-cyan max-w-none mb-24 
            prose-headings:font-titleFont prose-headings:italic prose-headings:tracking-tighter
            prose-p:text-[#c4cfde] prose-p:leading-relaxed prose-p:text-lg
            prose-strong:text-[#0ef] prose-strong:font-black
            prose-code:text-[#0ef] prose-code:bg-[#1e2024] prose-code:px-2 prose-code:rounded"
          >
            {data.currentLesson.content ? (
              <PortableText value={data.currentLesson.content} />
            ) : (
              <p className="text-slate-600 italic">
                Content sequence encrypted or unavailable.
              </p>
            )}
          </article>

          {/* 2. QUIZ SECTION */}
          {data.currentLesson.quizData?.length > 0 && (
            <div className="mt-24 mb-24 p-8 lg:p-12 bg-[#1e2024] shadow-shadowOne rounded-[3rem] border border-[#0ef]/10">
              <div className="mb-10 text-center md:text-left">
                <h2 className="text-2xl font-black text-white italic uppercase font-titleFont tracking-tighter">
                  Check Point.
                </h2>
                <p className="text-[#0ef] text-[9px] font-bold uppercase tracking-widest">
                  Verify your understanding
                </p>
              </div>
              <QuizComponent questions={data.currentLesson.quizData} />
            </div>
          )}

          {/* 3. NAVIGATION PREV/NEXT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20 border-t border-white/5 pt-16">
            {prevLesson ? (
              <Link
                href={`/materi/${prevLesson.slug.current}`}
                className="group"
              >
                <div className="bg-[#1e2024] shadow-shadowOne p-8 rounded-[2rem] border border-transparent hover:border-[#0ef]/30 transition-all text-left group-hover:-translate-x-2">
                  <span className="text-[#c4cfde]/30 font-black text-[9px] uppercase tracking-[0.3em] block mb-3">
                    ← Previous Module
                  </span>
                  <h4 className="text-white font-black text-sm uppercase group-hover:text-[#0ef] transition-colors font-titleFont tracking-tight">
                    {prevLesson.title}
                  </h4>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextLesson ? (
              <Link
                href={`/materi/${nextLesson.slug.current}`}
                className="group text-right"
              >
                <div className="bg-[#1e2024] shadow-shadowOne p-8 rounded-[2rem] border border-transparent hover:border-[#0ef]/30 transition-all group-hover:translate-x-2">
                  <span className="text-[#0ef] font-black text-[9px] uppercase tracking-[0.3em] block mb-3">
                    Next Module →
                  </span>
                  <h4 className="text-white font-black text-sm uppercase group-hover:text-[#0ef] transition-colors font-titleFont tracking-tight">
                    {nextLesson.title}
                  </h4>
                </div>
              </Link>
            ) : (
              <Link href="/materi" className="group text-right">
                <div className="bg-[#1e2024] shadow-shadowOne p-8 rounded-[2rem] border border-[#0ef]/20 transition-all group-hover:scale-105">
                  <span className="text-[#0ef] font-black text-[9px] uppercase tracking-[0.3em] block mb-3 underline decoration-double">
                    Course Completed
                  </span>
                  <h4 className="text-white font-black text-sm uppercase group-hover:text-[#0ef] transition-colors font-titleFont tracking-tight">
                    Return to Curriculum
                  </h4>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* SIDEBAR NAVIGATION */}
      {/* top-20 ditambahkan agar posisi sticky-nya tepat di bawah Navbar */}
      <aside className="w-full lg:w-[400px] bg-[#1e2024] border-l border-white/5 h-[calc(100vh-80px)] sticky top-20 hidden lg:block overflow-y-auto custom-scrollbar">
        <div className="p-10 border-b border-white/5 bg-[#1f242d]">
          <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] font-titleFont">
            System <span className="text-[#0ef]">Index</span>
          </h3>
        </div>
        <nav>
          {data.sidebarMenu?.map((item) => (
            <Link
              key={item.slug.current}
              href={`/materi/${item.slug.current}`}
              className={`flex items-center gap-6 p-8 border-b border-white/5 transition-all relative group ${
                item.slug.current === slug
                  ? "bg-[#0ef]/5"
                  : "hover:bg-white/[0.02]"
              }`}
            >
              {item.slug.current === slug && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0ef] shadow-[0_0_15px_#0ef]"></div>
              )}
              <span
                className={`text-3xl font-black italic font-titleFont leading-none ${
                  item.slug.current === slug
                    ? "text-[#0ef]"
                    : "text-white/5 group-hover:text-white/10"
                }`}
              >
                {(item.orderIndex || 0).toString().padStart(2, "0")}
              </span>
              <h4
                className={`text-[11px] font-black uppercase tracking-[0.1em] leading-tight ${
                  item.slug.current === slug
                    ? "text-white"
                    : "text-[#c4cfde]/40 group-hover:text-[#c4cfde]"
                }`}
              >
                {item.title}
              </h4>
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  );
}
