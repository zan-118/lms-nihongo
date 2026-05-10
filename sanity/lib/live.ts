/**
 * @file sanity/lib/live.ts
 * @description Sanity Live Content API — Khusus untuk real-time preview di Sanity Studio.
 *
 * ⚠️  PERHATIAN — Dua implementasi `sanityFetch` yang berbeda:
 *
 * 1. `sanity/lib/live.ts` (file ini)
 *    - Gunakan untuk: Real-time content preview & Sanity Studio integration.
 *    - Cara kerja: Menggunakan Sanity Live Content API (WebSocket-based updates).
 *
 * 2. `lib/sanity.fetch.ts` ← STANDAR untuk Production Pages
 *    - Gunakan untuk: Semua Server Components & API Routes di App Router.
 *    - Cara kerja: Next.js fetch + `tags` untuk On-Demand ISR via Sanity Webhook.
 *    - Import: `import { sanityFetch } from "@/lib/sanity.fetch";`
 */
// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { defineLive } from "next-sanity/live";
import { client } from './client'

export const { sanityFetch, SanityLive } = defineLive({
  client,
});
