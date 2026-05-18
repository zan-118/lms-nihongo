/**
 * 🌀 NihongoRoute - Batch Lesson Converter and Migrator
 * 
 * Skrip pembantu untuk memproses massal konversi Markdown N5 (Bab 4-20)
 * menjadi berkas JSON Sanity payload, lalu mengunggah seluruh Bab 1-20
 * ke dataset Sanity CMS dengan otomatisasi furigana Kuroshiro.
 * 
 * Penggunaan:
 *   node scripts/convert-and-import-all.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function run() {
  console.log("====================================================================");
  console.log("🌀 MEMULAI BATCH MIGRASI KONTEN PELAJARAN NIHONGOROUTE (N5)...");
  console.log("====================================================================");

  // 1. Upload bab-1, bab-2, bab-3 yang file JSON-nya sudah siap
  const existingJsonFiles = [
    { num: 1, path: './data/n5/bab-1.json' },
    { num: 2, path: './data/n5/bab-2.json' },
    { num: 3, path: './data/n5/bab-3.json' }
  ];

  for (const item of existingJsonFiles) {
    const fullPath = path.resolve(item.path);
    if (fs.existsSync(fullPath)) {
      console.log(`\n📤 [Bab ${item.num}] Mengunggah JSON yang sudah ada ke Sanity...`);
      try {
        execSync(`node scripts/json-to-sanity.js "${fullPath}"`, { stdio: 'inherit' });
        console.log(`✅ [Bab ${item.num}] Sukses diunggah.`);
      } catch (err) {
        console.error(`❌ [Bab ${item.num}] Gagal mengunggah JSON:`, err.message);
      }
    } else {
      console.log(`⚠️  [Bab ${item.num}] File JSON tidak ditemukan di ${fullPath}. Lewati.`);
    }
  }

  // 2. Konversi dan upload Bab 4 sampai Bab 20
  for (let i = 4; i <= 20; i++) {
    const mdPath = path.resolve(`./data/n5/bab-${i}.md`);
    const jsonPath = path.resolve(`./data/n5/bab-${i}.json`);

    if (!fs.existsSync(mdPath)) {
      console.log(`\n⚠️  [Bab ${i}] File MD tidak ditemukan di ${mdPath}. Lewati.`);
      continue;
    }

    console.log(`\n🌀 [Bab ${i}] Memulai pengolahan...`);
    
    // Baca berkas untuk mengekstrak judul
    const content = fs.readFileSync(mdPath, 'utf8');
    const lines = content.split('\n');
    let title = '';
    for (let line of lines) {
      line = line.trim();
      if (line.startsWith('### Bab')) {
        const match = line.match(/###\s*Bab\s*\d+:\s*(.*)/i);
        if (match) {
          title = match[1].trim();
          break;
        }
      }
    }

    if (!title) {
      console.log(`⚠️  [Bab ${i}] Pola "### Bab X: Judul" tidak ditemukan, mencari baris header "###" pertama...`);
      for (let line of lines) {
        line = line.trim();
        if (line.startsWith('### ')) {
          title = line.replace('### ', '').trim();
          break;
        }
      }
    }

    if (!title) {
      title = `Pelajaran ${i}`;
      console.log(`⚠️  [Bab ${i}] Gagal mengekstrak judul secara spesifik. Menggunakan cadangan: "${title}"`);
    } else {
      console.log(`📌 [Bab ${i}] Judul diekstrak: "${title}"`);
    }

    // Langkah A: Konversi MD ke JSON
    try {
      console.log(`🔄 [Bab ${i}] Mengonversi Markdown menjadi JSON...`);
      execSync(`node scripts/md-to-json.js "${mdPath}" ${i} "${title}"`, { stdio: 'inherit' });
    } catch (err) {
      console.error(`❌ [Bab ${i}] Gagal konversi MD ke JSON:`, err.message);
      continue;
    }

    // Langkah B: Import JSON ke Sanity
    if (fs.existsSync(jsonPath)) {
      try {
        console.log(`📤 [Bab ${i}] Mengunggah berkas JSON hasil konversi ke Sanity...`);
        execSync(`node scripts/json-to-sanity.js "${jsonPath}"`, { stdio: 'inherit' });
        console.log(`✅ [Bab ${i}] Berhasil dikonversi dan diunggah ke Sanity.`);
      } catch (err) {
        console.error(`❌ [Bab ${i}] Gagal mengunggah JSON ke Sanity:`, err.message);
      }
    } else {
      console.error(`❌ [Bab ${i}] File JSON tidak ditemukan di ${jsonPath} setelah proses konversi!`);
    }
  }

  console.log("\n====================================================================");
  console.log("🎉 SELURUH BATCH KONVERSI DAN MIGRASI SANITY TELAH SELESAI!");
  console.log("====================================================================");
}

run();
