"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useNavbar } from "@/components/layout/navbar/useNavbar";
import { useHasMounted } from "@/hooks/useHasMounted";

// Domain Components
import { SidebarItem } from "./sidebar/SidebarItem";
import { UserStatusSection } from "./sidebar/UserStatusSection";

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const hasMounted = useHasMounted();
  const { pathname, isAuthenticated, userFullName, handleLogout, links } = useNavbar();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden"
        />
      )}

      <aside className={`fixed top-0 left-0 h-screen bg-background/60 backdrop-blur-3xl border-r border-white/5 p-6 z-[60] flex flex-col w-72 transition-transform duration-500 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Background Neural Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,238,255,0.02)_0%,transparent_50%)] pointer-events-none" />
      
      {/* LOGO */}
      <div className="mb-12 flex items-center gap-4 relative z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 group-hover:rotate-12 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(0,238,255,0.4)]">
            <Image
              src="/logo-branding.svg"
              alt="NihongoRoute"
              fill
              priority
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
             <span className="text-xl font-black text-foreground italic tracking-tighter uppercase leading-none">
               Nihongo<span className="text-primary">Route</span>
             </span>
             <div className="flex items-center gap-2 mt-1">
                <span className="text-[8px] font-bold text-primary/50 uppercase tracking-widest">Ecosystem</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">v2.0</span>
             </div>
          </div>
        </Link>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-8 relative z-10 overflow-y-auto pr-2 custom-scrollbar">
        {/* Utama */}
        <div className="space-y-1">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em] mb-3 ml-4 opacity-50">
            Platform
          </div>
          {links.main.map((item) => (
            <SidebarItem key={item.href} item={item} pathname={pathname} onClick={onClose} />
          ))}
        </div>

        {/* Belajar */}
        <div className="space-y-1">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em] mb-3 ml-4 opacity-50">
            Pembelajaran
          </div>
          {links.learn.map((item) => (
            <SidebarItem key={item.href} item={item} pathname={pathname} onClick={onClose} />
          ))}
        </div>

        {/* Sistem */}
        <div className="space-y-1">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em] mb-3 ml-4 opacity-50">
            Sistem
          </div>
          {links.system.map((item) => (
            <SidebarItem key={item.href} item={item} pathname={pathname} onClick={onClose} />
          ))}
        </div>

      </nav>

      {/* FOOTER ACTIONS */}
      <div className="mt-auto space-y-4 relative z-10 pt-6 border-t border-border">
         <UserStatusSection 
            hasMounted={hasMounted}
            isAuthenticated={isAuthenticated}
            userFullName={userFullName}
            handleLogout={handleLogout}
         />
      </div>

      {/* MINI FOOTER - LEGAL & INFO */}
      <div className="mt-6 pt-4 border-t border-white/5 relative z-10">
        <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30">
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
          <span className="w-1 h-1 rounded-full bg-background/5" />
          <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
          <span className="w-1 h-1 rounded-full bg-background/5" />
          <span className="opacity-50">© 2024</span>
        </div>
      </div>
    </aside>
    </>
  );
}
