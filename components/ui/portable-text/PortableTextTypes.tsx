import React from "react";
import { AlertTriangle, Lightbulb, FileText, BookOpen, MessageSquare, Youtube } from "lucide-react";
import TTSReader from "@/components/features/tools/tts/TTSReader";
import SanityImage from "@/components/ui/SanityImage";
import FuriganaDisplay from "@/components/ui/FuriganaDisplay";

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

export const ptTypes = {
  callout: ({ value }: { value: { type: "info" | "warning" | "tip" | "grammar"; text: string; title?: string } }) => {
    const config = {
      info: { icon: FileText, color: "text-primary", bg: "bg-primary/5", border: "border-primary/20" },
      warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/5", border: "border-warning/20" },
      tip: { icon: Lightbulb, color: "text-success", bg: "bg-success/5", border: "border-success/20" },
      grammar: { icon: BookOpen, color: "text-secondary", bg: "bg-secondary/5", border: "border-secondary/20" },
    };
    const { icon: Icon, color, bg, border } = config[value.type] || config.info;

    return (
      <div className={`my-10 md:my-14 p-6 md:p-10 rounded-[2.5rem] border ${border} ${bg.replace("/5", "/20")} bg-card/80 backdrop-blur-xl relative overflow-hidden group shadow-2xl transition-all duration-500 hover:scale-[1.01]`}>
        <div className={`absolute top-0 left-0 w-1.5 h-full ${color.replace("text", "bg")} opacity-50`} />
        <div className="flex items-start gap-6 relative z-10">
          <div className={`p-4 rounded-2xl ${bg} border border-border ${color} shadow-lg group-hover:rotate-12 transition-transform`}>
            <Icon size={28} aria-hidden="true" />
          </div>
          <div className="flex-1 pt-1">
            <div className="mb-2">
              <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${color} mb-1 block`}>
                {value.type === "grammar" ? "Tata Bahasa" : `Sistem Note: ${value.type}`}
              </span>
              {value.title && (
                <h4 className="text-lg md:text-xl font-black uppercase tracking-tight text-foreground">
                  {value.title}
                </h4>
              )}
            </div>
            <p className="text-muted-foreground text-sm md:text-lg leading-relaxed font-medium">
              {value.text}
            </p>
          </div>
        </div>
      </div>
    );
  },
  vocabulary: ({ value }: { value: VocabularyValue }) => {
    return (
      <div className="my-10 md:my-16 group">
        <div className="p-8 md:p-12 rounded-[3rem] bg-card/80 backdrop-blur-3xl border border-border shadow-2xl relative overflow-hidden transition-all duration-500 hover:border-primary/40 hover:bg-card/90">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[80px] rounded-full -mr-24 -mt-24 group-hover:bg-primary/10 transition-all" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6 block opacity-70">
                  Target Kosakata
                </span>
                <FuriganaDisplay text={value.jp} furigana={value.furigana} size="large" interactive={true} />
              </div>

             <div className="flex flex-col items-end gap-4">
                <div className="bg-background/5 p-4 rounded-[2rem] border border-border group-hover:border-primary/30 group-hover:bg-primary/5 transition-all shadow-xl">
                  <TTSReader text={value.jp} minimal={true} />
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  },
  exampleSentence: ({ value }: { value: { jp: string; furigana: string; id: string } }) => {
    return (
      <div className="my-10 md:my-14 p-8 md:p-10 rounded-[2.5rem] bg-card/80 backdrop-blur-xl border border-border relative overflow-hidden group shadow-2xl transition-all duration-500 hover:scale-[1.01]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 to-transparent" />
        
        <div className="flex flex-col gap-8 relative z-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block opacity-60">
              Contoh Kalimat
            </span>
            <FuriganaDisplay text={value.jp} furigana={value.furigana} size="medium" interactive={true} />
          </div>

          <div className="flex items-start gap-4 py-4 px-6 rounded-2xl bg-background/[0.03] border-l-4 border-primary/40">
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
  dialogueBlock: ({ value }: { value: { lines: any[] } }) => {
    return (
      <div className="my-12 md:my-20 space-y-10">
        {value.lines?.map((line, idx) => {
          // Extract plain text from Portable Text blocks
          const plainText = Array.isArray(line.text) 
            ? line.text.map((block: any) => block.children?.map((c: any) => c.text).join("")).join("")
            : "";

          return (
            <div key={idx} className="flex flex-col gap-4 group/dialogue">
              <div className="flex items-center gap-4 px-2">
                <div className="w-1.5 h-6 bg-secondary/40 rounded-full group-hover/dialogue:bg-secondary group-hover/dialogue:h-8 transition-all" />
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] opacity-80">
                     Pembicara
                   </span>
                   <span className="text-sm md:text-base font-bold text-foreground tracking-tight">
                     {line.speakerName}
                   </span>
                </div>
              </div>
              
              <div className="p-8 md:p-10 rounded-[3rem] bg-card/40 backdrop-blur-2xl border border-border/40 shadow-xl group-hover/dialogue:bg-card/60 transition-all duration-500 hover:border-secondary/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-[60px] rounded-full -mr-16 -mt-16 group-hover/dialogue:bg-secondary/10 transition-all" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="flex-1">
                    <FuriganaDisplay 
                      text={plainText} 
                      furigana={line.furigana} 
                      size="medium" 
                      interactive={true} 
                    />
                  </div>
                  
                  <div className="flex flex-col items-end gap-3">
                    {line.romaji && (
                      <span className="text-[10px] md:text-xs text-muted-foreground/50 font-medium tracking-widest uppercase italic">
                        {line.romaji}
                      </span>
                    )}
                    <div className="bg-background/10 p-3 rounded-2xl border border-border group-hover/dialogue:border-secondary/20 transition-all shadow-lg">
                      <TTSReader text={plainText} minimal={true} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  },
  youtubeEmbed: ({ value }: { value: { url: string } }) => {
    const videoId = value.url?.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^& \n]+)/)?.[1];
    if (!videoId) return null;

    return (
      <div className="my-12 md:my-20 group">
        <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-border shadow-2xl bg-black transition-all duration-500 group-hover:scale-[1.01] group-hover:border-primary/40">
           <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 pointer-events-none" />
           <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="absolute inset-0 w-full h-full z-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube Video"
          />
        </div>
        <div className="mt-4 flex items-center gap-3 px-6 opacity-40 group-hover:opacity-100 transition-opacity">
          <Youtube size={16} className="text-destructive" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Media Eksternal • YouTube Player
          </span>
        </div>
      </div>
    );
  },
  image: ({ value }: { value: SanityImageValue }) => <SanityImage value={value} />,
};
