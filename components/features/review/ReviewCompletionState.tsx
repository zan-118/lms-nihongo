"use client";

import React from "react";
import { Sparkles, Trophy } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

interface ReviewCompletionStateProps {
  mode: "srs" | "quick";
  onBack: () => void;
}

/**
 * Tampilan saat sesi review selesai atau tidak ada kartu yang perlu direview.
 */
export function ReviewCompletionState({ mode, onBack }: ReviewCompletionStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 w-full">
      <EmptyState 
        icon={mode === "srs" ? Sparkles : Trophy}
        title={mode === "srs" ? "Ingatan Terjaga!" : "Latihan Selesai"}
        description={mode === "srs" 
          ? "Kamu sudah menyelesaikan semua review yang jatuh tempo. Ingatanmu masih sangat tajam!" 
          : "Bagus! Kamu baru saja menyelesaikan sesi latihan cepat. Mau coba sesi lainnya?"}
        actionText="Kembali ke Menu"
        onClick={onBack}
      />
    </div>
  );
}
