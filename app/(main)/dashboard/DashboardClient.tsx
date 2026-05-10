"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { useSRSStore } from "@/store/useSRSStore";
import { useUIStore } from "@/store/useUIStore";

import { motion, Variants } from "framer-motion";
import dynamic from "next/dynamic";
import DashboardHero from "@/components/features/dashboard/DashboardHero";
import DashboardStats from "@/components/features/dashboard/DashboardStats";
import DashboardSettings from "@/components/features/dashboard/DashboardSettings";
import LevelUpOverlay from "@/components/features/gamification/LevelUpOverlay";
import ConfirmModal from "@/components/ui/ConfirmModal";
import OnboardingTour from "@/components/features/onboarding/OnboardingTour";
import DailyQuests from "@/components/features/dashboard/quests/DailyQuests";
import { toast } from "sonner";
import { UserProgress } from "@/store/types";
import { SRSState } from "@/lib/srs";

// Domain Components
import { DashboardTabs } from "@/components/features/dashboard/DashboardTabs";

const KanjiProgressGrid = dynamic(() => import("@/components/features/dashboard/KanjiProgressGrid"), { 
  ssr: false,
  loading: () => <div className="h-[200px] w-full animate-pulse bg-muted rounded-2xl" />
});

const AchievementsGrid = dynamic(() => import("@/components/features/gamification/AchievementsGrid"), { 
  ssr: false,
  loading: () => <div className="h-[200px] w-full animate-pulse bg-muted rounded-2xl" />
});
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// ======================
// CONFIG / CONSTANTS
// ======================
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0, filter: "blur(10px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

const TABS = [
  { id: "beranda", label: "Beranda", icon: "🏠" },
  { id: "progres", label: "Progres", icon: "📈" },
  { id: "pencapaian", label: "Koleksi", icon: "🏆" },
  { id: "pengaturan", label: "Setelan", icon: "⚙️" },
];

interface DashboardClientProps {
  courseMetadata: Array<{
    _id: string;
    title: string;
    slug: string;
    lessons: Array<{
      _id: string;
      title: string;
      slug: string;
    }>;
  }>;
}

export default function DashboardClient({ courseMetadata }: DashboardClientProps) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const resetAuth = useAuthStore(s => s.resetAuth);

  const id = useUserStore(s => s.id);
  const isGuest = useUserStore(s => s.isGuest);
  const name = useUserStore(s => s.name);
  const xp = useUserStore(s => s.xp);
  const level = useUserStore(s => s.level);
  const streak = useUserStore(s => s.streak);
  const todayReviewCount = useUserStore(s => s.todayReviewCount);
  const lastStudyDate = useUserStore(s => s.lastStudyDate);
  const studyDays = useUserStore(s => s.studyDays);
  const inventory = useUserStore(s => s.inventory);
  const resetUser = useUserStore(s => s.resetUser);

  const srs = useSRSStore(s => s.srs);
  const resetSRS = useSRSStore(s => s.resetSRS);

  const loading = useUIStore(s => s.loading);
  const resetUI = useUIStore(s => s.resetUI);
  const exportData = useUIStore(s => s.exportData);
  const importData = useUIStore(s => s.importData);
  const notifications = useUIStore(s => s.notifications);
  const settings = useUIStore(s => s.settings);

  const resetProgress = () => {
    resetAuth();
    resetUser();
    resetSRS();
    resetUI();
  };

  // Reconstruct a lightweight progress object for legacy components if needed
  const progress: UserProgress = {
    id: id || "guest", 
    isGuest: !!isGuest, 
    name: name || "Pelajar", 
    xp: xp || 0, 
    level: level || 1, 
    streak: streak || 0, 
    todayReviewCount: todayReviewCount || 0, 
    lastStudyDate: lastStudyDate || null, 
    studyDays: studyDays || {}, 
    inventory: inventory || { streakFreeze: 0, claimedQuests: { date: "", quests: [] } }, 
    srs: srs || {}, 
    notifications: notifications || [], 
    settings: settings || { notificationsEnabled: true },
    completedLessons: {}
  };
  const [guestId, setGuestId] = useState<string>("MEMUAT...");
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    description: "",
    confirmText: "",
    isDestructive: false,
    onConfirm: () => {},
  });

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkId = async () => {
      if (isAuthenticated) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Gunakan UID Supabase yang dipendekkan sebagai Student ID
          setGuestId("ST-" + session.user.id.substring(0, 8).toUpperCase());
          return;
        }
      }

      // Fallback ke Guest ID
      let savedId = localStorage.getItem("nihongo_guest_id");
      if (!savedId) {
        savedId = "NP-" + Math.random().toString(36).substring(2, 8).toUpperCase();
        localStorage.setItem("nihongo_guest_id", savedId);
      }
      setGuestId(savedId);
    };

    checkId();
  }, [isAuthenticated, supabase.auth]);

  const handleExportData = () => exportData();

  const handleImportData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const result = event.target?.result as string;
        if (importData(result)) window.location.reload();
        else alert("Format file data tidak valid atau rusak!");
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const openConfirm = (title: string, description: string, confirmText: string, isDestructive: boolean, onConfirm: () => void) => {
    setConfirmModal({ isOpen: true, title, description, confirmText, isDestructive, onConfirm });
  };
  const closeConfirm = () => setConfirmModal(prev => ({ ...prev, isOpen: false }));

  const handleResetData = () => {
    openConfirm(
      "Hapus Semua Data?",
      "Peringatan: Semua progres belajar akan dihapus permanen secara lokal. Tindakan ini tidak dapat dibatalkan.",
      "Ya, Hapus Data",
      true,
      () => {
        resetProgress();
        toast.success("Semua data telah dihapus.");
        window.location.reload(); 
      }
    );
  };

  const handleLogout = () => {
    openConfirm(
      "Keluar Akun?",
      "Sesi belajar Anda akan diakhiri. Pastikan data sudah tersinkronisasi sebelum keluar.",
      "Keluar",
      true,
      async () => {
        await supabase.auth.signOut();
        resetProgress();
        router.push("/login");
      }
    );
  };

  const [dueCount, setDueCount] = useState(0);
  const xpNeeded = 1000 - (progress.xp % 1000);
  const xpProgress = (progress.xp % 1000) / 10;

  useEffect(() => {
    const now = Date.now();
    const count = Object.values(progress.srs as Record<string, SRSState>).filter((card: SRSState) => card.nextReview <= now).length;
    setDueCount(count);
  }, [progress.srs]);

  const [activeTab, setActiveTab] = useState("beranda");

  return (
    <div className="max-w-7xl mx-auto relative z-10">
      <OnboardingTour />
      <LevelUpOverlay level={progress.level} />
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirm}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmText={confirmModal.confirmText}
        isDestructive={confirmModal.isDestructive}
        onConfirm={confirmModal.onConfirm}
      />

      <DashboardTabs 
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <motion.div
        key={activeTab}
        id={`${activeTab}-panel`}
        role="tabpanel"
        tabIndex={0}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "beranda" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <DashboardHero 
                loading={loading} 
                guestId={guestId} 
                dueCount={dueCount}
                itemVariants={itemVariants}
                isAuthenticated={isAuthenticated}
                courseMetadata={courseMetadata}
              />
              <div className="space-y-8">
                <div className="flex flex-col">
                  <h2 className="text-muted-foreground font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Peta Penguasaan Kanji
                  </h2>
                  <h3 className="text-lg md:text-xl font-black text-foreground uppercase tracking-tight">
                    Ringkasan <span className="text-primary">Progress</span> Cepat
                  </h3>
                </div>
                <KanjiProgressGrid />
              </div>
            </div>
            
            <div className="space-y-8">
              <DailyQuests />
            </div>
          </div>
        )}

        {activeTab === "progres" && (
          <div className="space-y-16">
            <DashboardStats 
              loading={loading} 
              progress={progress} 
              xpNeeded={xpNeeded} 
              xpProgress={xpProgress} 
              itemVariants={itemVariants} 
              courseMetadata={courseMetadata}
            />
            <div className="space-y-8">
              <div className="flex flex-col">
                <h2 className="text-muted-foreground font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Penguasaan Kanji
                </h2>
                <h3 className="text-lg md:text-xl font-black text-foreground uppercase tracking-tight">
                  Visualisasi <span className="text-primary">Progress</span> Kamu
                </h3>
              </div>
              <KanjiProgressGrid />
            </div>
          </div>
        )}

        {activeTab === "pencapaian" && (
          <div className="space-y-8">
            <div className="flex flex-col">
              <h2 className="text-muted-foreground font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Pencapaian & Badge
              </h2>
              <h3 className="text-lg md:text-xl font-black text-foreground uppercase tracking-tight">
                Koleksi <span className="text-primary">Trophy</span> Kamu
              </h3>
            </div>
            <AchievementsGrid />
          </div>
        )}

        {activeTab === "pengaturan" && (
          <DashboardSettings 
            isAuthenticated={isAuthenticated}
            handleExportData={handleExportData}
            handleImportData={handleImportData}
            handleResetData={handleResetData}
            handleLogout={handleLogout}
            itemVariants={itemVariants}
          />
        )}
      </motion.div>
    </div>
  );
}
