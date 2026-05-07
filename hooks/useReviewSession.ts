"use client";

import { useState, useMemo, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { offlineCache } from "@/lib/offlineCache";
import { MasterCardData } from "@/components/features/flashcards/master/types";
import { useSRSStore } from "@/store/useSRSStore";

export type SessionMode = "srs" | "quick" | null;

export function useReviewSession(loading: boolean) {
  const srs = useSRSStore((state) => state.srs);
  const [mode, setMode] = useState<SessionMode>(null);
  const [cards, setCards] = useState<MasterCardData[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Hitung jumlah kartu yang jatuh tempo (due)
  const dueItemIds = useMemo(() => {
    const now = Date.now();
    return Object.entries(srs || {})
      .filter(([, state]) => state.nextReview <= now)
      .map(([id]) => id);
  }, [srs]);

  const allItemIds = useMemo(() => Object.keys(srs || {}), [srs]);

  const startSession = async (selectedMode: SessionMode) => {
    if (!selectedMode) return;
    
    try {
      setIsFetching(true);
      setMode(selectedMode);
      setIsFinished(false);

      let targetIds: string[] = [];
      
      if (selectedMode === "srs") {
        targetIds = dueItemIds;
      } else {
        // Quick mode: ambil 10 kartu acak dari koleksi
        targetIds = [...allItemIds].sort(() => Math.random() - 0.5).slice(0, 10);
      }

      if (targetIds.length === 0) {
        setCards([]);
        setIsFetching(false);
        return;
      }

      let data: MasterCardData[] = [];
      try {
        const query = `*[_id in $ids] {
          _id,
          "word": coalesce(jisho, word),
          meaning,
          romaji,
          furigana,
          category,
          kanjiDetails
        }`;
        data = await client.fetch<MasterCardData[]>(query, { ids: targetIds });
        offlineCache.saveCards(data);
      } catch (cmsError) {
        console.warn("CMS Offline, menggunakan cache lokal...");
        data = offlineCache.getCards(targetIds);
        if (data.length > 0) {
          toast.info("Mode Offline Aktif");
        } else {
          throw cmsError;
        }
      }
      
      setCards(data.sort(() => Math.random() - 0.5));
    } catch (error) {
      console.error("Gagal memulai sesi:", error);
      toast.error("Gagal memuat kartu");
      setMode(null);
    } finally {
      setIsFetching(false);
    }
  };

  // Auto-start berdasarkan query params
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") as SessionMode;

  useEffect(() => {
    if (initialMode && (initialMode === "srs" || initialMode === "quick") && !mode && !loading) {
      startSession(initialMode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMode, loading]);

  return {
    mode,
    setMode,
    cards,
    isFetching,
    isFinished,
    setIsFinished,
    dueItemIds,
    allItemIds,
    startSession
  };
}
