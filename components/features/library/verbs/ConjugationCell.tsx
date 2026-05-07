"use client";

import React from "react";

interface ConjugationCellProps {
  label: string;
  value?: string;
}

/**
 * Komponen sel matriks konjugasi untuk detail kata kerja.
 */
export function ConjugationCell({ label, value }: ConjugationCellProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] md:text-xs font-black text-primary/90 uppercase tracking-widest leading-tight line-clamp-2 min-h-[2em]">
        {label}
      </span>
      <div className="p-3 md:p-4 rounded-2xl bg-muted/50 border border-border hover:border-primary/40 transition-all duration-300 group/cell flex items-center justify-center min-h-[4rem] shadow-sm">
        <p className="text-base md:text-lg font-japanese font-black text-foreground text-center leading-none group-hover/cell:text-primary transition-colors">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}
