"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";

function ResultContent() {
  const searchParams = useSearchParams();
  const score = parseInt(searchParams.get("score") || 0);
  const total = parseInt(searchParams.get("total") || 0);
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  useEffect(() => {
    if (percentage >= 70) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#2563eb", "#ffffff", "#60a5fa"],
      });
    }
  }, [percentage]);

  const getMessage = () => {
    if (percentage >= 90)
      return { title: "Sugoi! 🔥", desc: "Luar biasa, kamu hampir sempurna!" };
    if (percentage >= 70)
      return {
        title: "Otsukaresama! ✨",
        desc: "Hasil yang sangat bagus, pertahankan!",
      };
    return { title: "Ganbatte! 💪", desc: "Jangan menyerah, coba lagi yuk!" };
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-slate-900">
      <div className="w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200 border border-slate-100 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4">
          Hasil Simulasi
        </p>

        <h1 className="text-5xl font-black italic tracking-tighter mb-2">
          {getMessage().title}
        </h1>
        <p className="text-slate-400 font-medium text-sm mb-10">
          {getMessage().desc}
        </p>

        <div className="relative w-48 h-48 mx-auto mb-10 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-slate-50"
            />
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={502.4}
              strokeDashoffset={502.4 - (502.4 * percentage) / 100}
              className="text-blue-600 transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black italic">{percentage}%</span>
            <span className="text-[10px] font-black text-slate-300 uppercase">
              {score} / {total} BENAR
            </span>
          </div>
        </div>

        <div className="space-y-3 relative z-10">
          <Link
            href="/dashboard"
            className="block text-white bg-slate-900 font-black py-5 rounded-2xl hover:bg-blue-600 transition-all shadow-xl"
          >
            KEMBALI KE DASHBOARD
          </Link>
          <button
            disabled
            className="w-full bg-slate-50 text-slate-300 font-black py-5 rounded-2xl cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>LIHAT PEMBAHASAN</span>
            <span className="text-[8px] bg-slate-200 px-2 py-1 rounded-md text-slate-400">
              SOON
            </span>
          </button>
        </div>

        <button
          onClick={() => {
            const text = `Saya baru saja mendapatkan skor ${percentage}% di NihongoPath! Ayo belajar bahasa Jepang bareng.`;
            window.open(
              `https://wa.me/?text=${encodeURIComponent(text)}`,
              "_blank"
            );
          }}
          className="mt-8 text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors"
        >
          Share ke WhatsApp 📱
        </button>
      </div>
    </div>
  );
}

// Wrapper Suspense diperlukan karena useSearchParams digunakan di Client Component
export default function ResultPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultContent />
    </Suspense>
  );
}
