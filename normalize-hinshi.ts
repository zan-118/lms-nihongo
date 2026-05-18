import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY! || process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const MAPPING: Record<string, string> = {
  "n": "Noun",
  "adv": "Adverb",
  "adj-na": "Na-Adjective",
  "adj-no": "Noun", // often acts as a noun modifier
  "vi": "Verb",
  "vt": "Verb",
  "vs": "Verb"
};

async function normalizeHinshi() {
  console.log("Mulai membersihkan data hinshi di tabel vocab...");
  
  // Mengambil ID dan hinshi dari semua vocab
  const { data: vocabs, error } = await supabase
    .from("vocab")
    .select("id, word, hinshi");

  if (error) {
    console.error("Gagal mengambil vocab:", error);
    return;
  }

  let updatedCount = 0;

  for (const vocab of vocabs) {
    if (!vocab.hinshi) continue;

    let hinshiArray: string[] = [];

    // Parse data hinshi (bisa berupa array atau string JSON atau string biasa)
    if (Array.isArray(vocab.hinshi)) {
      hinshiArray = [...vocab.hinshi];
    } else if (typeof vocab.hinshi === 'string') {
      try {
        const parsed = JSON.parse(vocab.hinshi);
        if (Array.isArray(parsed)) {
          hinshiArray = parsed;
        } else {
          hinshiArray = [vocab.hinshi];
        }
      } catch (e) {
        // Jika gagal parse JSON, anggap itu string mentah, ubah jadi array
        hinshiArray = [vocab.hinshi];
      }
    }

    let isModified = false;
    const normalizedSet = new Set<string>();

    for (const h of hinshiArray) {
      const cleanH = h.trim();
      const mappedValue = MAPPING[cleanH];
      
      if (mappedValue) {
        normalizedSet.add(mappedValue);
        isModified = true;
      } else {
        normalizedSet.add(cleanH);
      }
    }

    const normalizedArray = Array.from(normalizedSet);

    // Cek apakah array asli dan array baru sama persis
    const isSameLength = hinshiArray.length === normalizedArray.length;
    const isSameElements = hinshiArray.every(v => normalizedArray.includes(v));

    if (isModified || !isSameLength || !isSameElements) {
      // Perbarui ke database
      const { error: updateError } = await supabase
        .from("vocab")
        .update({ hinshi: normalizedArray })
        .eq("id", vocab.id);

      if (updateError) {
        console.error(`Gagal memperbarui vocab ${vocab.word} (ID: ${vocab.id}):`, updateError);
      } else {
        console.log(`[UPDATED] ${vocab.word}: ${JSON.stringify(hinshiArray)} ➔ ${JSON.stringify(normalizedArray)}`);
        updatedCount++;
      }
    }
  }

  console.log(`\nPembersihan selesai! Total vocab yang diperbarui: ${updatedCount}`);
}

normalizeHinshi();
