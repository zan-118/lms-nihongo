import React from "react";
import { PortableTextComponents } from "@portabletext/react";
import { AlertTriangle, Lightbulb, FileText } from "lucide-react";
import TTSReader from "@/components/features/tools/tts/TTSReader";
import SanityImage from "@/components/ui/SanityImage";
import * as wanakana from "wanakana";
import { splitFurigana } from "@/lib/furigana";

interface VocabularyValue {
  jp: string;
  furigana: string;
  id: string;
}

interface SanityImageValue {
  asset: {
    _id?: string;
    _ref?: string;
    metadata?: {
      lqip?: string;
      dimensions?: {
        width: number;
        height: number;
        aspectRatio: number;
      };
    };
  };
  alt?: string;
}

export const sharedPtComponents: PortableTextComponents = {
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-3xl md:text-5xl font-black text-foreground mt-16 md:mt-24 mb-8 md:mb-10 uppercase tracking-tighter flex items-center gap-4 group">
        <span className="w-2 h-10 md:h-12 bg-gradient-to-b from-primary to-emerald-500 rounded-full shadow-[0_0_15px_rgba(0,238,255,0.4)]" />
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-xl md:text-2xl font-black text-primary mt-12 md:mt-16 mb-4 md:mb-6 uppercase tracking-[0.2em] flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        {children}
      </h3>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-muted-foreground text-sm md:text-lg leading-[1.8] md:leading-[2] mb-6 md:mb-8 font-medium">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="space-y-4 md:space-y-6 mb-8 md:mb-12 list-none">
        {children}
      </ul>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="flex items-start gap-4 md:gap-5 group">
        <div className="mt-2.5 w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-primary/30 group-hover:bg-primary group-hover:scale-125 transition-all shadow-[0_0_10px_rgba(0,238,255,0)] group-hover:shadow-[0_0_10px_rgba(0,238,255,0.5)]" />
        <div className="flex-1 text-muted-foreground text-sm md:text-lg leading-relaxed font-medium group-hover:text-foreground transition-colors">
          {children}
        </div>
      </li>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-black text-foreground border-b-2 border-primary/20">{children}</strong>
    ),
    code: ({ children }: { children?: React.ReactNode }) => (
      <code className="bg-primary/10 text-primary px-2 py-0.5 rounded-md font-mono text-sm border border-primary/20">
        {children}
      </code>
    ),
  },
  types: {
    callout: ({ value }: { value: { type: "info" | "warning" | "tip"; text: string } }) => {
      const config = {
        info: { icon: FileText, color: "text-blue-500", bg: "bg-blue-500/5", border: "border-blue-500/20" },
        warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/5", border: "border-amber-500/20" },
        tip: { icon: Lightbulb, color: "text-emerald-500", bg: "bg-emerald-500/5", border: "border-emerald-500/20" },
      };
      const { icon: Icon, color, bg, border } = config[value.type] || config.info;

      return (
        <div className={`my-10 md:my-14 p-6 md:p-10 rounded-[2.5rem] border ${border} ${bg.replace("/5", "/20")} bg-card/80 backdrop-blur-xl relative overflow-hidden group shadow-2xl transition-all duration-500 hover:scale-[1.01]`}>
          <div className={`absolute top-0 left-0 w-1.5 h-full ${color.replace("text", "bg")} opacity-50`} />
          <div className="flex items-start gap-6 relative z-10">
            <div className={`p-4 rounded-2xl ${bg} border ${border} ${color} shadow-lg group-hover:rotate-12 transition-transform`}>
              <Icon size={28} />
            </div>
            <div className="flex-1 pt-1">
              <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${color} mb-2 block`}>
                Sistem Note: {value.type}
              </span>
              <p className="text-muted-foreground text-sm md:text-lg leading-relaxed font-bold">
                {value.text}
              </p>
            </div>
          </div>
        </div>
      );
    },
    vocabulary: ({ value }: { value: VocabularyValue }) => {
      const parts = splitFurigana(value.jp, value.furigana);
      
      return (
        <div className="my-10 md:my-16 group">
          <div className="p-8 md:p-12 rounded-[3rem] bg-card/80 backdrop-blur-3xl border border-white/5 shadow-2xl relative overflow-hidden transition-all duration-500 hover:border-primary/40 hover:bg-card/90">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[80px] rounded-full -mr-24 -mt-24 group-hover:bg-primary/10 transition-all" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
               <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6 block opacity-70">
                    Target Kosakata
                  </span>
                  <div className="flex flex-wrap items-end gap-x-2 gap-y-6">
                    {parts.map((part, i) => (
                      <div key={i} className="flex flex-col items-center min-w-fit">
                        {part.furi && (
                          <span className="text-xs md:text-base font-black text-primary/60 mb-1 tracking-widest animate-in fade-in slide-in-from-bottom-1">
                            {part.furi}
                          </span>
                        )}
                        <span className={`text-4xl md:text-7xl font-black tracking-tighter ${wanakana.isKanji(part.text) ? 'text-foreground drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'text-foreground/80'}`}>
                          {part.text}
                        </span>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="flex flex-col items-end gap-4">
                  <div className="bg-white/[0.03] p-4 rounded-[2rem] border border-white/5 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all shadow-xl">
                    <TTSReader text={value.jp} minimal={true} />
                  </div>
               </div>
            </div>
          </div>
        </div>
      );
    },
    exampleSentence: ({ value }: { value: { jp: string; furigana: string; id: string } }) => {
      const parts = splitFurigana(value.jp, value.furigana);
      
      return (
        <div className="my-10 md:my-14 p-8 md:p-10 rounded-[2.5rem] bg-card/80 backdrop-blur-xl border border-white/5 relative overflow-hidden group shadow-2xl transition-all duration-500 hover:scale-[1.01]">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 to-transparent" />
          
          <div className="flex flex-col gap-8 relative z-10">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block opacity-60">
                Contoh Kalimat
              </span>
              <div className="flex flex-wrap items-end gap-x-1.5 gap-y-4">
                {parts.map((part, i) => (
                  <div key={i} className="flex flex-col items-center">
                    {part.furi && (
                      <span className="text-[10px] md:text-sm font-black text-primary/60 mb-1 tracking-wider">
                        {part.furi}
                      </span>
                    )}
                    <span className="text-xl md:text-3xl font-black text-foreground/90 group-hover:text-foreground transition-colors">
                      {part.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-4 py-4 px-6 rounded-2xl bg-white/[0.03] border-l-4 border-primary/40">
              <p className="text-sm md:text-lg font-medium text-muted-foreground/90 italic leading-relaxed">
                &quot;{value.id}&quot;
              </p>
            </div>

            <div className="flex justify-end">
              <TTSReader text={value.jp} minimal={true} />
            </div>
          </div>
        </div>
      );
    },
    image: ({ value }: { value: SanityImageValue }) => <SanityImage value={value} />,
  },
};
