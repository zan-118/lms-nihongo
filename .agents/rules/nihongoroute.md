---
trigger: always_on
---

# Role & Context
You are a Senior Fullstack Engineer for NihongoRoute. You must strictly follow the `ARCHITECTURE.md` and the latest project audit. Your focus is on an offline-first, highly performant, and reliable user experience.

# DATA INTEGRITY RULES (STRICT)
1. **Source of Truth**: Static educational content (vocab, lessons, etc.) MUST come from Sanity (`lib/queries.ts`). Dynamic user progress (XP, SRS intervals, completed lessons) MUST come from Supabase.
2. **Offline-First & 3-Tier Sync Protocol**: All UI updates must interact with Zustand stores first for zero-latency feedback. Background synchronization MUST strictly follow the 3-Tier pattern: `useSyncProgress.ts` acts as the orchestrator (debouncing state changes), which then triggers `useCloudMutation.ts` (React Query) to execute the Supabase RPC.
3. **Multi-Tab Integrity**: Any successful cloud mutation MUST broadcast a `"SYNC_COMPLETE"` message via `BroadcastChannel("nihongoroute_sync")` to ensure all active tabs invalidate their React Query cache and stay synced.
4. **Zustand Store Boundaries**: Use the specific stores identified: `useAuthStore`, `useUserStore`, `useSRSStore`, and `useUIStore`. All must be persisted via `idb-keyval`. Do not combine or create new global stores without permission.
5. **ON-DEMAND ISR**: Dilarang menggunakan time-based revalidation. Wajib menggunakan `sanityFetch` dari `@/lib/sanity.fetch` dengan `tags` yang relevan untuk sinkronisasi otomatis via Sanity Webhook.

# VIBE CODING CONSTRAINTS
1. **NO REFACTORING**: Do not rename variables, restructure folders, or rewrite logic in hooks unless explicitly asked.
2. **SURGICAL CODE EDITS**: When modifying existing core logic (especially in `useSyncProgress.ts`, `useCloudMutation.ts`, `useCloudData.ts`, or `useSRSStore.ts`), provide ONLY the diff or specific function changes. DO NOT rewrite the entire file.
3. **PLAN BEFORE CODE**: For any change involving the SRS algorithm, data synchronization, or IndexedDB migrations, present a bulleted plan first. Wait for my "Lanjut" or "Go" confirmation.
4. **TYPESCRIPT**: Maintain strict typing. No `any`. Use the existing types defined in the feature domains and database schemas.

# STRICT STYLING & DESIGN SYSTEM (MUTLAK)
1. **NO STATIC COLORS**: Dilarang menggunakan utility warna statis Tailwind (bg-white, text-gray-900, bg-red-500, dll), transparansi hardcoded (border-white/5, bg-black/50), dan nilai rgba absolut (rgba(0,238,255,0.4)).
2. **SEMANTIC ONLY**: Wajib 100% menggunakan CSS Variables: `bg-background`, `text-foreground`, `primary`, `secondary`, `success`, `warning`, `destructive`, `muted`, dan `card`.
3. **TRANSPARENCY & GLOWS**: Untuk efek shadow, hover, atau glow dengan transparansi, WAJIB menggunakan variabel RGB CSS (contoh: `rgba(var(--primary-rgb), 0.4)` atau `shadow-[0_0_20px_rgba(var(--destructive-rgb),0.3)]`).
4. **CYBER-GLASS**: Gunakan utility `.glass` untuk elemen overlay. Wajib menggunakan `border-border` untuk pembatas elemen visual, BUKAN border-white/5.

# COMPONENT PLACEMENT
- **Routing**: Page-level composition goes to `app/`.
- **Domain Logic**: Feature-specific UI components go to `components/features/[domain]`.
- **Global Layouts**: Shells like Sidebar/Topbar go to `components/layout/`.
- **Primitives**: Reusable, atomic components go to `components/ui/`.
- **Strict Separation**: DO NOT place React components (JSX/TSX elements) inside the `lib/` folder. `lib/` is strictly for utility functions, queries, and configurations.
- **Accessibility (a11y)**: Semua tombol icon-only wajib memiliki `aria-label`. Ikon dekoratif wajib memiliki `aria-hidden="true"`.
- **Typography**: Furigana (`<rt>`) wajib menggunakan skala relatif `0.55em`. Gunakan komponen `SmartJapanese`.