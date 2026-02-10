import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-02-10", // Gunakan tanggal hari ini atau versi terbaru
  useCdn: false, // Set false agar data yang baru di-publish di Sanity langsung muncul tanpa delay cache
});
