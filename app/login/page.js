"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + "/dashboard" },
    });
    if (error) setMessage(error.message);
    else setMessage("Cek email kamu untuk link login!");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center px-6 py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-10">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl mx-auto mb-6 shadow-lg shadow-blue-200">
          NP
        </div>
        <h2 className="text-4xl font-black tracking-tighter italic">Okaeri!</h2>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Masuk tanpa ribet password, cukup pakai email.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 shadow-xl shadow-slate-200/50 rounded-[3rem] border border-slate-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="block w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600 font-bold text-slate-900 transition-all"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full flex justify-center py-5 px-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-blue-600 transition-all disabled:opacity-50 shadow-xl shadow-slate-200"
            >
              {loading ? "MENGIRIM..." : "DAPATKAN MAGIC LINK →"}
            </button>
          </form>

          {message && (
            <div className="mt-6 p-4 bg-blue-50 rounded-2xl text-center">
              <p className="text-xs font-bold text-blue-600 leading-relaxed">
                {message}
              </p>
            </div>
          )}
        </div>

        <p className="mt-10 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
          NihongoPath • Community Project
        </p>
      </div>
    </div>
  );
}
