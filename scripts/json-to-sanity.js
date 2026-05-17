/**
 * 🚀 NihongoRoute - JSON to Sanity CMS Migrator (with Auto-Furigana)
 * 
 * Membaca berkas .json hasil konversi md-to-json.js,
 * otomatis mengisi field furigana yang kosong menggunakan Kuroshiro,
 * menambahkan _key unik pada seluruh elemen array (wajib Sanity),
 * lalu mengunggah langsung ke Sanity CMS.
 * 
 * Penggunaan:
 *   node scripts/json-to-sanity.js <path-to-json>
 * 
 * Contoh:
 *   node scripts/json-to-sanity.js ./data/n5/bab-1.json
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { createClient } = require('@sanity/client');

// Muat .env.local
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error('❌ Error: Konfigurasi Sanity tidak ditemukan di .env.local.');
  console.error('Pastikan NEXT_PUBLIC_SANITY_PROJECT_ID dan SANITY_API_WRITE_TOKEN telah diset.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-05-17',
  token,
  useCdn: false,
});

const filePathArg = process.argv[2];

if (!filePathArg) {
  console.error('❌ Error: Harap masukkan path file JSON.');
  console.log('Penggunaan: node scripts/json-to-sanity.js ./data/n5/bab-1.json');
  process.exit(1);
}

const targetPath = path.resolve(filePathArg);
if (!fs.existsSync(targetPath)) {
  console.error(`❌ Error: File tidak ditemukan di ${targetPath}`);
  process.exit(1);
}

// ─── KEY GENERATOR ────────────────────────────────────────────────────────────

function generateKey() {
  return crypto.randomBytes(8).toString('hex');
}

function ensureSanityKeys(val) {
  if (Array.isArray(val)) {
    return val.map(item => {
      if (item && typeof item === 'object') {
        const newItem = ensureSanityKeys(item);
        if (!newItem._key) {
          newItem._key = generateKey();
        }
        return newItem;
      }
      return item;
    });
  } else if (val && typeof val === 'object') {
    const newObj = {};
    for (const key in val) {
      newObj[key] = ensureSanityKeys(val[key]);
    }
    return newObj;
  }
  return val;
}

// ─── KUROSHIRO AUTO-FURIGANA ──────────────────────────────────────────────────

let kuroshiroInstance = null;

async function initKuroshiro() {
  if (kuroshiroInstance) return kuroshiroInstance;

  const Kuroshiro = require('kuroshiro');
  const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');

  const KConstructor = Kuroshiro.default || Kuroshiro;
  const AConstructor = KuromojiAnalyzer.default || KuromojiAnalyzer;

  const instance = new KConstructor();
  const dictPath = path.join(process.cwd(), 'node_modules', 'kuromoji', 'dict');
  await instance.init(new AConstructor({ dictPath }));
  
  kuroshiroInstance = instance;
  return instance;
}

/**
 * Konversi teks Jepang ke hiragana menggunakan Kuroshiro.
 * Mengembalikan string kosong jika teks tidak berisi karakter Jepang.
 */
async function toFurigana(text) {
  if (!text || !text.trim()) return '';
  
  // Cek apakah ada karakter Jepang (Kanji/Katakana)
  const hasJapanese = /[\u4e00-\u9faf\u30a0-\u30ff]/.test(text);
  if (!hasJapanese) return text;

  const engine = await initKuroshiro();
  
  // Proses baris per baris untuk teks multiline
  const lines = text.split('\n');
  const results = [];
  for (const line of lines) {
    if (!line.trim()) {
      results.push('');
      continue;
    }
    try {
      const converted = await engine.convert(line, { to: 'hiragana', mode: 'normal' });
      results.push(converted);
    } catch {
      results.push(line);
    }
  }
  return results.join('\n');
}

/**
 * Melengkapi seluruh field furigana yang kosong di dalam payload.
 */
async function autoFillFurigana(payload) {
  let filled = 0;
  const blocks = payload.content_blocks || [];

  for (const block of blocks) {
    // grammarBlock: furigana dari content
    if (block._type === 'grammarBlock') {
      if (!block.furigana && block.content) {
        block.furigana = await toFurigana(block.content);
        filled++;
      }
      // examples
      if (Array.isArray(block.examples)) {
        for (const ex of block.examples) {
          if (!ex.furigana && ex.jp) {
            ex.furigana = await toFurigana(ex.jp);
            filled++;
          }
        }
      }
    }

    // dialogueBlock: furigana dari content
    if (block._type === 'dialogueBlock') {
      if (!block.furigana && block.content) {
        block.furigana = await toFurigana(block.content);
        filled++;
      }
    }
  }

  return filled;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`🚀 Memulai migrasi JSON ke Sanity: ${path.basename(targetPath)}...`);

  const rawJson = fs.readFileSync(targetPath, 'utf8');
  const payload = JSON.parse(rawJson);

  if (!payload._type || !payload._id) {
    console.error('❌ Error: JSON harus memiliki _type dan _id.');
    process.exit(1);
  }

  // Step 1: Auto-fill furigana
  console.log('✍️  Menginisialisasi Kuroshiro untuk Auto-Furigana...');
  const filledCount = await autoFillFurigana(payload);
  console.log(`✅ Auto-Furigana selesai: ${filledCount} field terisi otomatis.`);

  // Step 2: Tambahkan _key pada seluruh array items
  const keyedPayload = ensureSanityKeys(payload);

  console.log(`📦 Dokumen: "${keyedPayload.title}"`);
  console.log(`   ID       : ${keyedPayload._id}`);
  console.log(`   Blocks   : ${(keyedPayload.content_blocks || []).length}`);
  console.log(`   Quizzes  : ${(keyedPayload.quizzes || []).length}`);
  console.log(`📤 Mengirim ke Sanity [Dataset: ${dataset}]...`);

  try {
    const result = await client.createOrReplace(keyedPayload);
    console.log('✨────────────────────────────────────────────✨');
    console.log(`🎉 MIGRASI SUKSES!`);
    console.log(`   ID Dokumen : ${result._id}`);
    console.log(`   Judul      : ${result.title}`);
    console.log(`   Slug       : ${result.slug?.current || '-'}`);
    console.log(`   Total Blok : ${(result.content_blocks || []).length}`);
    console.log(`   Total Kuis : ${(result.quizzes || []).length}`);
    console.log('✨────────────────────────────────────────────✨');
  } catch (err) {
    console.error('❌ Gagal migrasi ke Sanity:', err.message);
    if (err.statusCode) console.error(`   Status: ${err.statusCode}`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('❌ Error fatal:', err.message);
  process.exit(1);
});
