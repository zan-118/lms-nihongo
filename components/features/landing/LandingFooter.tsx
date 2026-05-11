"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * Komponen Footer khusus Landing Page.
 */
export function LandingFooter() {
  return (
    <footer className="mt-[89px] pt-[55px] border-t border-border flex flex-col md:flex-row items-center justify-between gap-[34px] pb-[55px]">
      <div className="flex items-center gap-[13px]">
        <div className="relative w-10 h-10 dark:drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">
          <Image
            src="/logo-branding.svg"
            alt="NihongoRoute"
            fill
            className="object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-foreground font-bold tracking-tight">
            Nihongo<span className="text-primary">Route</span>
          </span>
          <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
            Digital Learning Ecosystem © {new Date().getFullYear()}
          </span>
        </div>
      </div>
      <div className="flex gap-[21px] text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        <Link
          href="/library"
          className="hover:text-primary transition-colors"
        >
          Perpustakaan
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
