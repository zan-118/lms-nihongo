"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, ChevronRight, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Material {
  title: string;
  difficulty: string;
  slug: string;
  category?: string;
}

interface ReadingListClientProps {
  materials: Material[];
}

export default function ReadingListClient({ materials }: ReadingListClientProps) {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-primary">
          <BookOpen size={24} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Perpustakaan Digital</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter">
          Graded Reading
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl font-medium">
          Pilih bacaan yang sesuai dengan level Anda. Klik pada kata yang sulit untuk melihat arti dan mendengarkan pengucapannya.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((material, index) => (
          <motion.div
            key={material.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/library/reading/${material.slug}`}>
              <div className="group h-full p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-3xl border border-white/5 hover:border-primary/40 transition-all duration-500 relative overflow-hidden flex flex-col justify-between">
                {/* Hover Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-all" />
                
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 uppercase font-black tracking-widest px-3 py-1">
                      {material.difficulty}
                    </Badge>
                    <div className="p-2 rounded-xl bg-background/5 group-hover:bg-primary/10 border border-white/5 group-hover:border-primary/20 transition-all">
                      <GraduationCap size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {material.category || "General Reading"}
                    </span>
                    <h3 className="text-2xl font-black text-foreground leading-tight group-hover:text-primary transition-colors">
                      {material.title}
                    </h3>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between relative z-10">
                  <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                    Mulai Membaca
                  </span>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-background/5 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}

        {materials.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4">
             <div className="w-20 h-20 rounded-full bg-background/5 border border-dashed border-white/10 flex items-center justify-center mx-auto">
                <BookOpen size={32} className="text-muted-foreground opacity-30" />
             </div>
             <p className="text-muted-foreground font-medium">Belum ada materi bacaan yang tersedia.</p>
          </div>
        )}
      </div>
    </div>
  );
}
