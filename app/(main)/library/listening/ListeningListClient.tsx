"use client";

import React, { useState } from "react";
import { Search, Headphones, Play, ArrowRight, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface ListeningTask {
  _id: string;
  title: string;
  slug: string;
}

interface ListeningListClientProps {
  tasks: ListeningTask[];
}

export default function ListeningListClient({ tasks }: ListeningListClientProps) {
  const [search, setSearch] = useState("");

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <Headphones size={24} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-foreground">
            Listening <span className="text-primary">Lab</span>
          </h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
          Latih kemampuan pendengaranmu dengan rekaman suara asli dan dialog interaktif. Dilengkapi dengan transkrip dan kuis pemahaman.
        </p>

        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input 
            placeholder="Cari materi listening..." 
            className="pl-12 h-14 bg-card/40 backdrop-blur-xl border-white/5 rounded-2xl text-lg shadow-2xl focus:ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task, idx) => (
            <motion.div
              key={task._id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link href={`/library/listening/${task.slug}`}>
                <Card className="group relative flex items-center gap-6 p-6 bg-card/30 backdrop-blur-3xl border-white/5 hover:border-primary/50 transition-all duration-500 rounded-3xl overflow-hidden hover:shadow-[0_0_40px_rgba(0,238,255,0.1)] cursor-pointer">
                  {/* Play Button Background */}
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shrink-0 shadow-inner">
                    <Play size={24} className="ml-1" />
                  </div>

                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                       <span className="text-lg md:text-2xl font-black text-foreground group-hover:text-primary transition-colors duration-300">
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                      <span className="flex items-center gap-1.5 bg-background/5 px-2 py-1 rounded-md">
                        <Clock size={12} />
                        Auto-Duration
                      </span>
                      <span className="flex items-center gap-1.5 bg-background/5 px-2 py-1 rounded-md">
                        <Headphones size={12} />
                        Native/TTS Supported
                      </span>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px] opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    Mulai Belajar <ArrowRight size={14} />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center mb-6">
             <Headphones size={32} className="text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Materi tidak ditemukan</h3>
          <p className="text-muted-foreground">Coba cari dengan kata kunci lain.</p>
        </div>
      )}
    </div>
  );
}
