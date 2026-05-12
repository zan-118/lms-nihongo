"use client";

import { useState, useEffect } from "react";

import { Search, Bell, Menu, Cloud, RefreshCw, CloudOff, CloudUpload, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/store/useUIStore";
import { useSRSStore } from "@/store/useSRSStore";
import { useNavbar } from "@/components/layout/navbar/useNavbar";
import NotificationPopover from "@/components/features/user/NotificationPopover";
import SearchModal from "@/components/features/tools/search/SearchModal";
import UserNav from "@/components/features/user/UserNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();
  const { pathname } = useNavbar();
  const notifications = useUIStore((s) => s.notifications);
  const isSyncing = useUIStore((s) => s.isSyncing);
  const syncError = useUIStore((s) => s.syncError);
  const hasPendingSync = useSRSStore((s) => s.dirtySrs.size > 0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const unreadNotifications = notifications?.filter((n: { read: boolean }) => !n.read).length || 0;

  // Breadcrumb logic
  const pathSegments = pathname.split('/').filter(Boolean);

  // Global CMD+K shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  
  return (
    <>
    <header className="sticky top-0 z-40 w-full bg-background/60 backdrop-blur-xl border-b border-border/50 px-4 md:px-10 py-4 flex items-center justify-between transition-all">
      <div className="flex items-center gap-6">
        {/* Mobile Menu or Back Toggle */}
        <div className="md:hidden flex items-center gap-2">
          {pathSegments.length > 1 ? (
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => router.back()}
              aria-label="Kembali ke Halaman Sebelumnya"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted/50 border border-border/50 text-muted-foreground hover:text-primary transition-all"
            >
               <ChevronLeft size={20} />
            </motion.button>
          ) : (
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={onMenuClick}
              aria-label="Buka Menu Navigasi"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted/50 border border-border/50 text-muted-foreground hover:text-primary transition-all"
            >
               <Menu size={20} />
            </motion.button>
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <h1 className="text-xs md:text-lg font-black text-foreground uppercase tracking-wider truncate leading-none">
            {pathSegments.length > 0 ? decodeURIComponent(pathSegments[pathSegments.length - 1]).replace(/-/g, ' ') : "Dashboard"}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 md:gap-5">
        {/* Sync Status Indicator */}
        <div 
          aria-live="polite"
          aria-atomic="true"
          className="hidden sm:flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-lg bg-muted/30 border border-border/50 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 transition-all overflow-hidden min-w-fit md:min-w-[100px]"
        >
          <AnimatePresence mode="wait">
            {isSyncing ? (
              <motion.div 
                key="syncing"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2"
              >
                <RefreshCw size={12} className="animate-spin text-primary" aria-hidden="true" />
                <span className="animate-pulse hidden md:inline">Sinkronisasi...</span>
              </motion.div>
            ) : syncError ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2"
              >
                <CloudOff size={12} className="text-destructive drop-shadow-[0_0_8px_rgba(var(--destructive-rgb),0.4)]" aria-hidden="true" />
                <span className="text-destructive/90 hidden md:inline">Gagal Sinkron</span>
              </motion.div>
            ) : hasPendingSync ? (
              <motion.div 
                key="pending"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2"
              >
                <CloudUpload size={12} className="text-warning drop-shadow-[0_0_8px_rgba(var(--warning-rgb),0.4)]" aria-hidden="true" />
                <span className="text-warning/90 hidden md:inline">Tertunda</span>
              </motion.div>
            ) : (
              <motion.div 
                key="synced"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2"
              >
                <Cloud size={12} className="text-success drop-shadow-[0_0_8px_rgba(var(--success-rgb),0.4)]" aria-hidden="true" />
                <span className="text-success/70 hidden md:inline">Tersinkronisasi</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Global Search Button - Refined width */}
        <div 
          onClick={() => setIsSearchOpen(true)}
          className="hidden lg:flex relative w-40 xl:w-56 group cursor-pointer"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors" size={14} />
          <div className="w-full h-9 pl-9 pr-4 bg-muted/30 border border-border/50 rounded-xl text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 flex items-center justify-between hover:border-primary/30 transition-all">
            Cari...
            <kbd className="hidden xl:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              <span className="text-[10px]">⌘</span>K
            </kbd>
          </div>
        </div>

        {/* Mobile/Small Desktop Search Icon */}
        <button 
          onClick={() => setIsSearchOpen(true)}
          aria-label="Buka Pencarian"
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-muted/50 border border-border/50 text-muted-foreground hover:text-primary transition-all"
        >
          <Search size={18} />
        </button>

        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 sm:border-l sm:border-border/50 sm:pl-2 md:pl-5">
          <div className="hidden sm:flex">
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 relative">
             <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              aria-label={`Notifikasi (${unreadNotifications} belum dibaca)`}
              aria-expanded={isNotificationsOpen}
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all relative ${
                isNotificationsOpen 
                  ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)]' 
                  : 'bg-muted/50 border border-border/50 text-muted-foreground hover:text-primary'
              }`}
             >
                <Bell size={18} />
                {unreadNotifications > 0 && (
                  <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-destructive rounded-full shadow-[0_0_8px_rgba(var(--destructive-rgb),1)] animate-pulse" />
                )}
             </motion.button>

             <NotificationPopover 
              isOpen={isNotificationsOpen} 
              onClose={() => setIsNotificationsOpen(false)} 
             />
          </div>
        </div>

        <div className="w-[1px] h-6 bg-border/50 mx-1 hidden sm:block" />

        <UserNav />
      </div>
    </header>

    <SearchModal 
      isOpen={isSearchOpen} 
      onClose={() => setIsSearchOpen(false)} 
    />
    </>
  );
}
