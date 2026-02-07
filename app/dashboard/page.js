"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();

  // State Management
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [packages, setPackages] = useState([]);
  const [stats, setStats] = useState({
    completed: 0,
    total: 0,
    lastLesson: null,
  });
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Daily Kanji States
  const [dailyKanji, setDailyKanji] = useState(null);
  const [kanjiLevel, setKanjiLevel] = useState("grade-1");
  const [loadingKanji, setLoadingKanji] = useState(true);

  // 1. PWA Install Logic
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDeferredPrompt(null);
  };

  // 2. Fetch Kanji Logic
  const fetchDailyKanji = useCallback(async (level) => {
    setLoadingKanji(true);
    try {
      const res = await fetch(`https://kanjiapi.dev/v1/kanji/${level}`);
      const list = await res.json();
      const day = Math.floor(
        (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
      );
      const pick = list[day % list.length];
      const detRes = await fetch(`https://kanjiapi.dev/v1/kanji/${pick}`);
      const det = await detRes.json();
      setDailyKanji({
        kanji: det.kanji,
        read: det.kun_readings[0] || det.on_readings[0],
        mean: det.meanings[0],
        level: level === "grade-1" ? "N5" : level === "grade-2" ? "N4" : "N3",
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingKanji(false);
    }
  }, []);

  // 3. Main Data Fetching
  useEffect(() => {
    const getData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return router.push("/");
      setUser(user);

      const { data: progress } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id);
      const { data: allLessons } = await supabase
        .from("lessons")
        .select("id, title");

      if (progress && allLessons) {
        const completedCount = progress.filter(
          (p) => p.progress_type === "lesson" && p.is_completed
        ).length;
        const lastEntry = [...progress].sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        )[0];
        setStats({
          completed: completedCount,
          total: allLessons.length,
          lastLesson:
            allLessons.find((l) => l.id === lastEntry?.chapter_id) || null,
        });
      }

      const { data: qData } = await supabase
        .from("questions")
        .select("package_id")
        .not("package_id", "is", null);
      if (qData)
        setPackages([...new Set(qData.map((item) => item.package_id))]);
    };

    getData();
    fetchDailyKanji(kanjiLevel);
  }, [kanjiLevel, fetchDailyKanji, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-32">
      {/* NAVBAR */}
      <nav className="bg-white/70 backdrop-blur-md border-b border-slate-100 px-8 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-[10px]">
              NP
            </div>
            <h1 className="text-sm font-black tracking-widest uppercase">
              NihongoPath
            </h1>
          </div>
          <button
            onClick={() =>
              supabase.auth.signOut().then(() => router.push("/login"))
            }
            className="text-[10px] font-black text-slate-400 hover:text-red-500 transition uppercase"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 md:p-12">
        {/* PWA INSTALL BANNER */}
        {deferredPrompt && (
          <div className="mb-8 p-6 bg-blue-600 rounded-[2rem] flex flex-col sm:flex-row justify-between items-center gap-4 text-white shadow-xl shadow-blue-200 animate-in slide-in-from-top-4">
            <div className="text-center sm:text-left">
              <p className="font-black italic text-lg leading-tight">
                Pasang Aplikasi di HP?
              </p>
              <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">
                Akses lebih cepat & lancar
              </p>
            </div>
            <button
              onClick={handleInstallClick}
              className="bg-white text-blue-600 text-[10px] font-black px-8 py-3 rounded-xl uppercase tracking-widest"
            >
              Instal Sekarang
            </button>
          </div>
        )}

        {/* HEADER & KANJI */}
        <div className="flex flex-col lg:flex-row gap-10 mb-12 items-start">
          <section className="flex-1 pt-4">
            <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mb-3">
              Selamat Datang 👋
            </p>
            <h1 className="text-6xl font-black tracking-tighter mb-6 italic leading-[0.9]">
              Dashboard.
            </h1>
            <div className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl w-fit shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-xs font-bold text-slate-500">{user.email}</p>
            </div>
          </section>

          <section className="w-full lg:w-80">
            <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 relative overflow-hidden group">
              <div className="flex justify-between items-center mb-6 relative z-10">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                  Daily Kanji
                </p>
                <div className="flex bg-slate-50 p-1 rounded-xl">
                  {["grade-1", "grade-2", "grade-3"].map((lvl, i) => (
                    <button
                      key={lvl}
                      onClick={() => setKanjiLevel(lvl)}
                      className={`text-[8px] font-black px-3 py-1 rounded-lg transition-all ${
                        kanjiLevel === lvl
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      N{5 - i}
                    </button>
                  ))}
                </div>
              </div>
              {loadingKanji ? (
                <div className="h-32 flex items-center justify-center animate-pulse text-slate-200 text-4xl font-black">
                  ...
                </div>
              ) : (
                <div className="text-center relative z-10">
                  <h2 className="text-7xl font-black text-slate-900 mb-2">
                    {dailyKanji?.kanji}
                  </h2>
                  <p className="text-[10px] font-black text-blue-600 mb-1 capitalize tracking-tight">
                    {dailyKanji?.read}
                  </p>
                  <p className="text-sm font-bold text-slate-700 capitalize">
                    {dailyKanji?.mean}
                  </p>
                </div>
              )}
              <div className="absolute -bottom-6 -left-6 text-slate-50 text-8xl font-black opacity-60 select-none">
                {dailyKanji?.kanji}
              </div>
            </div>
          </section>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white p-7 rounded-[2.2rem] border border-slate-100 shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">
              Progress
            </p>
            <p className="text-3xl font-black text-slate-800">
              {stats.completed}
              <span className="text-slate-200 text-xl">/{stats.total}</span>
            </p>
          </div>
          <div className="bg-white p-7 rounded-[2.2rem] border border-slate-100 shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">
              Mastery
            </p>
            <p className="text-3xl font-black text-blue-600">
              {stats.total > 0
                ? Math.round((stats.completed / stats.total) * 100)
                : 0}
              %
            </p>
          </div>
          <div className="md:col-span-2 bg-blue-600 p-7 rounded-[2.2rem] text-white flex flex-col justify-center relative overflow-hidden shadow-xl shadow-blue-200">
            <div className="relative z-10">
              <p className="text-[9px] font-black text-blue-200 uppercase mb-1 tracking-widest">
                Lanjutkan
              </p>
              <h4 className="font-bold text-lg truncate">
                {stats.lastLesson
                  ? `Bab ${stats.lastLesson.id}: ${stats.lastLesson.title}`
                  : "Siap belajar?"}
              </h4>
            </div>
            <div className="absolute right-[-5%] bottom-[-30%] text-white/10 text-9xl font-black italic">
              GO
            </div>
          </div>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm group hover:border-blue-200 transition-all">
            <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-6">
              Learning Path
            </h3>
            <h2 className="text-4xl font-black mb-4 tracking-tighter italic leading-none">
              Kurikulum Dasar
            </h2>
            <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed">
              Materi tata bahasa dan kosakata persiapan JFT/JLPT.
            </p>
            <Link href="/materi">
              <button className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-blue-600 transition-all">
                BUKA MATERI →
              </button>
            </Link>
          </div>

          <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-6">
              Assessment
            </h3>
            <h2 className="text-4xl font-black mb-4 tracking-tighter italic leading-none">
              Simulasi Ujian
            </h2>
            <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed">
              Uji kemampuanmu dengan sistem timer real-time.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-white hover:text-slate-900 transition-all"
            >
              MULAI TRY OUT
            </button>
          </div>
        </div>
      </main>

      {/* STICKY SUPPORT */}
      <div className="fixed bottom-8 left-0 right-0 z-40 flex justify-center px-6 pointer-events-none">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 p-2 pl-6 rounded-full shadow-2xl flex items-center gap-6 pointer-events-auto">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
            <p className="text-[10px] font-black text-white uppercase tracking-widest hidden sm:block">
              Support Project
            </p>
          </div>
          <Link href="/support">
            <button className="bg-white text-slate-900 text-[10px] font-black px-5 py-3 rounded-full hover:bg-blue-600 hover:text-white transition-all">
              DONASI 🍵
            </button>
          </Link>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-300 relative">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black italic tracking-tighter">
                Pilih Paket.
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-300 hover:text-slate-900 text-3xl font-light"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              {packages.map((pkg) => (
                <button
                  key={pkg}
                  onClick={() => {
                    setShowModal(false);
                    router.push(`/tryout/${encodeURIComponent(pkg)}`);
                  }}
                  className="w-full p-6 border border-slate-50 bg-slate-50 rounded-[2rem] flex justify-between items-center hover:border-blue-600 hover:bg-blue-50 transition-all group"
                >
                  <div className="text-left">
                    <p className="font-black text-slate-800">Paket #{pkg}</p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">
                      60 Mins • Standard
                    </p>
                  </div>
                  <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                    →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
