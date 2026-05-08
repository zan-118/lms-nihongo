import React from "react";
import { SharedPortableText } from "@/components/ui/portable-text/SharedPortableText";
import { BookOpen, Sparkles } from "lucide-react";

interface KanjiInfoCardProps {
  radicals?: string[];
  mnemonics?: unknown; // Portable Text content
  meaning?: string;
}

export default function KanjiInfoCard({
  radicals = [],
  mnemonics,
  meaning,
}: KanjiInfoCardProps) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[400px]">
      {/* Meaning Section */}
      {meaning && (
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Definition</span>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">
            {meaning}
          </h2>
        </div>
      )}

      {/* Radicals Section */}
      {radicals.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
             <BookOpen size={14} className="text-primary/50" />
             <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Radicals</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {radicals.map((radical, idx) => (
              <div 
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm font-japanese font-bold text-white/80"
              >
                {radical}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mnemonics Section */}
      {mnemonics && (
        <div className="flex flex-col gap-3">
           <div className="flex items-center gap-2">
             <Sparkles size={14} className="text-primary/50" />
             <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mnemonic Study</span>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 text-sm text-muted-foreground leading-relaxed">
            <SharedPortableText value={mnemonics} />
          </div>
        </div>
      )}
    </div>
  );
}
