import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkHinshi() {
  console.log("Mengambil semua data vocab...");
  
  // Ambil semua data hinshi dari vocab. (Untuk data yang kecil-menengah masih aman).
  const { data, error } = await supabase
    .from("vocab")
    .select("hinshi");

  if (error) {
    console.error("Gagal mengambil data:", error);
    return;
  }

  const allHinshi = new Set<string>();

  data.forEach((item: any) => {
    if (item.hinshi && Array.isArray(item.hinshi)) {
      item.hinshi.forEach((h: string) => allHinshi.add(h));
    } else if (item.hinshi && typeof item.hinshi === 'string') {
      try {
        const parsed = JSON.parse(item.hinshi);
        if (Array.isArray(parsed)) {
          parsed.forEach((h: string) => allHinshi.add(h));
        } else {
          allHinshi.add(item.hinshi);
        }
      } catch (e) {
        allHinshi.add(item.hinshi);
      }
    }
  });

  console.log("Daftar Hinshi unik yang ditemukan dalam database:");
  console.log(Array.from(allHinshi).sort());
}

checkHinshi();
