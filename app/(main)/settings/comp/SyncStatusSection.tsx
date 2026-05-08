"use client";

import { motion, Variants } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cloud, CloudCheck, RefreshCw } from "lucide-react";

interface SyncStatusSectionProps {
  dirtySrsCount: number;
  isSyncing: boolean;
  handleManualSync: () => void;
  itemVariants: Variants;
}

export default function SyncStatusSection({
  dirtySrsCount,
  isSyncing,
  handleManualSync,
  itemVariants
}: SyncStatusSectionProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="bg-background/[0.01] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500 shadow-xl ${
              dirtySrsCount > 0 
                ? 'bg-warning/10 border-warning/20 text-warning shadow-amber-500/10' 
                : 'bg-success/10 border-success/20 text-success shadow-emerald-500/10'
            }`}>
              {dirtySrsCount > 0 ? (
                <Cloud size={32} className="animate-pulse" />
              ) : (
                <CloudCheck size={32} className="drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-black uppercase italic tracking-tighter text-foreground">Sirkuit Sinkronisasi</h3>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1 opacity-60">
                {dirtySrsCount > 0 
                  ? `${dirtySrsCount} data tertahan di buffer lokal` 
                  : "Enkripsi cloud terverifikasi & aman"}
              </p>
            </div>
          </div>
          <Button 
            onClick={handleManualSync}
            disabled={isSyncing || dirtySrsCount === 0}
            className={`h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-xl ${
              dirtySrsCount > 0
                ? 'bg-primary text-primary-foreground hover:scale-[1.02] shadow-primary/20'
                : 'bg-background/5 text-muted-foreground border border-white/10 opacity-50 cursor-not-allowed'
            }`}
          >
            <RefreshCw size={18} className={`mr-3 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? "Transmitting..." : "Manual Sync"}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
