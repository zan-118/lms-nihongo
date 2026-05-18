import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testFilter() {
  const search = "verb, noun";
  const safeSearch = search.replace(/"/g, '\\"');
  
  const orStr = `word.ilike."%${safeSearch}%",meaning_id.ilike."%${safeSearch}%"`;
  console.log("finalOr:", orStr);
  const { data: data2, error: err2 } = await supabase
    .from("vocab")
    .select("word, meaning_id")
    .or(orStr)
    .limit(3);
  console.log("Result 2:", data2, err2?.message);
}

testFilter();
