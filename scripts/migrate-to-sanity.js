/**
 * 🌀 NihongoRoute - Sanity CMS Migration Script
 * 
 * Skrip ini membaca berkas Markdown pelajaran tersinkronisasi (yang memiliki YAML Frontmatter),
 * memvalidasi struktur datanya, menghasilkan key unik (_key) untuk elemen-elemen array
 * guna mematuhi spesifikasi Sanity, lalu mengunggahnya langsung ke Sanity CMS menggunakan API Write Token.
 * 
 * Penggunaan:
 *   node scripts/migrate-to-sanity.js <path-to-markdown-file>
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const crypto = require('crypto');
const { createClient } = require('@sanity/client');

// Muat berkas .env.local untuk mendapatkan token API dan Project ID
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error('❌ Error: Konfigurasi Sanity tidak ditemukan di .env.local.');
  console.error('Pastikan NEXT_PUBLIC_SANITY_PROJECT_ID dan SANITY_API_WRITE_TOKEN telah diset.');
  process.exit(1);
}

// Inisialisasi Klien Sanity dengan hak akses menulis (token write)
const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-05-17',
  token,
  useCdn: false, // Wajib false untuk proses mutasi/menulis data
});

const filePathArg = process.argv[2];

if (!filePathArg) {
  console.error('❌ Error: Harap masukkan path file markdown pelajaran.');
  console.log('Penggunaan: node scripts/migrate-to-sanity.js ./data/n5/bab-1.md');
  process.exit(1);
}

const targetPath = path.resolve(filePathArg);
if (!fs.existsSync(targetPath)) {
  console.error(`❌ Error: File tidak ditemukan di ${targetPath}`);
  process.exit(1);
}

console.log(`🚀 Memulai migrasi berkas ke Sanity: ${path.basename(targetPath)}...`);

// ─── HELPER KEY GENERATOR (Wajib bagi Sanity Array Items) ─────────────────────

function generateKey() {
  return crypto.randomBytes(8).toString('hex');
}

// Rekursif menambahkan _key untuk seluruh objek di dalam array
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

// ─── PROSES PEMBACAAN DAN EKSTRAKSI ───────────────────────────────────────────

try {
  const content = fs.readFileSync(targetPath, 'utf8');
  
  // Ekstrak frontmatter di antara pembatas ---
  const match = content.match(/^---([\s\S]*?)---/);
  if (!match) {
    console.error('❌ Error: Format YAML Frontmatter tidak ditemukan.');
    console.log('Harap jalankan "node scripts/reconcile-lesson.js" terlebih dahulu untuk menyelaraskannya.');
    process.exit(1);
  }

  const yamlString = match[1];
  const frontmatter = yaml.load(yamlString);

  if (!frontmatter.title || !frontmatter.slug) {
    console.error('❌ Error: Metadata wajib (title, slug) tidak lengkap dalam frontmatter.');
    process.exit(1);
  }

  console.log('📦 Menyiapkan payload dokumen untuk Sanity...');

  // Siapkan dan tambahkan key unik untuk array
  const keyedContentBlocks = ensureSanityKeys(frontmatter.content_blocks || []);
  const keyedQuizzes = ensureSanityKeys(frontmatter.quizzes || []);

  const documentPayload = {
    _type: 'lesson',
    _id: `lesson-${frontmatter.slug}`, // ID deterministik agar aman dari konflik duplikasi
    title: frontmatter.title,
    slug: {
      _type: 'slug',
      current: frontmatter.slug
    },
    order_number: frontmatter.order_number || 0,
    category_id: frontmatter.category_id || 'N5-Course',
    summary: frontmatter.summary || '',
    estimated_minutes: frontmatter.estimated_minutes || 10,
    is_premium: !!frontmatter.is_premium,
    is_published: !!frontmatter.is_published,
    
    // Relasi Supabase
    vocab_list: frontmatter.vocab_list || [],
    kanji_list: frontmatter.kanji_list || [],
    grammar_list: frontmatter.grammar_list || [],
    reading_list: frontmatter.reading_list || [],
    listening_list: frontmatter.listening_list || [],
    
    // SEO Metadata
    seo: frontmatter.seo ? {
      _type: 'object',
      title: frontmatter.seo.title || '',
      description: frontmatter.seo.description || '',
      keywords: frontmatter.seo.keywords || ''
    } : undefined,
    
    // Rich Text & Quizzes
    content_blocks: keyedContentBlocks,
    quizzes: keyedQuizzes
  };

  console.log(`📤 Mengirim dokumen "${documentPayload.title}" ke Sanity [Dataset: ${dataset}]...`);

  // Eksekusi mutasi ke Sanity CMS
  client.createOrReplace(documentPayload)
    .then((result) => {
      console.log('✨--------------------------------------------------------✨');
      console.log(`🎉 MIGRASI SUKSES! Pelajaran berhasil diunggah.`);
      console.log(`ID Dokumen : ${result._id}`);
      console.log(`Judul      : ${result.title}`);
      console.log(`Slug       : ${result.slug.current}`);
      console.log(`Total Blok : ${result.content_blocks.length}`);
      console.log(`Total Kuis : ${result.quizzes.length}`);
      console.log('✨--------------------------------------------------------✨');
    })
    .catch((err) => {
      console.error('❌ Gagal melakukan migrasi ke Sanity API:', err.message);
      process.exit(1);
    });

} catch (error) {
  console.error('❌ Error saat memproses file:', error.message);
  process.exit(1);
}
