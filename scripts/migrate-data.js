/**
 * @file migrate-data.js
 * @description Skrip migrasi data untuk NihongoRoute.
 * 1. Mengubah 'examples' (string[]) menjadi 'exampleSentence' (object[]).
 * 2. Mengubah field teks murni menjadi Portable Text (blockContent).
 * 
 * Jalankan dengan: node scripts/migrate-data.js
 */

const { createClient } = require('@sanity/client');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables dari .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qoczxvvo',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2024-04-12',
});

// KONFIGURASI
const DRY_RUN = false; // Set ke false untuk benar-benar menulis ke database
const BATCH_SIZE = 100;

// Generator ID acak untuk _key
const generateKey = () => Math.random().toString(36).substring(2, 12);

// Konverter String ke Portable Text (Block)
const stringToBlock = (text) => {
  if (!text || typeof text !== 'string') return text;
  return [{
    _type: 'block',
    children: [{ _type: 'span', text: text }],
    markDefs: [],
    style: 'normal'
  }];
};

async function migrate() {
  console.log(`🚀 Memulai Migrasi Data (${DRY_RUN ? 'MODE: DRY RUN - Tidak ada perubahan database' : 'MODE: LIVE - Melakukan penulisan data'})`);
  
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error('❌ Error: SANITY_API_WRITE_TOKEN tidak ditemukan di .env.local');
    process.exit(1);
  }

  // 1. Ambil semua dokumen yang mungkin butuh migrasi
  console.log('🔍 Mengambil dokumen...');
  const types = ['vocab', 'kanji', 'verb_dictionary', 'readingMaterial', 'lesson', 'grammar_article'];
  const query = `*[_type in $types]{ _id, _type, examples, body, translation, articles, content }`;
  const documents = await client.fetch(query, { types });

  console.log(`📦 Ditemukan ${documents.length} dokumen potensial.`);

  let migratedCount = 0;
  let batch = client.transaction();
  let currentBatchCount = 0;

  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i];
    let hasChanges = false;
    const patch = {};

    // --- LOGIKA 1: EXAMPLES (Vocab, Kanji, Verb) ---
    if (['vocab', 'kanji', 'verb_dictionary'].includes(doc._type)) {
      if (Array.isArray(doc.examples) && doc.examples.length > 0 && typeof doc.examples[0] === 'string') {
        patch.examples = doc.examples.map(ex => ({
          _type: 'exampleSentence',
          _key: generateKey(),
          jp: ex,
          id: 'Terjemahan menyusul (Migrated)'
        }));
        hasChanges = true;
      }
    }

    // --- LOGIKA 2: PORTABLE TEXT (Reading, Lesson, Grammar) ---
    const textFields = ['body', 'translation', 'articles', 'content'];
    textFields.forEach(field => {
      if (doc[field] && typeof doc[field] === 'string') {
        patch[field] = stringToBlock(doc[field]);
        hasChanges = true;
      }
    });

    if (hasChanges) {
      batch.patch(doc._id, { set: patch });
      currentBatchCount++;
      migratedCount++;

      // Progress log setiap 100 dokumen yang di-patch
      if (migratedCount % 100 === 0) {
        console.log(`⏳ Progress: ${migratedCount} dokumen disiapkan untuk patch...`);
      }
    }

    // Eksekusi batch jika sudah mencapai limit
    if (currentBatchCount >= BATCH_SIZE) {
      if (!DRY_RUN) {
        await batch.commit();
        console.log(`✅ Berhasil melakukan commit batch (${currentBatchCount} dokumen).`);
      } else {
        console.log(`📝 [Dry Run] Akan melakukan commit batch (${currentBatchCount} dokumen).`);
      }
      batch = client.transaction();
      currentBatchCount = 0;
    }
  }

  // Commit sisa dokumen
  if (currentBatchCount > 0) {
    if (!DRY_RUN) {
      await batch.commit();
      console.log(`✅ Berhasil melakukan commit batch terakhir (${currentBatchCount} dokumen).`);
    } else {
      console.log(`📝 [Dry Run] Akan melakukan commit batch terakhir (${currentBatchCount} dokumen).`);
    }
  }

  console.log('\n--- RINGKASAN MIGRASI ---');
  console.log(`Total Dokumen Diperiksa: ${documents.length}`);
  console.log(`Total Dokumen Dimigrasi: ${migratedCount}`);
  console.log(`Status: ${DRY_RUN ? 'SELESAI (Simulasi)' : 'SELESAI (Database Diperbarui)'}`);
  
  if (DRY_RUN && migratedCount > 0) {
    console.log('\n💡 Tip: Jika log di atas terlihat benar, ubah "DRY_RUN = false" di dalam skrip lalu jalankan kembali.');
  }
}

migrate().catch(err => {
  console.error('❌ Terjadi kesalahan fatal saat migrasi:', err);
  process.exit(1);
});
