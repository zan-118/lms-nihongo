import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY! || process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const WORDS_TO_RESTORE: Record<string, string[]> = {
  "探索": ["Noun", "Verb (Suru)", "Verb (Transitive)"],
  "悪化": ["Noun", "Verb (Suru)", "Verb (Intransitive)"]
};

async function restoreTransitivity() {
  console.log("Memulai pemulihan transitivitas untuk kosakata spesifik...");

  for (const [word, newHinshi] of Object.entries(WORDS_TO_RESTORE)) {
    // Ambil data kata
    const { data, error } = await supabase
      .from("vocab")
      .select("id, word, hinshi")
      .eq("word", word)
      .limit(1)
      .single();

    if (error || !data) {
      console.error(`Gagal menemukan kata: ${word}`, error);
      continue;
    }

    // Perbarui hinshi ke format baru yang ada transitivitasnya
    const { error: updateError } = await supabase
      .from("vocab")
      .update({ hinshi: newHinshi })
      .eq("id", data.id);

    if (updateError) {
      console.error(`Gagal memperbarui ${word}:`, updateError);
    } else {
      console.log(`[RESTORED] ${word}: ➔ ${JSON.stringify(newHinshi)}`);
    }
  }

  console.log("Selesai memulihkan transitivitas.");
}

restoreTransitivity();
