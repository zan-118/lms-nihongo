"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * Komponen Footer khusus Landing Page.
 */
export function LandingFooter() {
  return (
    <footer className="mt-32 pt-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="flex items-center gap-4">
        <div className="relative w-10 h-10 drop-shadow-sm dark:drop-shadow-[0_0_10px_hsl(var(--primary)/0.3)]">
          <Image
            src="/logo-branding.svg"
            alt="NihongoRoute"
            fill
            className="object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-foreground font-black uppercase tracking-widest">
            Nihongo<span className="text-primary">Route</span>
          </span>
          <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest">
            Digital Learning Ecosystem © {new Date().getFullYear()}
          </span>
        </div>
      </div>
      <div className="flex gap-6 text-xs font-black uppercase tracking-widest text-muted-foreground">
        <Link
          href="/library"
          className="hover:text-primary transition-colors"
        >
          Library
        </Link>
        <Link
          href="/review"
          className="hover:text-primary transition-colors"
        >
          Review
        </Link>
        <a
          href="https://github.com/zan-118"
          target="_blank"
          rel="noreferrer"
          className="hover:text-primary transition-colors"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
