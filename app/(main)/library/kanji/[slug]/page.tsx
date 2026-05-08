import { sanityFetch } from "@/lib/sanity.fetch";
import { kanjiQuery } from "@/lib/queries";
import { notFound } from "next/navigation";
import KanjiStrokePlayer from "@/components/features/kanji/components/KanjiStrokePlayer";
import KanjiInfoCard from "@/components/features/kanji/components/KanjiInfoCard";

export default async function KanjiPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await sanityFetch({
    query: kanjiQuery,
    params: { slug },
    tags: ["kanji"],
  });

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-20 px-6 overflow-hidden relative">
      {/* Premium Ambient Glow - Adaptive Opacity */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 dark:bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-primary/5 dark:bg-primary/10 blur-[100px] rounded-full pointer-events-none" />


      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left Column: The Player */}
        <div className="flex flex-col items-center">
          <KanjiStrokePlayer 
            character={data.character} 
            sanitySvg={data.strokeOrderSvg}
            size={320}
          />
        </div>

        {/* Right Column: Information */}
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xl font-black">
                  {data.character}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">
                  Kanji Intelligence
                </span>
             </div>
             <h1 className="text-4xl lg:text-5xl font-black text-foreground tracking-tighter uppercase leading-none drop-shadow-sm">
                {data.meaning}
              </h1>

          </div>

          <div className="grid grid-cols-2 gap-8 p-8 rounded-3xl bg-card border border-border shadow-xl relative overflow-hidden">

             {/* Decorative Background */}
             <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 blur-[60px] rounded-full" />
             
             <div className="flex flex-col gap-2 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Onyomi</span>
                <span className="text-2xl font-japanese font-bold text-foreground">{data.onyomi || "—"}</span>
             </div>

             <div className="flex flex-col gap-2 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Kunyomi</span>
                <span className="text-2xl font-japanese font-bold text-foreground">{data.kunyomi || "—"}</span>
             </div>

          </div>

          <KanjiInfoCard 
            radicals={data.radicals} 
            mnemonics={data.mnemonics} 
          />
        </div>
      </div>
    </div>
  );
}
