/**
 * 🌀 NihongoRoute - Smart Lesson Reconciler Script
 * 
 * Skrip ini menganalisis file Markdown pelajaran mentah (raw markdown)
 * dan secara otomatis memformatnya menjadi berkas Markdown tersinkronisasi 
 * dengan skema Sanity (YAML Frontmatter berisi content_blocks, quizzes, metadata, dll.).
 * 
 * Penggunaan:
 *   node scripts/reconcile-lesson.js <path-to-markdown-file> [order-number]
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Ambil argumen file
const filePathArg = process.argv[2];
const orderNumArg = process.argv[3] ? parseInt(process.argv[3], 10) : 1;

if (!filePathArg) {
  console.error('❌ Error: Harap masukkan path file markdown pelajaran.');
  console.log('Penggunaan: node scripts/reconcile-lesson.js ./data/n5/bab-1.md [order_number]');
  process.exit(1);
}

const targetPath = path.resolve(filePathArg);
if (!fs.existsSync(targetPath)) {
  console.error(`❌ Error: File tidak ditemukan di ${targetPath}`);
  process.exit(1);
}

const rawContent = fs.readFileSync(targetPath, 'utf8');

console.log(`🌀 Memulai penyelarasan berkas: ${path.basename(targetPath)}...`);

// ─── UTILS PARSING ────────────────────────────────────────────────────────────

// Pemisahan seksi materi berdasarkan subjudul utama (#### X. atau ## X. dengan opsional emoji)
function getSectionContent(content, sectionNum) {
  const regex = new RegExp(
    `(?:####|##)[^\\d\\n]*${sectionNum}\\.[\\s\\S]*?(?=(?:####|##)[^\\d\\n]*${sectionNum + 1}\\.|$)`,
    'i'
  );
  const match = content.match(regex);
  return match ? match[0] : '';
}


// ─── PARSING LANGKAH DEMI LANGKAH ─────────────────────────────────────────────

// 1. Dapatkan Judul Pelajaran
let title = "Bab Baru";
const titleMatch = rawContent.match(/(?:#|####)\s+Bab\s+(\d+[:\s\w-]*)/i) || rawContent.match(/(?:#|####)\s+1\.\s+Tujuan[\s\S]*?/i);
if (titleMatch) {
  title = titleMatch[0].replace(/[#\d\.]+/g, '').trim();
}
// Fallback nama file
if (!title || title.includes("Tujuan")) {
  const baseName = path.basename(targetPath, '.md');
  title = baseName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

const slug = path.basename(targetPath, '.md');

// 2. Tujuan Belajar (Section 1)
const sec1 = getSectionContent(rawContent, 1);
let summary = "Ringkasan materi pelajaran.";
const objectives = [];
if (sec1) {
  const objectiveLines = sec1.split('\n');
  const bulletLines = objectiveLines.filter(line => line.trim().startsWith('*') || line.trim().startsWith('-') || line.trim().startsWith('•'));
  bulletLines.forEach(line => {
    objectives.push(line.replace(/^[\s*\-•]+/, '').trim());
  });
  
  const introMatch = sec1.match(/(?:Objectives\)|Tujuan Belajar\))\s*\n+([\s\S]*?)(?=\*|\-|\b|$)/i);
  if (introMatch && introMatch[1]) {
    summary = introMatch[1].trim();
  }
}

// 3. Bedah Kosakata & Relasi Kosakata (Section 2)
const sec2 = getSectionContent(rawContent, 2);
const vocabList = [];
if (sec2) {
  const vocabLines = sec2.split('\n');
  vocabLines.forEach(line => {
    // 1. Coba cocokkan format tebal: 1. **Kanji (Hiragana - Romaji)** : Arti
    let match = line.match(/^\s*(?:\d+\.|\*)\s*\*\*(.*?)\*\*\s*:\s*(.*)/);
    if (!match) {
      // 2. Coba cocokkan format tanpa tebal: 1. Kanji (Hiragana - Romaji) : Arti
      match = line.match(/^\s*(?:\d+\.|\*)\s*([^\s(:]+)(?:\s*\(([^)]+)\))?\s*:\s*(.*)/);
    }
    
    if (match) {
      const termWithReading = match[1].trim();
      // Ambil bagian sebelum tanda kurung '('
      const jpTerm = termWithReading.split('(')[0].trim();
      
      if (jpTerm && jpTerm !== "Format" && jpTerm !== "*Format" && !jpTerm.includes("Kelompok")) {
        vocabList.push(jpTerm.replace(/^[～~]/, '').trim());
      }
    }
  });
}

// 4. Tata Bahasa (Section 3)
const sec3 = getSectionContent(rawContent, 3);
const grammarList = [];
const grammarBlocks = [];
if (sec3) {
  // Pecah per tata bahasa berdasarkan pattern "### **[A-Z]."
  const points = sec3.split(/\n\s*(?=###\s*\*\*\s*[A-Z]\.)/g);
  points.forEach(point => {
    const titleMatch = point.match(/###\s*\*\*\s*([A-Z]\.\s+.*?)\s*\*\*/);
    if (titleMatch) {
      const gTitle = titleMatch[1].trim();
      const gCleanName = gTitle.replace(/^[A-Z]\.\s+(?:Pola Dasar:|Pola Negatif:|Pola Interogatif:|Partikel Kesetaraan:|Partikel Modifikasi:|Pola\s+)?/i, '').trim();
      
      // Ambil rumus bersih (setelah tanda titik dua : jika ada)
      let formula = gCleanName;
      if (gTitle.includes(':')) {
        formula = gTitle.split(':').slice(1).join(':').trim();
      }
      formula = formula.replace(/[\*\*]+/g, '').trim();
      grammarList.push(formula);

      // Cari fungsi
      let translation = "";
      const fungsiMatch = point.match(/\*\s*\*?Fungsi\*?:\s*(.*)/i);
      if (fungsiMatch) {
        translation = fungsiMatch[1].replace(/[\*\*]+/g, '').trim();
      }

      // Cari kalimat contoh secara terperinci
      const examples = [];
      const exampleBlocks = point.split(/\*\s*\*?Jepang/i);
      exampleBlocks.slice(1).forEach(exBlock => {
        const jpMatch = exBlock.match(/^(?:\s*\(Furigana\))?\s*\*?:\s*(.*)/i);
        const romajiMatch = exBlock.match(/\*\s*\*?Romaji\*?:\s*(.*)/i);
        const idMatch = exBlock.match(/\*\s*\*?Arti\*?:\s*(.*)/i) || exBlock.match(/\*\s*\*?Terjemahan\*?:\s*(.*)/i);
        
        if (jpMatch) {
          const jpLine = jpMatch[1].split('\n')[0].trim();
          const cleanJp = jpLine.replace(/[\*]+/g, '').trim();
          
          let romaji = "";
          if (romajiMatch) {
            romaji = romajiMatch[1].split('\n')[0].replace(/[\*]+/g, '').trim();
          }
          
          let id = "";
          if (idMatch) {
            id = idMatch[1].split('\n')[0].replace(/[\*]+/g, '').trim();
          }
          
          examples.push({
            jp: cleanJp.replace(/\[.*?\]/g, '').trim(),
            furigana: cleanJp,
            romaji,
            id
          });
        }
      });

      grammarBlocks.push({
        _type: "grammarBlock",
        title: gTitle,
        content: formula,
        furigana: formula,
        translation,
        examples
      });
    }
  });
}

// 5. Kanji Dasar (Section 4)
const sec4 = getSectionContent(rawContent, 4);
const kanjiList = [];
if (sec4) {
  const kanjiMatches = [...sec4.matchAll(/[\u4e00-\u9faf]/g)];
  kanjiMatches.forEach(match => {
    const k = match[0].trim();
    if (k && !kanjiList.includes(k)) {
      kanjiList.push(k);
    }
  });
}


// 6. Catatan Budaya (Section 5)
const sec5 = getSectionContent(rawContent, 5);
const calloutBlocks = [];
if (sec5) {
  const culturalLines = sec5.split('\n');
  culturalLines.forEach(line => {
    const match = line.match(/^\s*[\*\-\•]\s*\*\*(.*?)(?::\*\*|\*\*:\s*)\s*(.*)/);
    if (match) {
      const cTitle = match[1].trim();
      const content = match[2].trim();
      calloutBlocks.push({
        _type: "calloutBlock",
        title: cTitle,
        content
      });
    }
  });
}

// 7. Dialog (Section 6)
const sec6 = getSectionContent(rawContent, 6);
let dialogueBlock = null;
if (sec6) {
  const lines = sec6.split('\n');
  const dialogueParts = [];
  let currentSpeaker = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Deteksi baris speaker, misal **高橋 (Takahashi):**
    const speakerMatch = line.match(/^\*\*([^\s(:]+)(?:\s*\(([^)]+)\))?:?\*\*/);
    if (speakerMatch) {
      currentSpeaker = speakerMatch[1].trim();
      continue;
    }

    if (currentSpeaker) {
      const jpText = line;
      let romaji = "";
      let translation = "";

      let nextIdx = i + 1;
      while (nextIdx < lines.length && !lines[nextIdx].trim()) {
        nextIdx++;
      }

      if (nextIdx < lines.length) {
        const nextLine = lines[nextIdx].trim();
        const trMatch = nextLine.match(/^\*\(\s*(.*?)\s*-\s*(.*?)\)\*/);
        if (trMatch) {
          romaji = trMatch[1].trim();
          translation = trMatch[2].trim();
          i = nextIdx;
        }
      }

      dialogueParts.push({
        speaker: currentSpeaker,
        jp: jpText,
        romaji,
        translation
      });

      currentSpeaker = null;
    }
  }

  if (dialogueParts.length > 0) {
    dialogueBlock = {
      _type: "dialogueBlock",
      title: "Praktik Membaca Nyata (Dialog)",
      content: dialogueParts.map(p => `${p.speaker}: ${p.jp.replace(/\[.*?\]/g, "")}`).join('\n'),
      translation: dialogueParts.map(p => `${p.speaker}: ${p.translation}`).join('\n'),
      furigana: dialogueParts.map(p => `${p.speaker}：${p.jp}`).join('\n')
    };
  }
}

// 8. Kuis & Kunci Jawaban (Sections 7 & 8)
const sec7 = getSectionContent(rawContent, 7);
const sec8 = getSectionContent(rawContent, 8);
const quizzes = [];

if (sec7) {
  // Dapatkan kunci jawaban dari pembahasan
  const answerMap = {};
  if (sec8) {
    const ansLines = sec8.split('\n');
    ansLines.forEach(line => {
      const match = line.match(/^\s*(\d+)\.\s*\*\*([A-C])\.\*\*\s*(.*)/i);
      if (match) {
        const qNum = match[1];
        const correctLetter = match[2].toUpperCase();
        const explanation = match[3].trim();
        answerMap[qNum] = { correctLetter, explanation };
      }
    });
  }

  // Pecah soal kuis - split berdasarkan "**Soal X"
  const quizBlocks = sec7.split(/\n\s*(?=\*\*\s*Soal\s+\d+)/gi);
  quizBlocks.forEach((qBlock) => {
    const qHeaderMatch = qBlock.match(/\*\*\s*Soal\s+(\d+)\s*:?\s*\*\*\s*:?\s*(.*)/i);
    if (qHeaderMatch) {
      const qNum = parseInt(qHeaderMatch[1], 10);
      const questionText = qHeaderMatch[2].trim();
      const options = [];
      const lines = qBlock.split('\n');
      lines.forEach(line => {
        const optMatch = line.match(/^\s*\*?\s*([A-C])\)\s*(.*)/i);
        if (optMatch) {
          options.push(optMatch[2].trim());
        }
      });

      // Hubungkan dengan Pembahasan
      const ansInfo = answerMap[qNum] || { correctLetter: 'A', explanation: 'Pembahasan menyusul.' };
      const letterIndex = ansInfo.correctLetter.charCodeAt(0) - 65; // A=0, B=1, C=2
      const correct_answer = options[letterIndex] || (options[0] || "");

      quizzes.push({
        id: `n5-bab${orderNumArg}-q${qNum}`,
        question: questionText,
        options,
        correct_answer,
        explanation: ansInfo.explanation,
        type: "multiple-choice"
      });
    }
  });
}

// ─── MERGING INTO SCHEMA STRUCTURE ────────────────────────────────────────────

const contentBlocks = [];

// 1. Objectives (Can-Do)
contentBlocks.push({
  _type: "block",
  style: "h2",
  children: [{ _type: "span", text: `🎯 1. Tujuan Belajar (Can-Do Objectives)` }]
});
contentBlocks.push({
  _type: "block",
  style: "normal",
  children: [{ _type: "span", text: summary }]
});
if (objectives.length > 0) {
  contentBlocks.push({
    _type: "block",
    style: "normal",
    children: [{ _type: "span", text: objectives.map(obj => `• ${obj}`).join('\n') }]
  });
}

// 2. Bedah Kosakata
contentBlocks.push({
  _type: "block",
  style: "h2",
  children: [{ _type: "span", text: `📖 2. Bedah Kosakata (40 Kata)` }]
});
contentBlocks.push({
  _type: "block",
  style: "normal",
  children: [{ _type: "span", text: "Format: Kanji (Hiragana - Romaji) : Arti" }]
});
contentBlocks.push({
  _type: "vocabBlock",
  title: "Daftar Kosakata"
});

// 3. Tata Bahasa Blocks
grammarBlocks.forEach(gBlock => {
  contentBlocks.push(gBlock);
});

// 4. Kanji Dasar
contentBlocks.push({
  _type: "block",
  style: "h2",
  children: [{ _type: "span", text: `🖌️ 4. Daftar Kanji Dasar (Bab 1)` }]
});
contentBlocks.push({
  _type: "block",
  style: "normal",
  children: [{ _type: "span", text: "Detail urutan coretan (stroke order) dan gabungan kata dapat dilihat di rute halaman eksplorasi Kanji." }]
});
contentBlocks.push({
  _type: "kanjiBlock",
  title: "Daftar Kanji"
});

// 5. Catatan Budaya
calloutBlocks.forEach(cBlock => {
  contentBlocks.push(cBlock);
});

// 6. Dialogue
if (dialogueBlock) {
  contentBlocks.push(dialogueBlock);
}

// ─── GENERATE OUTPUT FILE ─────────────────────────────────────────────────────

const frontmatter = {
  title: `Bab ${orderNumArg}: ${title}`,
  slug: slug,
  order_number: orderNumArg,
  category_id: "N5-Course",
  summary: summary,
  estimated_minutes: 15,
  is_premium: false,
  is_published: true,
  vocab_list: vocabList,
  kanji_list: kanjiList,
  grammar_list: grammarList,
  reading_list: [],
  listening_list: [],
  seo: {
    title: `Belajar Bab ${orderNumArg} Bahasa Jepang N5 - ${title} | NihongoRoute`,
    description: `Kuasai materi pelajaran Bahasa Jepang N5 Bab ${orderNumArg}: ${title}. Kosakata, Kanji, Tata Bahasa, Percakapan, dan Kuis interaktif.`,
    keywords: `NihongoRoute, N5, Bab ${orderNumArg}, ${title}, Bahasa Jepang`
  },
  content_blocks: contentBlocks,
  quizzes: quizzes
};

const yamlString = yaml.dump(frontmatter, { lineWidth: -1 });
const cleanMarkdownBody = rawContent.replace(/---[\s\S]*?---/, '').trim();

const finalContent = `---\n${yamlString}---\n\n${cleanMarkdownBody}`;

fs.writeFileSync(targetPath, finalContent, 'utf8');

console.log(`✅ Penyelarasan sukses! Berkas diselamatkan di: ${targetPath}`);
