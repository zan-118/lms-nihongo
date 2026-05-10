/**
 * @file process-vocab.js
 * @description Skrip untuk memproses vocab_pass1.json menggunakan OpenRouter.
 * Dioptimalkan untuk akun gratis dengan pembersihan JSON ekstra.
 */

const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

if (!process.env.OPENROUTER_API_KEY) {
  console.error("❌ ERROR: OPENROUTER_API_KEY tidak ditemukan di .env.local");
  process.exit(1);
}

// BATCH_SIZE diturunkan ke 5 agar tidak memicu limit token "Unexpected end of JSON"
const BATCH_SIZE = 5; 
const INPUT_FILE = 'vocab_pass1.json';
const OUTPUT_FILE = 'vocab.ndjson';

async function processBatch(items) {
  const prompt = `Anda adalah pakar bahasa Jepang. Ubah data kosakata ini untuk Sanity CMS.
    
    DATA INPUT (JSON):
    ${JSON.stringify(items)}

    ATURAN:
    1. PitchAccent wajib (string angka, misal "0" atau "1").
    2. Jika hinshi "i-adjective" atau "na-adjective", isi: negative, past, pastNegative, teForm, adverbial.
    3. Generate "examples" (min 1: japanese, indonesian). Gunakan furigana bracket jika perlu.
    4. Generate "synonyms" dan "antonyms" (array).
    5. "mnemonic": Cerita singkat pengingat arti.
    6. "romaji": Konversi bacaan ke romaji standar.
    7. Pertahankan "_id" dan "word" asli.

    OUTPUT: Harus dalam format JSON ARRAY murni. Jangan ada teks penjelasan.`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://nihongoroute.my.id",
        "X-Title": "NihongoRoute Migration"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.5-flash-lite-preview-09-2025",
        "messages": [{ "role": "user", "content": prompt }],
        "temperature": 0.1,
        "max_tokens": 3000,
        "response_format": { "type": "json_object" } // Beberapa provider OpenRouter butuh ini
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    let text = data.choices[0].message.content.trim();
    
    // Pembersihan Markdown Code Blocks
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    // Strategi Ekstraksi JSON
    try {
      // Coba parse langsung
      return JSON.parse(text);
    } catch (parseError) {
      console.log("⚠️ Parsing gagal, mencoba pembersihan lanjutan...");
      
      // Temukan array [ ... ]
      const startIdx = text.indexOf('[');
      const endIdx = text.lastIndexOf(']');
      
      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        const potentialJson = text.substring(startIdx, endIdx + 1);
        try {
          return JSON.parse(potentialJson);
        } catch (e) {
          // Jika masih gagal, mungkin terpotong di tengah object.
          // Coba ambil object-object yang lengkap saja.
          const objects = [];
          const matches = potentialJson.matchAll(/\{[\s\S]*?\}/g);
          for (const match of matches) {
            try {
              objects.push(JSON.parse(match[0]));
            } catch (innerE) {
              // Lewati object yang tidak valid (terpotong)
            }
          }
          if (objects.length > 0) return objects;
        }
      }
      throw new Error(`Gagal memproses JSON: ${parseError.message}`);
    }
  } catch (error) {
    console.error(`❌ Batch Error: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log("🚀 Memulai Migrasi Kosakata...");
  
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ ERROR: File ${INPUT_FILE} tidak ditemukan.`);
    return;
  }

  const rawData = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
  console.log(`📦 Total data mentah: ${rawData.length} item.`);

  // Gabungkan dengan data lama jika ada
  let processedData = [];
  let processedIds = new Set();
  
  if (fs.existsSync(OUTPUT_FILE)) {
    const lines = fs.readFileSync(OUTPUT_FILE, 'utf8').split('\n').filter(Boolean);
    lines.forEach(line => {
      try {
        const obj = JSON.parse(line);
        processedIds.add(obj._id);
      } catch (e) {}
    });
  }

  const itemsToProcess = rawData.filter(item => !processedIds.has(item._id));
  console.log(`📊 Item tersisa untuk diproses: ${itemsToProcess.length}`);

  if (itemsToProcess.length === 0) {
    console.log("✅ Semua data sudah selesai diproses!");
    return;
  }

  const totalBatches = Math.ceil(itemsToProcess.length / BATCH_SIZE);

  for (let i = 0; i < totalBatches; i++) {
    const batch = itemsToProcess.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
    console.log(`⏳ [${i + 1}/${totalBatches}] Memproses batch berisi ${batch.length} item...`);
    
    const startTime = Date.now();
    const result = await processBatch(batch);
    
    if (result && Array.isArray(result)) {
      let savedCount = 0;
      result.forEach(item => {
        if (item._id && item.word) {
          fs.appendFileSync(OUTPUT_FILE, JSON.stringify(item) + '\n');
          savedCount++;
        }
      });
      console.log(`✅ Berhasil menyimpan ${savedCount} item. (Durasi: ${((Date.now() - startTime)/1000).toFixed(1)}s)`);
    } else {
      console.log(`⚠️ Batch gagal diproses. Melewati...`);
    }

    // Cooldown untuk menghindari rate limit (Gemini Flash Lite Free)
    if (i < totalBatches - 1) {
      const waitTime = 8000; // 8 detik
      console.log(`💤 Menunggu ${waitTime/1000}s untuk batch berikutnya...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  console.log("🏁 Migrasi Selesai!");
}

main().catch(error => {
  console.error("💀 Fatal Error:", error);
  process.exit(1);
});