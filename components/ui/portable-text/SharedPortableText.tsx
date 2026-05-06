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



export const sharedPtComponents: PortableTextComponents = {
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-2xl md:text-3xl font-black text-foreground mt-12 md:mt-16 mb-6 md:mb-8 uppercase tracking-tight flex items-center gap-3 md:gap-4 group">
        <span className="w-1.5 md:w-2 h-6 md:h-8 bg-primary rounded-full neo-card shadow-sm" />
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-lg md:text-xl font-black text-primary mt-8 md:mt-10 mb-3 md:mb-4 uppercase tracking-widest">
        {children}
      </h3>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-4 md:mb-6 text-muted-foreground text-base md:text-lg leading-relaxed font-medium">
        {children}
      </p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-10 neo-inset p-6 md:p-8 border-l-4 border-purple-500 text-purple-600 dark:text-purple-200/80 italic text-sm md:text-base leading-relaxed">
        {children}
      </blockquote>
    ),
  },
  types: {
    callout: ({ value }: { value: { type?: string; title?: string; text?: string } }) => {
      if (!value) return null;
      const isWarning = value.type === "warning";
      return (
        <div
          className={`my-10 p-6 md:p-8 rounded-[2rem] border border-border relative overflow-hidden ${isWarning ? "bg-red-500/5 dark:bg-[#150a0a]" : "bg-muted/30"}`}
        >
          <div className="flex items-center gap-3 mb-4">
            {isWarning ? (
              <AlertTriangle className="text-red-500" size={20} />
            ) : (
              <Lightbulb className="text-cyan-500 dark:text-cyan-400" size={20} />
            )}
            <strong
              className={`font-bold uppercase tracking-widest text-[10px] ${isWarning ? "text-red-500" : "text-cyan-500 dark:text-cyan-400"}`}
            >
              {value.title || "Catatan"}
            </strong>
          </div>
          <p className="text-sm md:text-base text-muted-foreground relative z-10 leading-relaxed font-medium">
            {value.text || ""}
          </p>
        </div>
      );
    },
    vocabulary: ({ value }: { value: VocabularyValue }) => {
      if (!value) return null;
      const isRomaji = value.furigana && /^[a-zA-Z\s.,?!'-]+$/.test(value.furigana);
      return (
        <div className="group relative flex items-center justify-between p-4 md:p-6 bg-muted/30 border border-border rounded-2xl hover:border-primary/40 hover:bg-primary/[0.02] transition-all duration-300 mb-4 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary transition-all duration-300" />
          <div className="flex flex-col">
            <div className="text-xl md:text-2xl font-black text-foreground tracking-tight">
              {(() => {
                const hiraReading = isRomaji ? wanakana.toHiragana(value.furigana || "") : (value.furigana || "");
                return splitFurigana(value.jp || "", hiraReading).map((chunk, i) => (
                  chunk.furi ? (
                    <ruby key={i}>
                      {chunk.text}
                      <rt className="text-[10px] text-cyan-500 dark:text-cyan-400/70 font-bold tracking-widest uppercase mb-1">
                        {chunk.furi}
                      </rt>
                    </ruby>
                  ) : (
                    <span key={i}>{chunk.text}</span>
                  )
                ));
              })()}
            </div>
            <p className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-widest mt-1">
               {value.furigana ? wanakana.toRomaji(value.furigana) : ""}
            </p>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-3 font-bold uppercase tracking-widest border-l-2 border-border pl-4">
              {value.id || ""}
            </p>
          </div>
          <div className="shrink-0 neo-inset p-2 rounded-xl group-hover:shadow-none transition-all">
            {value.jp ? <TTSReader text={value.jp} minimal={true} /> : null}
          </div>
        </div>
      );
    },
    exampleSentence: ({ value }: { value: { jp: string; furigana?: string; id: string } }) => {
      if (!value) return null;
      const isRomaji = value.furigana && /^[a-zA-Z\s.,?!'-]+$/.test(value.furigana);
      
      const hasTranslation = !!value.id && value.id.trim().length > 0;
      
      return (
        <div className="my-8 p-6 md:p-10 bg-card border border-border rounded-[2rem] md:rounded-[3rem] shadow-sm hover:border-primary/30 transition-all duration-500 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
             <FileText size={120} />
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex flex-col gap-3">
               <div className="text-xl md:text-3xl font-black text-foreground font-japanese leading-relaxed tracking-tight">
                  {(() => {
                    const hiraReading = isRomaji ? wanakana.toHiragana(value.furigana || "") : (value.furigana || "");
                    return splitFurigana(value.jp || "", hiraReading.replace(/[\s.]/g, "")).map((chunk, i) => (
                      chunk.furi ? (
                        <ruby key={i}>
                          {chunk.text}
                          <rt className="text-[10px] md:text-xs text-primary/80 font-bold tracking-[0.1em] not-italic mb-1">
                             {chunk.furi}
                          </rt>
                        </ruby>
                      ) : (
                        <span key={i}>{chunk.text}</span>
                      )
                    ));
                  })()}
               </div>
               <p className="text-[10px] md:text-sm font-bold text-muted-foreground/40 uppercase tracking-[0.1em] group-hover:text-muted-foreground transition-colors leading-relaxed">
                  {isRomaji ? value.furigana : (value.furigana ? wanakana.toRomaji(value.furigana) : "")}
               </p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6 border-t border-border/50">
               {(!hasTranslation && !value.furigana) ? (
                 <div className="flex-1" />
               ) : (
                 <div className="flex-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 block mb-2">Arti Kalimat</span>
                    <p className="text-sm md:text-lg font-medium text-muted-foreground leading-relaxed italic">
                       {hasTranslation ? `"${value.id}"` : "(Terjemahan belum tersedia)"}
                    </p>
                 </div>
               )}
               <div className="shrink-0 flex items-center gap-3">
                  <div className="neo-inset p-2 rounded-2xl bg-muted/30 group-hover:shadow-none transition-all">
                    <TTSReader text={value.jp} minimal={true} />
                  </div>
               </div>
            </div>
          </div>
        </div>
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    image: (props: any) => <SanityImage {...props} />,
  },
};
