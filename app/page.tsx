"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LandingPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.replace("/dashboard");
      } else {
        setCheckingAuth(false);
      }
    };
    checkUser();
  }, [router]);

  if (checkingAuth)
    return (
      <div className="min-h-screen bg-[#1f242d] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#0ef]/20 border-t-[#0ef] rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#1f242d] text-[#c4cfde] overflow-hidden selection:bg-[#0ef] selection:text-[#1f242d]">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 flex items-center min-h-[90vh]">
        {/* Background Decor */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[0%] right-[-5%] w-[600px] h-[600px] bg-[#0ef]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[20%] left-[-5%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10 w-full">
          <p className="text-[#0ef] font-black text-[10px] uppercase tracking-[0.6em] mb-4 animate-pulse">
            // OPEN_SOURCE_LANGUAGE_LEARNING
          </p>
          <h1 className="text-7xl md:text-[100px] lg:text-[130px] font-black italic tracking-tighter text-white leading-[0.85] mb-10">
            JAPANESE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ef] via-white to-[#0ef] bg-[length:200%_auto] animate-gradientText">
              MADE SIMPLE.
            </span>
          </h1>

          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <Link
              href="/login"
              className="px-12 py-6 bg-[#0ef] text-[#1f242d] font-black rounded-2xl shadow-[0_20px_40px_rgba(0,255,239,0.2)] hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-[0.2em]"
            >
              Start Learning Free
            </Link>
            <div className="flex items-center gap-4 px-6 py-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/5">
              <span className="flex h-3 w-3 rounded-full bg-green-500 animate-ping" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                Community Driven:{" "}
                <span className="text-white">100% Donation Based</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-32 bg-[#1e2024]/50 relative border-y border-white/5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Structured",
                desc: "Materi N5 hingga N1 yang disusun secara logis dan mudah dipahami.",
                icon: "📚",
              },
              {
                title: "Exam Sim",
                desc: "Simulasi JLPT dengan timer real-time dan sistem penilaian otomatis.",
                icon: "⏱️",
              },
              {
                title: "No Paywall",
                desc: "Semua fitur terbuka. Kami bertahan dari dukungan komunitas.",
                icon: "🔓",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-10 rounded-[3rem] bg-[#1f242d] shadow-shadowOne border border-white/5 hover:border-[#0ef]/20 transition-all"
              >
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-black italic text-white mb-4 uppercase tracking-tighter">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#c4cfde]/50 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="py-32 text-center">
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="text-4xl md:text-6xl font-black italic text-white tracking-tighter mb-8 uppercase">
            Ready to break the{" "}
            <span className="text-[#0ef]">language barrier?</span>
          </h2>
          <Link
            href="/login"
            className="inline-block px-14 py-6 border-2 border-[#0ef] text-[#0ef] font-black rounded-2xl hover:bg-[#0ef] hover:text-[#1f242d] transition-all text-xs uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(0,255,239,0.1)]"
          >
            Create Your Terminal Account
          </Link>
        </div>
      </section>

      {/* Footer Decoration */}
      <div className="fixed top-[40%] right-[-5%] text-[20rem] font-black italic text-white/[0.02] pointer-events-none select-none">
        道
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
    </div>
  );
}
