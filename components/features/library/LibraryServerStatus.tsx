"use client";

import React from "react";
import { motion } from "framer-motion";
import { Server } from "lucide-react";
import { Card } from "@/components/ui/card";

/**
 * Komponen visualizer kesiapan materi di halaman pustaka.
 */
export function LibraryServerStatus() {
  return (
    <Card className="p-8 md:p-10 rounded-3xl md:rounded-[3.5rem] bg-muted/30 border-border neo-card shadow-none min-w-[320px]">
      <div className="flex items-center justify-between mb-6">
         <div className="flex items-center gap-3 md:gap-4 text-muted-foreground font-bold uppercase text-xs md:text-xs tracking-widest">
            <Server size={16} className="md:w-5 md:h-5" /> Kesiapan Materi
         </div>
         <span className="text-xs md:text-xs font-mono text-primary font-bold">100%</span>
      </div>
      <div className="flex gap-2 md:gap-2.5">
         {[...Array(6)].map((_, i) => (
           <div key={i} className="flex-1 h-8 md:h-12 bg-primary/10 rounded-full overflow-hidden">
              <motion.div 
                animate={{ height: ["30%", "90%", "30%"] }}
                transition={{ repeat: Infinity, duration: 2 + i * 0.15, ease: "easeInOut" }}
                className="w-full bg-primary" 
              />
           </div>
         ))}
      </div>
    </Card>
  );
}
