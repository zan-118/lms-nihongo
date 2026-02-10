"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import ini untuk deteksi posisi

export default function Navbar() {
  const [user, setUser] = useState(null);
  const pathname = usePathname(); // Ambil path saat ini (contoh: /dashboard/materi)

  // Fungsi untuk mengubah path menjadi array breadcrumb
  // Contoh: /dashboard/materi -> ["dashboard", "materi"]
  const breadcrumbs = pathname.split("/").filter((path) => path !== "");

  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1f242d]/80 backdrop-blur-xl border-b border-white/5 h-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-full flex items-center justify-between">
        {/* LEFT SIDE: Logo & Breadcrumbs */}
        <div className="flex items-center gap-4">
          <Link
            href={user ? "/dashboard" : "/"}
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="w-9 h-9 bg-[#1e2024] shadow-shadowOne rounded-xl flex items-center justify-center border border-white/5 group-hover:border-[#0ef]/50 transition-all">
              <span className="text-[#0ef] font-black italic text-lg shadow-[0_0_10px_#0ef]">
                N
              </span>
            </div>
            {/* Sembunyikan nama brand di mobile jika ada breadcrumb agar tidak sesak */}
            <span
              className={`hidden sm:inline text-lg font-black italic text-white tracking-tighter uppercase font-titleFont ${breadcrumbs.length > 0 ? "md:inline lg:inline" : ""}`}
            >
              Nihongo<span className="text-[#0ef]">Path</span>
            </span>
          </Link>

          {/* BREADCRUMB INTEGRATION */}
          {user && breadcrumbs.length > 0 && (
            <div className="flex items-center gap-2 ml-2 pl-4 border-l border-white/10 overflow-hidden">
              {breadcrumbs.map((path, index) => (
                <div key={index} className="flex items-center gap-2 shrink-0">
                  <span className="text-[#c4cfde]/20 font-black text-[10px] tracking-widest">
                    /
                  </span>
                  <Link
                    href={`/${breadcrumbs.slice(0, index + 1).join("/")}`}
                    className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors hover:text-[#0ef] ${
                      index === breadcrumbs.length - 1
                        ? "text-[#0ef]"
                        : "text-[#c4cfde]/50"
                    }`}
                  >
                    {path.replace("-", " ")}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="p-3 bg-[#1e2024] shadow-shadowOne border border-white/5 rounded-xl hover:border-red-500/50 transition-all group"
              title="Logout System"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-[#c4cfde] group-hover:text-red-500 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          ) : (
            <Link
              href="/login"
              className="neu-button px-6 py-2 text-[9px] uppercase tracking-[0.2em] whitespace-nowrap"
            >
              Authenticate
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
