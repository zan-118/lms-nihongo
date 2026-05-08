/**
 * @file page.tsx
 * @description Halaman landas (Landing Page) utama NihongoRoute.
 * Menyediakan informasi fitur, branding, dan akses cepat ke dashboard pembelajaran.
 * @module LandingPage
 */

"use client";

// Domain Components
import { Hero } from "@/components/features/landing/Hero";
import { FeatureGrid } from "@/components/features/landing/FeatureGrid";
import { TrustBanner } from "@/components/features/landing/TrustBanner";
import { LandingFooter } from "@/components/features/landing/LandingFooter";

export default function LandingPage() {
  return (
    <main className="bg-background text-foreground selection:bg-primary/30 overflow-x-hidden w-full relative transition-colors duration-300">
      {/* BACKGROUND AMBIENT */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-primary/5 bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-32 md:pb-12">
        {/* HERO SECTION */}
        <Hero />

        {/* FEATURES GRID */}
        <FeatureGrid />

        {/* TRUST BANNER */}
        <TrustBanner />

        {/* FOOTER */}
        <LandingFooter />
      </div>
    </main>
  );
}
