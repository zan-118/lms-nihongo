"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SupportPage() {
  const router = useRouter();

  const donationLinks = [
    {
      platform: "Trakteer",
      url: "https://trakteer.id/Zan118/tip", // Ganti dengan link kamu
      icon: "☕",
      color: "bg-red-50 text-red-600",
      description: "Traktir kopi untuk tim developer",
    },
    {
      platform: "Saweria",
      url: "https://saweria.co/Zan118", // Ganti dengan link kamu
      icon: "💸",
      color: "bg-yellow-50 text-yellow-700",
      description: "Dukungan operasional server",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <nav className="p-6 flex items-center justify-between border-b border-slate-50 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <button
          onClick={() => router.back()}
          className="text-[10px] font-black uppercase tracking-widest text-slate-400"
        >
          ← Kembali
        </button>
        <h1 className="font-black italic text-lg tracking-tighter">
          Support Us.
        </h1>
        <div className="w-10"></div>
      </nav>

      <main className="max-w-xl mx-auto p-8 pt-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block w-20 h-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center text-4xl mb-8 shadow-2xl shadow-blue-200 rotate-3">
            ❤
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter leading-none mb-6">
            Misi Kami Adalah Pendidikan Gratis.
          </h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            NihongoPath dibangun dengan semangat berbagi. Donasi kamu membantu
            kami menjaga server tetap menyala dan konten tetap gratis untuk
            semua orang.
          </p>
        </div>

        {/* Donation Cards */}
        <div className="space-y-4 mb-16">
          {donationLinks.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="flex items-center gap-6 p-6 rounded-[2rem] border-2 border-slate-50 hover:border-blue-600 hover:bg-white transition-all shadow-sm hover:shadow-xl">
                <div
                  className={`w-14 h-14 ${link.color} rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-12 transition-transform`}
                >
                  {link.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-lg">{link.platform}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {link.description}
                  </p>
                </div>
                <span className="text-slate-300 group-hover:text-blue-600 transition-colors">
                  →
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Transparency Note */}
        <div className="bg-[#F8FAFC] p-10 rounded-[3rem] border border-slate-100">
          <h4 className="font-black italic text-sm mb-4 uppercase tracking-widest text-blue-600">
            Ke mana donasimu pergi?
          </h4>
          <ul className="space-y-4">
            {[
              "Biaya Server & Database Supabase",
              "Pengembangan fitur baru (Listening & Mobile App)",
              "Penyusunan materi kurikulum N5 - N1",
              "Biaya API untuk fitur interaktif",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm font-bold text-slate-600"
              >
                <span className="text-blue-500">✔</span> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
            Arigatou Gozaimasu!
          </p>
        </div>
      </main>
    </div>
  );
}
