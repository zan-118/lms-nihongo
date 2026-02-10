"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { client } from "@/sanity/lib/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    completed: 0,
    total: 0,
    lastLessonTitle: null,
    resumeSlug: null,
  });
  const [dailyKanji, setDailyKanji] = useState({
    kanji: "学",
    meaning: "Study / Learn",
    reading: "まなぶ (manabu)",
  });

  // --- 1. DATA FETCHING ---
  useEffect(() => {
    const getDashboardData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return router.replace("/login");
      setUser(user);

      try {
        const [supabaseProgress, sanityContent] = await Promise.all([
          supabase
            .from("user_progress")
            .select("*")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false }),
          client.fetch(
            `{
              "allLessons": *[_type == "materi"] | order(orderIndex asc) { title, "slug": slug.current },
              "allPackages": *[_type == "quizPackage" && (isTryout == true || isTryout == "true")] { 
                "slug": slug.current, 
                packageName, 
                isTryout 
              }
            }`,
          ),
        ]);

        const progress = supabaseProgress.data || [];
        const { allLessons, allPackages } = sanityContent;

        if (allLessons.length > 0) {
          const lastEntry = progress[0];
          setStats({
            completed: progress.filter((p) => p.is_completed).length,
            total: allLessons.length,
            lastLessonTitle: lastEntry
              ? allLessons.find((l) => l.slug === lastEntry.chapter_id)?.title
              : null,
            resumeSlug: lastEntry ? lastEntry.chapter_id : allLessons[0].slug,
          });
        }
        setPackages(allPackages || []);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    getDashboardData();
  }, [router]);

  if (loading || !user)
    return (
      <div className="min-h-screen bg-[#1f242d] flex items-center justify-center font-bodyFont">
        <p className="text-[#0ef] font-black animate-pulse tracking-widest uppercase text-[10px]">
          INITIALIZING_DASHBOARD...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#1f242d] text-[#c4cfde] font-bodyFont pb-32 pt-32 relative overflow-x-hidden selection:bg-[#0ef] selection:text-[#1f242d]">
      {/* BACKGROUND DECORATION - Z-index -1 agar di bawah konten */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#0ef]/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#0ef]/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <main className="max-w-6xl mx-auto px-6 relative z-10">
        {/* BREADCRUMBS - Memberikan navigasi cepat & hierarki */}
        <nav className="mb-10 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-[#c4cfde]/20">
          <Link href="/" className="hover:text-[#0ef] transition-colors">
            Terminal
          </Link>
          <span className="text-white/5">/</span>
          <span className="text-[#0ef]">User_Dashboard</span>
        </nav>

        {/* HEADER SECTION */}
        <header className="mb-12">
          <p className="text-[#0ef] font-bold text-[10px] uppercase tracking-[0.5em] mb-4 font-titleFont">
            SYSTEM_STATUS_STABLE
          </p>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 italic text-white leading-[0.8] font-titleFont">
            Okaerinasai.
          </h1>
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#1e2024] shadow-shadowOne rounded-xl border border-white/5">
            <div className="w-2 h-2 rounded-full bg-[#0ef] shadow-[0_0_10px_#0ef] animate-pulse"></div>
            <p className="text-[10px] font-bold text-[#c4cfde] tracking-widest uppercase">
              {user?.email?.split("@")[0]}{" "}
              <span className="opacity-30 ml-2">// ID_LINKED</span>
            </p>
          </div>
        </header>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
          {/* DAILY KANJI CARD */}
          <div className="lg:col-span-1 bg-[#1e2024] shadow-shadowOne p-10 rounded-[3rem] text-center flex flex-col justify-center min-h-[300px] border border-white/5 group relative overflow-hidden transition-all hover:border-[#0ef]/20">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0ef]/40 to-transparent opacity-0 group-hover:opacity-100 transition-all"></div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-8 text-[#c4cfde]/20 font-titleFont group-hover:text-[#0ef] transition-colors">
              Daily Kanji Focus
            </p>
            <h2 className="text-9xl font-black text-[#0ef] mb-4 drop-shadow-[0_0_20px_rgba(0,255,239,0.3)] font-titleFont select-none">
              {dailyKanji.kanji}
            </h2>
            <div className="space-y-1">
              <p className="text-sm font-bold text-white uppercase tracking-tighter italic">
                {dailyKanji.reading}
              </p>
              <p className="text-[10px] text-[#c4cfde]/40 font-medium uppercase tracking-widest">
                {dailyKanji.meaning}
              </p>
            </div>
          </div>

          {/* STATS PROGRESS CARD */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#1e2024] shadow-shadowOne p-10 rounded-[3rem] flex flex-col justify-center items-center border border-white/5">
              <p className="text-[9px] font-black text-[#c4cfde]/20 uppercase mb-6 tracking-[0.3em] font-titleFont">
                Mastery Progress
              </p>
              <div className="relative">
                <p className="text-8xl font-black text-white italic leading-none font-titleFont">
                  {stats.total > 0
                    ? Math.round((stats.completed / stats.total) * 100)
                    : 0}
                  <span className="text-[#0ef] text-4xl not-italic ml-2">
                    %
                  </span>
                </p>
              </div>
              <p className="text-[10px] mt-8 text-[#c4cfde]/60 font-black uppercase tracking-[0.2em]">
                {stats.completed} <span className="text-[#0ef]">/</span>{" "}
                {stats.total} Modules Clear
              </p>
            </div>

            {/* QUICK RESUME CARD */}
            <div className="bg-[#1e2024] shadow-shadowOne p-10 rounded-[3rem] flex flex-col justify-center gap-8 border border-white/5 relative overflow-hidden">
              <div className="relative z-10">
                <Link
                  href={`/materi/${stats.resumeSlug || ""}`}
                  className="block w-full py-6 text-center text-[11px] font-black tracking-[0.3em] bg-[#1f242d] text-[#0ef] border border-[#0ef]/20 rounded-2xl hover:bg-[#0ef] hover:text-[#1f242d] hover:shadow-[0_0_30px_rgba(0,255,239,0.4)] transition-all duration-500 uppercase"
                >
                  Resume Journey →
                </Link>
                <div className="mt-6 px-2">
                  <p className="text-[8px] font-black text-[#c4cfde]/20 uppercase mb-2 tracking-widest">
                    Last Synced Lesson:
                  </p>
                  <p className="text-xs font-bold text-white truncate italic uppercase tracking-tight">
                    {stats.lastLessonTitle || "Ready to start?"}
                  </p>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 text-white/5 text-8xl font-black italic select-none">
                進
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* CURRICULUM */}
          <div className="bg-[#1e2024] shadow-shadowOne p-12 group rounded-[3rem] border border-white/5 hover:border-[#0ef]/20 transition-all duration-500">
            <h2 className="text-4xl font-black mb-4 italic text-white uppercase tracking-tighter font-titleFont">
              Curriculum
            </h2>
            <p className="text-[#c4cfde]/50 text-sm mb-10 leading-relaxed max-w-xs">
              Database materi tata bahasa dan kosa kata N5 - N1 yang terstruktur
              secara sistematis.
            </p>
            <Link
              href="/materi"
              className="inline-flex items-center gap-4 text-[#0ef] text-[10px] font-black tracking-[0.3em] uppercase group-hover:gap-8 transition-all duration-500"
            >
              Access Database{" "}
              <span className="h-[1px] w-12 bg-[#0ef] shadow-[0_0_8px_#0ef]"></span>
            </Link>
          </div>

          {/* SIMULATION */}
          <div className="bg-[#1e2024] shadow-shadowOne p-12 rounded-[3rem] relative overflow-hidden group border border-white/5 hover:border-[#0ef]/20 transition-all duration-500">
            <div className="relative z-10">
              <h2 className="text-4xl font-black mb-4 italic text-[#0ef] uppercase tracking-tighter font-titleFont">
                Simulation
              </h2>
              <p className="text-[#c4cfde]/50 text-sm mb-10 leading-relaxed max-w-xs">
                Uji kemampuanmu dengan simulasi ujian JLPT standar internasional
                secara gratis.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-10 py-5 bg-[#0ef] text-[#1f242d] font-black rounded-2xl hover:shadow-[0_0_40px_rgba(0,255,239,0.5)] transition-all text-[10px] tracking-[0.3em] uppercase active:scale-95"
              >
                Launch Simulation
              </button>
            </div>
            <div className="absolute -right-6 -bottom-8 text-white/[0.03] text-[12rem] font-black italic select-none group-hover:text-[#0ef]/5 transition-colors duration-700">
              試験
            </div>
          </div>
        </div>
      </main>

      {/* FLOATING SUPPORT ACTION */}
      <div className="fixed bottom-10 left-0 right-0 z-40 flex justify-center px-6">
        <Link
          href="/support"
          className="bg-[#1e2024]/80 backdrop-blur-xl shadow-shadowOne p-5 px-12 rounded-full border border-white/5 flex items-center gap-6 hover:scale-105 transition-all group"
        >
          <span className="text-[#0ef] text-xl group-hover:animate-bounce">
            ❤️
          </span>
          <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] font-titleFont">
            Keep NihongoPath Free
          </p>
        </Link>
      </div>

      <footer className="bg-[#1e2024] border-t border-white/5 pt-20 pb-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {/* Brand Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black italic text-white tracking-tighter">
                NIHONGO<span className="text-[#0ef]">PATH.</span>
              </h2>
              <p className="text-[11px] text-[#c4cfde]/40 uppercase tracking-widest leading-relaxed">
                Platform pembelajaran bahasa Jepang mandiri yang gratis dan
                didukung oleh komunitas.
              </p>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <h4 className="text-[#0ef] text-[10px] font-black uppercase tracking-widest mb-2">
                  Explore
                </h4>
                <Link
                  href="/materi"
                  className="text-xs hover:text-white transition-colors"
                >
                  Curriculum
                </Link>
                <Link
                  href="/tryout"
                  className="text-xs hover:text-white transition-colors"
                >
                  Simulation
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                <h4 className="text-[#0ef] text-[10px] font-black uppercase tracking-widest mb-2">
                  Support
                </h4>
                <Link
                  href="/support"
                  className="text-xs hover:text-white transition-colors"
                >
                  Donate
                </Link>
                <Link
                  href="/community"
                  className="text-xs hover:text-white transition-colors"
                >
                  Discord
                </Link>
              </div>
            </div>

            {/* Status Section */}
            <div className="bg-[#1f242d] p-6 rounded-2xl border border-white/5 shadow-shadowOne">
              <p className="text-[9px] font-black text-[#c4cfde]/20 uppercase tracking-[0.3em] mb-2">
                System Status
              </p>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#0ef] animate-pulse"></div>
                <p className="text-[10px] font-bold text-white uppercase tracking-widest">
                  Operational // 2026
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4">
            <p className="text-[9px] font-bold text-[#c4cfde]/20 uppercase tracking-widest">
              © 2026 NIHONGOPATH. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-8">
              <span className="text-[9px] font-bold text-[#c4cfde]/20 uppercase tracking-[0.2em] hover:text-[#0ef] cursor-pointer transition-colors">
                Privacy
              </span>
              <span className="text-[9px] font-bold text-[#c4cfde]/20 uppercase tracking-[0.2em] hover:text-[#0ef] cursor-pointer transition-colors">
                Terms
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* --- MODAL SIMULASI --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 transition-all">
          <div
            className="absolute inset-0 bg-[#1f242d]/90 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setShowModal(false)}
          />
          <div className="relative w-full max-w-xl bg-[#1e2024] shadow-shadowOne rounded-[3rem] border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-transparent to-white/[0.02]">
              <div>
                <p className="text-[#0ef] font-black text-[9px] uppercase tracking-[0.5em] mb-2">
                  Available Sessions
                </p>
                <h2 className="text-3xl font-black italic text-white font-titleFont tracking-tighter uppercase">
                  Tryout Terminal
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-12 h-12 rounded-2xl bg-[#1f242d] shadow-shadowOne flex items-center justify-center text-[#c4cfde] hover:text-[#0ef] hover:rotate-90 transition-all duration-300 border border-white/5"
              >
                ✕
              </button>
            </div>
            <div className="p-10 space-y-5 max-h-[450px] overflow-y-auto custom-scrollbar">
              {packages.length > 0 ? (
                packages.map((pkg) => (
                  <Link
                    key={pkg.slug}
                    href={`/tryout/${pkg.slug}`}
                    className="flex items-center justify-between p-8 bg-[#1f242d] border border-white/5 hover:border-[#0ef]/40 rounded-3xl group transition-all shadow-shadowOne"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#0ef] shadow-[0_0_8px_#0ef]"></span>
                        <span className="text-[9px] font-black text-[#0ef] uppercase tracking-widest opacity-60">
                          Status: Active
                        </span>
                      </div>
                      <span className="text-2xl font-black text-white group-hover:text-[#0ef] transition-colors font-titleFont italic uppercase tracking-tighter">
                        {pkg.packageName}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black text-[#c4cfde]/20 group-hover:text-[#0ef] transition-all tracking-widest uppercase">
                        Start
                      </span>
                      <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#0ef] transition-all">
                        <span className="text-white group-hover:text-[#1f242d]">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-20 opacity-20 text-[10px] font-black uppercase tracking-[0.5em]">
                  No Terminal Available
                </div>
              )}
            </div>
            <div className="p-8 bg-black/30 text-center border-t border-white/5">
              <p className="text-[9px] font-bold text-[#c4cfde]/40 uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                <span className="text-red-500">⚠️</span> Timer will be initiated
                upon entry
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
