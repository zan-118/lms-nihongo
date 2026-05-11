"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Bookmark, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GrammarCardProps {
  article: {
    _id: string;
    title: string;
    slug: string;
  };
  index: number;
  selectedLevel: string;
}

export function GrammarCard({ article, index, selectedLevel }: GrammarCardProps) {
  // Determine badge color based on level
  const levelColors: Record<string, string> = {
    n5: "text-success border-success/20 bg-success/5",
    n4: "text-primary border-primary/20 bg-primary/5",
    n3: "text-secondary border-secondary/20 bg-secondary/5",
    n2: "text-warning border-warning/20 bg-warning/5",
    n1: "text-destructive border-destructive/20 bg-destructive/5",
  };

  const currentLevelColor = levelColors[selectedLevel.toLowerCase()] || levelColors.n5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        delay: (index % 12) * 0.05,
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      className="group h-full"
      style={{ 
        willChange: 'transform'
      }}
    >
      <Link href={`/library/grammar/${article.slug}`} className="block h-full">
        <Card className="h-full p-6 bg-card/40 backdrop-blur-xl border border-border rounded-[2rem] group transition-all duration-500 flex flex-col cursor-pointer hover:border-primary/50 hover:bg-card/60 shadow-2xl relative overflow-hidden">
          {/* Hover Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="relative z-10 flex flex-col h-full">
            {/* Top Row */}
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-2xl bg-muted/50 border border-border flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/10 transition-all duration-500">
                <Bookmark
                  size={18}
                  className="text-muted-foreground group-hover:text-primary transition-colors duration-500"
                />
              </div>
              <Badge 
                variant="outline" 
                className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-xl h-auto border ${currentLevelColor}`}
              >
                {selectedLevel.toUpperCase()}
              </Badge>
            </div>
            
            {/* Title Section */}
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight leading-tight group-hover:text-primary transition-colors duration-300 mb-3 line-clamp-3">
                {article.title}
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-primary/40" />
                <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest group-hover:text-primary/50 transition-colors">
                  Pola Kalimat
                </span>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-8 pt-5 border-t border-border flex items-center justify-between">
              <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.15em] group-hover:text-primary transition-colors">
                Pelajari Modul
              </span>
              <div className="w-9 h-9 rounded-xl bg-muted/50 border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-transparent transition-all duration-500">
                 <ArrowRight size={16} />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
