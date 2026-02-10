"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      if (isLogin) {
        // --- LOGIKA LOGIN ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        if (data.user) {
          // Gunakan satu metode redirect yang pasti (window.location)
          // Agar middleware membaca cookie session terbaru
          window.location.href = "/dashboard";
        }
      } else {
        // --- LOGIKA DAFTAR (SIGN UP) ---
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;

        setMsg("Cek email kamu untuk verifikasi pendaftaran!");
        // Otomatis pindah ke mode login setelah daftar berhasil
        setTimeout(() => setIsLogin(true), 3000);
      }
    } catch (err) {
      setMsg(err.message || "Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1f242d] flex items-center justify-center px-6 font-bodyFont relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#0ef]/5 rounded-full blur-[100px]" />

      <div className="bg-[#1e2024] shadow-shadowOne w-full max-w-md p-10 md:p-14 rounded-[3rem] border border-white/5 relative z-10 transition-all duration-500">
        {/* Accent Line */}
        <div className="absolute top-12 left-0 w-1 h-12 bg-[#0ef] shadow-[0_0_15px_#0ef]" />

        <header className="mb-10">
          <p className="text-[#0ef] font-bold text-[9px] uppercase tracking-[0.5em] mb-2">
            NihongoPath Access
          </p>
          <h2 className="text-4xl font-black italic text-white tracking-tighter font-titleFont">
            {isLogin ? "LOG_IN." : "SIGN_UP."}
          </h2>
        </header>

        <form onSubmit={handleAuth} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-[#c4cfde]/30 uppercase tracking-widest ml-2">
              Terminal Email
            </label>
            <input
              type="email"
              placeholder="name@domain.com"
              required
              className="w-full bg-[#1f242d] border border-transparent shadow-inner shadow-black/20 rounded-2xl p-4 text-sm text-white outline-none focus:border-[#0ef]/30 transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-[#c4cfde]/30 uppercase tracking-widest ml-2">
              Access Key
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              className="w-full bg-[#1f242d] border border-transparent shadow-inner shadow-black/20 rounded-2xl p-4 text-sm text-white outline-none focus:border-[#0ef]/30 transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {msg && (
            <div className="bg-[#0ef]/5 border border-[#0ef]/10 p-4 rounded-xl">
              <p className="text-[9px] font-bold text-[#0ef] uppercase tracking-widest text-center leading-relaxed">
                {msg}
              </p>
            </div>
          )}

          <button
            disabled={loading}
            className="w-full py-5 mt-4 bg-[#1e2024] shadow-shadowOne border border-[#0ef]/20 rounded-2xl text-[10px] text-[#0ef] font-black uppercase tracking-[0.3em] hover:bg-[#0ef] hover:text-[#1f242d] hover:shadow-[0_0_20px_#0ef] transition-all duration-300 disabled:opacity-50"
          >
            {loading
              ? "INITIALIZING..."
              : isLogin
                ? "Authenticate →"
                : "Register User →"}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-10 text-[9px] font-black text-[#c4cfde]/20 uppercase tracking-[0.2em] hover:text-[#0ef] transition-colors"
        >
          {isLogin ? "// create new identity" : "// back to login terminal"}
        </button>
      </div>

      {/* Footer Decoration */}
      <div className="fixed bottom-8 text-[9px] font-bold text-[#c4cfde]/10 uppercase tracking-[1em]">
        Secure Connection Established
      </div>
    </div>
  );
}
