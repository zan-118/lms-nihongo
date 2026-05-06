"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Briefcase, Plane, Tv, ChevronRight, CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUIStore } from "@/store/useUIStore";

const JLPT_LEVELS = [
  { id: "N5", label: "Pemula (N5)" },
  { id: "N4", label: "Dasar (N4)" },
  { id: "N3", label: "Menengah (N3)" },
  { id: "N2", label: "Lanjut (N2)" },
  { id: "N1", label: "Mahir (N1)" },
];

const MOTIVATIONS = [
  { id: "exam", icon: BookOpen, label: "Lulus Ujian JLPT" },
  { id: "hobby", icon: Tv, label: "Hobi / Anime" },
  { id: "career", icon: Briefcase, label: "Karir / Pekerjaan" },
  { id: "travel", icon: Plane, label: "Wisata ke Jepang" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [targetLevel, setTargetLevel] = useState<string | null>(null);
  const [motivation, setMotivation] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async () => {
    if (!targetLevel || !motivation) return;
    
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from("profiles")
          .update({ 
            jlpt_target: targetLevel, 
            motivation: motivation 
          })
          .eq("id", user.id);

        if (error) throw error;
      }
      
      router.push("/dashboard");
    } catch (error) {
      console.error("Gagal menyimpan profil:", error);
      useUIStore.getState().addNotification({
        title: "Gagal Menyimpan",
        message: "Terjadi kendala saat menyimpan profil Anda. Silakan coba lagi.",
        type: "warning"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Variasi Animasi Framer Motion untuk transisi elegan
  const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
      {/* Background Decor (Elegan Vibe) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10 flex flex-col justify-center min-h-[400px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center space-y-10"
            >
              <div className="space-y-4">
                <h1 className="text-6xl md:text-8xl font-black text-cyan-500 dark:text-cyan-400 font-japanese tracking-tight">
                  ようこそ!
                </h1>
                <p className="text-sm md:text-base font-bold text-muted-foreground uppercase tracking-[0.3em]">
                  (Youkoso)
                </p>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
                  Selamat Datang di NihongoRoute
                </h2>
                <p className="text-lg text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed">
                  Platform edukasi cerdas untuk menaklukkan bahasa Jepang. Mari tentukan jalur belajar ideal Anda.
                </p>
              </div>

              <div className="pt-8">
                <Button 
                  onClick={() => setStep(2)}
                  className="rounded-2xl px-10 h-14 text-base font-black uppercase tracking-widest bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
                >
                  Mulai Perjalanan <ChevronRight className="ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="text-center space-y-3 mb-8">
                <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
                  Apa Target JLPT Anda?
                </h2>
                <p className="text-muted-foreground font-medium">
                  Beri tahu kami level mana yang ingin Anda capai saat ini.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {JLPT_LEVELS.map((level) => (
                  <Card
                    key={level.id}
                    onClick={() => setTargetLevel(level.id)}
                    className={`cursor-pointer p-6 border-2 transition-all duration-300 rounded-[1.5rem] flex flex-col items-center justify-center text-center group shadow-none ${
                      targetLevel === level.id 
                        ? "border-cyan-500 bg-cyan-500/5 shadow-md scale-[1.02]" 
                        : "border-border/50 hover:border-cyan-500/30 hover:bg-muted/30"
                    }`}
                  >
                    <span className="text-3xl font-black tracking-tight mb-2 group-hover:text-cyan-500 transition-colors">
                      {level.id}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      {level.label.split(" ")[0]}
                    </span>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between items-center pt-8">
                <Button variant="ghost" onClick={() => setStep(1)} className="rounded-xl font-bold uppercase tracking-widest text-xs text-muted-foreground hover:text-foreground">
                  Kembali
                </Button>
                <Button 
                  onClick={() => setStep(3)}
                  disabled={!targetLevel}
                  className="rounded-xl px-8 h-12 font-black uppercase tracking-widest bg-foreground text-background"
                >
                  Lanjut <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="text-center space-y-3 mb-8">
                <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
                  Apa Motivasi Anda?
                </h2>
                <p className="text-muted-foreground font-medium">
                  Alasan kuat akan memandu Anda saat materi terasa sulit.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MOTIVATIONS.map((item) => (
                  <Card
                    key={item.id}
                    onClick={() => setMotivation(item.id)}
                    className={`cursor-pointer p-6 border-2 transition-all duration-300 rounded-[1.5rem] flex items-center gap-5 group shadow-none ${
                      motivation === item.id 
                        ? "border-indigo-500 bg-indigo-500/5 shadow-md scale-[1.02]" 
                        : "border-border/50 hover:border-indigo-500/30 hover:bg-muted/30"
                    }`}
                  >
                    <div className={`p-4 rounded-2xl transition-colors ${
                      motivation === item.id 
                        ? "bg-indigo-500 text-white" 
                        : "bg-muted text-muted-foreground group-hover:text-indigo-500"
                    }`}>
                      <item.icon size={24} />
                    </div>
                    <span className="font-bold text-base md:text-lg">
                      {item.label}
                    </span>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between items-center pt-8">
                <Button variant="ghost" onClick={() => setStep(2)} className="rounded-xl font-bold uppercase tracking-widest text-xs text-muted-foreground hover:text-foreground">
                  Kembali
                </Button>
                <Button 
                  onClick={handleComplete}
                  disabled={!motivation || isSubmitting}
                  className="rounded-xl px-8 h-12 font-black uppercase tracking-widest bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Selesaikan Profil
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Indicator Bawah */}
        <div className="mt-16 flex justify-center gap-3">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                step === i ? "w-12 bg-cyan-500" : step > i ? "w-6 bg-cyan-500/30" : "w-6 bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
