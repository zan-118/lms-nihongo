"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) router.push("/dashboard");
      setLoading(false);
    };
    checkUser();
  }, [router]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-6 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-[10px]">
            NP
          </div>
          <span className="text-sm font-black uppercase tracking-widest">
            NihongoPath
          </span>
        </div>
        <Link href="/login">
          <button className="text-[10px] font-black uppercase tracking-widest px-5 py-2 border border-slate-100 rounded-full hover:bg-slate-50 transition-all">
            Login
          </button>
        </Link>
      </nav>

      {/* HERO SECTION - Mobile Optimized */}
      <main className="max-w-6xl mx-auto px-6 pt-12 pb-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full mb-8 animate-bounce">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest">
            Free for everyone
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 italic leading-[0.85]">
          Master Japanese. <br />
          <span className="text-blue-600">Purely Free.</span>
        </h1>

        <p className="text-slate-500 max-w-md text-lg font-medium mb-12 leading-relaxed">
          Platform belajar bahasa Jepang mandiri dengan kurikulum terstruktur
          dan simulasi ujian real-time.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <Link href="/login" className="flex-1">
            <button className="w-full bg-slate-900 text-white font-black py-5 px-8 rounded-3xl hover:bg-blue-600 hover:scale-105 transition-all shadow-xl text-lg">
              Mulai Belajar ⛩️
            </button>
          </Link>
        </div>

        {/* MOBILE PREVIEW DECORATION */}
        <div className="mt-20 relative w-full max-w-lg">
          <div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full"></div>
          <div className="relative bg-slate-50 border border-slate-100 p-4 rounded-[3rem] shadow-2xl overflow-hidden aspect-[9/16] max-h-[400px] mx-auto">
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6"></div>
            <div className="space-y-4">
              <div className="h-20 bg-white rounded-3xl border border-slate-100"></div>
              <div className="h-40 bg-white rounded-3xl border border-slate-100"></div>
              <div className="h-20 bg-blue-600 rounded-3xl"></div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-50 py-12 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
          Donation-Based Learning Platform
        </p>
      </footer>
    </div>
  );
}
