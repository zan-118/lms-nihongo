"use client";

import { motion, Variants } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Upload, Trash2, LogOut, Database } from "lucide-react";

interface DataManagementSectionProps {
  isAuthenticated: boolean;
  handleExportData: () => void;
  handleImportData: () => void;
  handleResetData: () => void;
  handleLogout: () => void;
  itemVariants: Variants;
}

export default function DataManagementSection({
  isAuthenticated,
  handleExportData,
  handleImportData,
  handleResetData,
  handleLogout,
  itemVariants
}: DataManagementSectionProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="bg-white/[0.01] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-10 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/10 shadow-xl">
            <Database size={22} className="text-primary drop-shadow-[0_0_8px_rgba(0,238,255,0.4)]" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-foreground">Logistik & Protokol</h2>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-0.5 opacity-50">Manajemen basis data belajar</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          <Button
            variant="ghost"
            onClick={handleExportData}
            className="h-16 bg-white/[0.03] border border-white/5 hover:bg-primary/10 hover:border-primary/30 hover:text-primary text-muted-foreground rounded-2xl uppercase tracking-[0.2em] font-black text-[10px] transition-all group/btn shadow-lg"
          >
            <Save size={18} className="mr-3 group-hover/btn:scale-110 transition-transform" /> Ekspor Backup
          </Button>
          <Button
            variant="ghost"
            onClick={handleImportData}
            className="h-16 bg-white/[0.03] border border-white/5 hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-purple-400 text-muted-foreground rounded-2xl uppercase tracking-[0.2em] font-black text-[10px] transition-all group/btn shadow-lg"
          >
            <Upload size={18} className="mr-3 group-hover/btn:scale-110 transition-transform" /> Impor Backup
          </Button>
          <Button
            variant="ghost"
            onClick={handleResetData}
            className="h-16 bg-red-500/[0.03] border border-red-500/10 hover:bg-red-500/10 hover:border-red-500 text-red-500 rounded-2xl uppercase tracking-[0.2em] font-black text-[10px] transition-all group/btn shadow-lg"
          >
            <Trash2 size={18} className="mr-3 group-hover/btn:scale-110 transition-transform" /> Purge Database
          </Button>
          {isAuthenticated && (
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="h-16 bg-white/[0.03] border border-white/5 hover:bg-white/10 hover:border-white/20 text-muted-foreground rounded-2xl uppercase tracking-[0.2em] font-black text-[10px] transition-all group/btn shadow-lg"
            >
              <LogOut size={18} className="mr-3 group-hover:translate-x-1 transition-transform" /> Terminasi Sesi
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
