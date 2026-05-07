"use client";

import { useMutation } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/store/useUserStore";
import { useSRSStore } from "@/store/useSRSStore";
import { useUIStore } from "@/store/useUIStore";
import { SRSState } from "@/lib/srs";
import { Inventory, Settings } from "@/store/types";
import { Session } from "@supabase/supabase-js";

export function useCloudMutation(session: Session | null | undefined) {
  const supabase = createClient();
  const setSyncing = useUIStore((s) => s.setSyncing);
  const setSyncError = useUIStore((s) => s.setSyncError);
  const clearDirtySrs = useSRSStore((s) => s.clearDirtySrs);

  const syncMutation = useMutation({
    mutationFn: async (data: { 
      progress: { 
        name: string | null, 
        xp: number, 
        streak: number, 
        todayReviewCount: number, 
        lastStudyDate: string | null, 
        studyDays: Record<string, number>, 
        inventory: Inventory, 
        settings: Settings,
        srs: Record<string, SRSState>
      }, 
      dirtySrs: Set<string> 
    }) => {
      setSyncing(true);
      if (!session?.user) return;

      const { progress, dirtySrs } = data;

      const srsUpdates = Array.from(dirtySrs)
        .filter(id => progress.srs[id])
        .map(id => {
          const state = progress.srs[id];
          return {
            word_id: id,
            repetition: state.repetition,
            interval: state.interval,
            ease_factor: state.easeFactor,
            next_review: new Date(state.nextReview).toISOString(),
            updated_at: new Date(state.updatedAt).toISOString(),
            status: state.interval > 21 ? 'graduated' : (state.interval > 1 ? 'reviewing' : 'learning'),
            is_deleted: !!state.isDeleted
          };
        });

      const { data: rpcData, error: rpcError } = await supabase.rpc('sync_user_progress', {
        p_full_name: progress.name,
        p_xp: progress.xp,
        p_streak: progress.streak,
        p_today_review_count: progress.todayReviewCount,
        p_last_study_date: progress.lastStudyDate,
        p_study_days: progress.studyDays,
        p_inventory: progress.inventory,
        p_settings: progress.settings,
        p_srs_updates: srsUpdates
      });

      if (rpcError) throw rpcError;

      const acceptedXp = (rpcData as { accepted_xp?: number })?.accepted_xp;

      return { success: true, syncedWordIds: Array.from(dirtySrs), acceptedXp };
    },
    onSuccess: (result) => {
      setSyncing(false);
      setSyncError(false);
      if (result?.success && result.syncedWordIds) {
        clearDirtySrs(result.syncedWordIds);
        
        if (result.acceptedXp !== undefined) {
          useUserStore.getState().setGamification({ xp: result.acceptedXp });
        }
        
        if (typeof window !== "undefined" && "BroadcastChannel" in window) {
          const channel = new BroadcastChannel("nihongoroute_sync");
          channel.postMessage("SYNC_COMPLETE");
          channel.close();
        }
      }
    },
    onError: (error) => {
      console.error("Sync failed after retries:", error);
      setSyncing(false);
      setSyncError(true);
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  return syncMutation;
}
