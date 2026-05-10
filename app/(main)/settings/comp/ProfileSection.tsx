"use client";

import { motion, Variants } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { Zap, Flame, Award, ShieldCheck } from "lucide-react";

interface ProfileSectionProps {
  name: string;
  xp: number;
  streak: number;
  isAuthenticated: boolean;
  updateProfileName: (name: string) => void;
  itemVariants: Variants;
}

export default function ProfileSection({ 
  name, 
  xp,
  streak,
  isAuthenticated, 
  updateProfileName, 
  itemVariants 
}: ProfileSectionProps) {
  const [newName, setNewName] = useState(name);
  const [isSyncing, setIsSyncing] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setNewName(name);
  }, [name]);

  const handleSave = async () => {
    if (!newName.trim()) {
      toast.error("Nama tidak boleh kosong!");
      return;
    }
    
    setIsSyncing(true);
    try {
      updateProfileName(newName);
      
      if (isAuthenticated) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from("profiles")
            .update({ full_name: newName.trim() })
            .eq("id", user.id);
          
          if (error) throw error;
        }
      }
      toast.success("Nama profil berhasil diperbarui!");
    } catch (error) {
      console.error("Gagal sinkron nama:", error);
      toast.error("Nama disimpan lokal, tapi gagal sinkron ke cloud.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="bg-background/[0.01] backdrop-blur-3xl border border-border rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-hidden relative group">
        {/* Pilot ID Card Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full -ml-16 -mb-16" />
        
        {/* ID Card Header Pattern */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-blue-500 to-emerald-500 opacity-60" />

        <div className="flex flex-col lg:flex-row gap-10 relative z-10">
          {/* AVATAR / PILOT ID */}
          <div className="flex flex-col items-center gap-4">
             <div className="relative group/avatar">
                <div className="absolute -inset-1 bg-gradient-to-br from-primary to-blue-600 rounded-[2.5rem] blur opacity-25 group-hover/avatar:opacity-50 transition duration-1000 group-hover/avatar:duration-200" />
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-[2.2rem] bg-card border border-border flex items-center justify-center text-foreground relative z-10 overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
                   <span className="text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-primary to-blue-500 drop-shadow-sm">
                      {(name || "S").charAt(0).toUpperCase()}
                   </span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-card border border-border rounded-2xl flex items-center justify-center z-20 shadow-xl group-hover:scale-110 transition-transform">
                   <ShieldCheck size={20} className="text-success" />
                </div>
             </div>
             <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">Rank</span>
                <span className="text-xs font-black uppercase tracking-widest text-primary">Master Pilot</span>
             </div>
          </div>
          
          <div className="flex-1 space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-foreground mb-2 flex flex-col lg:flex-row lg:items-center gap-3">
                 Identitas Belajar
                 {isAuthenticated && (
                   <span className="text-[10px] not-italic font-black bg-success/10 text-success border border-success/20 px-3 py-1 rounded-full uppercase tracking-widest w-fit mx-auto lg:mx-0">
                      Verified Pilot
                   </span>
                 )}
              </h2>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Atur nama panggungmu di NihongoRoute</p>
            </div>

            {/* STATS COUNTERS */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-background/[0.03] border border-border rounded-2xl p-5 flex items-center gap-4 group/stat hover:bg-background/[0.05] transition-all">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                     <Zap size={22} className="fill-current animate-pulse" />
                  </div>
                  <div>
                     <div className="text-2xl font-black tracking-tighter text-foreground">
                        <AnimatedCounter value={xp} />
                     </div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Total XP</p>
                  </div>
               </div>
               <div className="bg-background/[0.03] border border-border rounded-2xl p-5 flex items-center gap-4 group/stat hover:bg-background/[0.05] transition-all">
                  <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center text-warning shadow-inner">
                     <Flame size={22} className="fill-current" />
                  </div>
                  <div>
                     <div className="text-2xl font-black tracking-tighter text-foreground">
                        <AnimatedCounter value={streak} />
                     </div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Streak Hari</p>
                  </div>
               </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 group/input">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground/40 group-focus-within/input:text-primary transition-colors">
                   <Award size={18} />
                </div>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Masukkan nama pilot..."
                  className="w-full h-14 bg-background/[0.02] border border-border rounded-2xl pl-12 pr-4 text-sm font-black text-foreground uppercase tracking-tight focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/20"
                />
              </div>
              <Button 
                onClick={handleSave}
                disabled={isSyncing}
                className="h-14 bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] rounded-2xl px-10 shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {isSyncing ? "Transmitting..." : "Update Pilot Name"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
