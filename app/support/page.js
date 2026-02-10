"use client";
import { useRouter } from "next/navigation";

export default function SupportPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#1f242d] text-[#c4cfde] selection:bg-[#0ef]/30 font-bodyFont">
      {/* Navigation */}
      <nav className="p-6 sticky top-0 bg-[#1f242d]/80 backdrop-blur-xl z-50 flex justify-between items-center border-b border-white/5">
        <button
          onClick={() => router.back()}
          className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c4cfde]/40 hover:text-[#0ef] transition-all"
        >
          ← Back
        </button>
        <div className="font-titleFont font-black italic text-2xl tracking-tighter text-white">
          N<span className="text-[#0ef]">P</span>.
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-16">
        {/* Floating Heart Icon with Neumorphism */}
        <div className="relative w-24 h-24 mx-auto mb-16 group">
          <div className="absolute inset-0 bg-[#0ef] blur-[50px] opacity-20 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-[#1e2024] to-[#23272b] shadow-shadowOne border border-white/5 w-full h-full rounded-[2.5rem] flex items-center justify-center text-4xl rotate-6 group-hover:rotate-0 transition-all duration-500 group-hover:shadow-[0_0_30px_#0ef]/20">
            💙
          </div>
        </div>

        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white leading-[0.8] mb-10 font-titleFont">
            KEEP IT <br />{" "}
            <span className="text-[#0ef] drop-shadow-[0_0_10px_rgba(0,255,239,0.3)]">
              FREE FOR ALL.
            </span>
          </h1>
          <p className="text-[#c4cfde]/60 text-sm font-medium max-w-md mx-auto leading-relaxed">
            Donasi kamu adalah energi transmisi agar{" "}
            <span className="text-white font-bold">NihongoPath</span> tetap bisa
            diakses gratis oleh pejuang JLPT di seluruh jaringan global.
          </p>
        </div>

        {/* Donation Grid - Cyber Neumorphic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <a
            href="https://trakteer.id/Zan118/tip"
            target="_blank"
            className="p-10 rounded-[2.5rem] bg-gradient-to-br from-[#1e2024] to-[#23272b] shadow-shadowOne border border-white/5 hover:border-[#0ef]/50 transition-all group overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-4 opacity-[0.02] text-6xl font-black italic font-titleFont group-hover:text-[#0ef]/10 transition-colors">
              TIP
            </div>
            <div className="text-3xl mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
              ☕
            </div>
            <h3 className="text-white font-black text-2xl mb-1 font-titleFont uppercase italic">
              Trakteer
            </h3>
            <p className="text-[9px] font-bold text-[#c4cfde]/40 uppercase tracking-[0.2em] leading-loose">
              Support via IDR / E-Wallet
            </p>
          </a>

          <a
            href="https://saweria.co/Zan118"
            target="_blank"
            className="p-10 rounded-[2.5rem] bg-gradient-to-br from-[#1e2024] to-[#23272b] shadow-shadowOne border border-white/5 hover:border-[#0ef]/50 transition-all group overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-4 opacity-[0.02] text-6xl font-black italic font-titleFont group-hover:text-[#0ef]/10 transition-colors">
              QRIS
            </div>
            <div className="text-3xl mb-6 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300">
              💸
            </div>
            <h3 className="text-white font-black text-2xl mb-1 font-titleFont uppercase italic">
              Saweria
            </h3>
            <p className="text-[9px] font-bold text-[#c4cfde]/40 uppercase tracking-[0.2em] leading-loose">
              Support via QRIS / Gopay
            </p>
          </a>
        </div>

        {/* Transparency Card - The "Engine" Room */}
        <div className="bg-gradient-to-br from-[#1e2024] to-[#23272b] p-12 rounded-[3.5rem] border border-white/5 shadow-shadowOne relative overflow-hidden group">
          <div className="absolute -bottom-10 -right-10 opacity-[0.03] text-[12rem] font-black italic font-titleFont select-none group-hover:text-[#0ef]/10 transition-colors">
            CORE
          </div>

          <h4 className="text-[#0ef] text-[10px] font-black uppercase tracking-[0.5em] mb-12 font-titleFont flex items-center gap-4">
            <span className="h-[1px] w-8 bg-[#0ef]"></span>
            Allocation of Funds
          </h4>

          <ul className="grid grid-cols-1 gap-10 relative z-10">
            {[
              {
                title: "Infrastructure",
                desc: "Server & Database maintenance",
                icon: "⚡",
              },
              {
                title: "New Content",
                desc: "N5 - N1 Curriculum development",
                icon: "📚",
              },
              {
                title: "Advanced Features",
                desc: "Interactive Listening & AI Tutor",
                icon: "🤖",
              },
            ].map((item, i) => (
              <li key={i} className="flex gap-6 items-center group/item">
                <span className="text-[#0ef] font-titleFont font-black italic text-xl group-hover:scale-125 transition-transform duration-300">
                  0{i + 1}
                </span>
                <div className="h-10 w-[1px] bg-white/5 group-hover:bg-[#0ef]/20 transition-colors"></div>
                <div>
                  <h5 className="text-white font-black text-sm uppercase tracking-widest font-titleFont">
                    {item.title}
                  </h5>
                  <p className="text-[10px] text-[#c4cfde]/40 font-bold uppercase tracking-widest">
                    {item.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-16 text-center text-[9px] font-black uppercase tracking-[0.5em] text-[#c4cfde]/20">
          Transmission Secure // End of Page
        </p>
      </main>
    </div>
  );
}
