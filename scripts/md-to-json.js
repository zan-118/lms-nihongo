/**
 * 🌀 NihongoRoute - Markdown to JSON Converter
 * 
 * Konverter raw markdown pelajaran → JSON (Sanity payload format).
 * Memastikan SELURUH header seksi (1-8) dimasukkan ke content_blocks
 * agar tidak ada penomoran yang lompat.
 * 
 * Penggunaan:
 *   node scripts/md-to-json.js <path-to-md> [bab-number] [title-override]
 * 
 * Contoh:
 *   node scripts/md-to-json.js ./data/n5/bab-1.md 1 "Perkenalan Diri (Jikoshoukai)"
 */

const fs = require('fs');
const path = require('path');

const filePathArg = process.argv[2];
const babNumber = process.argv[3] ? parseInt(process.argv[3], 10) : 1;
const titleOverride = process.argv[4] || null;

if (!filePathArg) {
  console.error('❌ Error: Harap masukkan path file markdown.');
  console.log('Penggunaan: node scripts/md-to-json.js ./data/n5/bab-1.md [bab-number] [title]');
  process.exit(1);
}

const targetPath = path.resolve(filePathArg);
if (!fs.existsSync(targetPath)) {
  console.error(`❌ Error: File tidak ditemukan di ${targetPath}`);
  process.exit(1);
}

const raw = fs.readFileSync(targetPath, 'utf8');
console.log(`🌀 Memulai konversi: ${path.basename(targetPath)}...`);

// ─── UTILS ────────────────────────────────────────────────────────────────────

/**
 * Memotong raw markdown berdasarkan header seksi #### N.
 * Mengembalikan Map<number, string> berisi nomor seksi → konten.
 */
function splitSections(content) {
  const sections = new Map();
  // Cari semua header #### N. ...
  const regex = /^####\s+(\d+)\.\s+(.*)$/gm;
  const headers = [];
  let m;
  while ((m = regex.exec(content)) !== null) {
    headers.push({
      num: parseInt(m[1], 10),
      title: m[2].trim(),
      index: m.index,
      fullMatch: m[0]
    });
  }
  for (let i = 0; i < headers.length; i++) {
    const start = headers[i].index + headers[i].fullMatch.length;
    const end = i + 1 < headers.length ? headers[i + 1].index : content.length;
    sections.set(headers[i].num, {
      title: headers[i].title,
      body: content.slice(start, end).trim()
    });
  }
  return sections;
}

// ─── PARSER FUNCTIONS ─────────────────────────────────────────────────────────

/**
 * Sec 1: Tujuan Belajar
 */
function parseObjectives(body) {
  const lines = body.split('\n');
  let summary = '';
  const objectives = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('*')) {
      objectives.push(trimmed.replace(/^\*\s*/, ''));
    } else if (trimmed && !summary) {
      summary = trimmed;
    }
  }
  return { summary, objectives };
}

/**
 * Sec 2: Kosakata — extract vocab words from numbered list
 */
function parseVocab(body) {
  const vocabList = [];
  const lines = body.split('\n');
  for (const line of lines) {
    // Match: "1. 私 (わたし - watashi) : Saya"
    const match = line.match(/^\d+\.\s*([^\s(]+)/);
    if (match) {
      vocabList.push(match[1].replace(/～/g, ''));
    }
  }
  return vocabList;
}

/**
 * Sec 3: Tata Bahasa — parse grammar patterns
 */
function parseGrammar(body) {
  const blocks = [];
  const grammarList = [];
  
  // Split by **A. ...**
  const patternRegex = /^\*\*([A-Z])\.\s*(.*?)\*\*/gm;
  const patterns = [];
  let pm;
  while ((pm = patternRegex.exec(body)) !== null) {
    patterns.push({
      letter: pm[1],
      title: pm[2].trim(),
      index: pm.index,
      fullLength: pm[0].length
    });
  }

  for (let i = 0; i < patterns.length; i++) {
    const start = patterns[i].index + patterns[i].fullLength;
    const end = i + 1 < patterns.length ? patterns[i + 1].index : body.length;
    const chunk = body.slice(start, end).trim();
    
    const p = patterns[i];
    const fullTitle = `${p.letter}. ${p.title}`;
    
    // Extract fungsi
    const fungsiMatch = chunk.match(/\*\*Fungsi:\*\*\s*(.*)/);
    const translation = fungsiMatch ? fungsiMatch[1].trim() : '';

    // Extract contoh
    const contohMatch = chunk.match(/\*\*Contoh:\*\*\s*(.*)/);
    let exampleJp = '', exampleRomaji = '', exampleId = '';
    if (contohMatch) {
      const exLine = contohMatch[1].trim();
      // Format: 私は学生です。 (Watashi wa gakusei desu. - Saya adalah pelajar.)
      const exParse = exLine.match(/^(.+?)\s*\((.+?)\s*-\s*(.+?)\)\.?$/);
      if (exParse) {
        exampleJp = exParse[1].trim();
        exampleRomaji = exParse[2].trim();
        exampleId = exParse[3].trim();
      } else {
        exampleJp = exLine;
      }
    }

    // Extract content (formula pattern dari title)
    const formulaMatch = fullTitle.match(/:\s*(.+)/);
    const content = formulaMatch ? formulaMatch[1].trim() : fullTitle;

    const block = {
      _type: "grammarBlock",
      title: fullTitle,
      content: content,
      furigana: "",
      translation: translation,
      examples: []
    };

    if (exampleJp) {
      block.examples.push({
        jp: exampleJp,
        romaji: exampleRomaji,
        id: exampleId,
        furigana: ""
      });
    }

    blocks.push(block);
    grammarList.push(content);
  }

  return { blocks, grammarList };
}

/**
 * Sec 4: Kanji — extract kanji characters
 */
function parseKanji(body) {
  const kanjiList = [];
  // Find kanji characters (CJK range)
  const matches = body.match(/[\u4e00-\u9faf]/g);
  if (matches) {
    matches.forEach(k => {
      if (!kanjiList.includes(k)) kanjiList.push(k);
    });
  }
  return kanjiList;
}

/**
 * Sec 5: Catatan Budaya — parse callout blocks
 */
function parseCulture(body) {
  const blocks = [];
  const lines = body.split('\n');
  for (const line of lines) {
    // Match: * **Title:** Content  OR  * **Title:** Content
    const match = line.match(/^\s*\*\s*\*\*(.*?)(?::\*\*|\*\*:)\s*(.*)/);
    if (match) {
      blocks.push({
        _type: "calloutBlock",
        title: match[1].trim(),
        content: match[2].trim()
      });
    }
  }
  return blocks;
}

/**
 * Sec 6: Dialog — parse conversation
 */
function parseDialogue(body) {
  const lines = body.split('\n');
  const jpLines = [];
  const translationLines = [];
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line || line.startsWith('*')) { i++; continue; }
    
    // Japanese line: "高橋：初めまして。高橋です。"
    const jpMatch = line.match(/^([^(（\n]+[：:].+)$/);
    if (jpMatch && !line.startsWith('(') && !line.startsWith('（')) {
      jpLines.push(line);
      // Check if next line is translation
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        if (nextLine.startsWith('(') || nextLine.startsWith('（')) {
          // Parse: (Speaker: Romaji - Translation)
          const trParse = nextLine.match(/\(([^:：]+)[：:]\s*(.+?)\s*-\s*(.+?)\)/);
          if (trParse) {
            translationLines.push(`${trParse[1].trim()}: ${trParse[3].trim()}`);
          } else {
            translationLines.push(nextLine.replace(/[()（）]/g, ''));
          }
          i += 2;
          continue;
        }
      }
    }
    i++;
  }

  if (jpLines.length === 0) return null;

  return {
    _type: "dialogueBlock",
    title: "Praktik Membaca Nyata (Dialog)",
    content: jpLines.join('\n'),
    translation: translationLines.join('\n'),
    furigana: ""
  };
}

/**
 * Sec 7+8: Kuis + Kunci Jawaban
 */
function parseQuizzes(sec7Body, sec8Body) {
  const quizzes = [];
  
  // Parse kunci jawaban dari sec 8
  const answerMap = {};
  if (sec8Body) {
    const ansLines = sec8Body.split('\n');
    for (const line of ansLines) {
      const match = line.match(/^\s*(\d+)\.\s*\*\*([A-C])\.\*\*\s*(.*)/);
      if (match) {
        answerMap[match[1]] = {
          correctLetter: match[2].toUpperCase(),
          explanation: match[3].trim()
        };
      }
    }
  }
  
  // Parse soal kuis dari sec 7
  if (!sec7Body) return quizzes;
  
  const soalBlocks = sec7Body.split(/\n\s*(?=\*\*\s*Soal\s+\d+)/gi);
  
  for (const block of soalBlocks) {
    const headerMatch = block.match(/\*\*\s*Soal\s+(\d+):\*\*\s*(.*)/i);
    if (!headerMatch) continue;
    
    const qNum = parseInt(headerMatch[1], 10);
    let questionText = headerMatch[2].trim();
    
    // Collect remaining lines of question text until options start
    const blockLines = block.split('\n');
    let questionLines = [questionText];
    let optionStartIdx = -1;
    
    for (let li = 1; li < blockLines.length; li++) {
      const tl = blockLines[li].trim();
      if (tl.match(/^[A-C]\)\s/)) {
        optionStartIdx = li;
        break;
      } else if (tl) {
        questionLines.push(tl);
      }
    }
    questionText = questionLines.join('\n');
    
    // Collect options
    const options = [];
    if (optionStartIdx >= 0) {
      for (let li = optionStartIdx; li < blockLines.length; li++) {
        const optMatch = blockLines[li].trim().match(/^[A-C]\)\s*(.*)/);
        if (optMatch) {
          options.push(optMatch[1].trim());
        }
      }
    }

    // Resolve correct answer
    const ansInfo = answerMap[qNum] || { correctLetter: 'A', explanation: '' };
    const letterIndex = ansInfo.correctLetter.charCodeAt(0) - 65;
    const correct_answer = options[letterIndex] || options[0] || '';

    quizzes.push({
      id: `n5-bab${babNumber}-q${qNum}`,
      question: questionText,
      options,
      correct_answer,
      explanation: ansInfo.explanation,
      type: "multiple-choice"
    });
  }

  return quizzes;
}

// ─── MAIN CONVERSION ──────────────────────────────────────────────────────────

const sections = splitSections(raw);

// Determine title
const sec1 = sections.get(1);
let lessonTitle = titleOverride || `Bab ${babNumber}`;
const slug = `bab-${babNumber}`;

// Parse each section
const { summary, objectives } = sec1 ? parseObjectives(sec1.body) : { summary: '', objectives: [] };
const vocabList = sections.has(2) ? parseVocab(sections.get(2).body) : [];
const { blocks: grammarBlocks, grammarList } = sections.has(3) ? parseGrammar(sections.get(3).body) : { blocks: [], grammarList: [] };
const kanjiList = sections.has(4) ? parseKanji(sections.get(4).body) : [];
const calloutBlocks = sections.has(5) ? parseCulture(sections.get(5).body) : [];
const dialogueBlock = sections.has(6) ? parseDialogue(sections.get(6).body) : null;
const quizzes = parseQuizzes(
  sections.has(7) ? sections.get(7).body : '',
  sections.has(8) ? sections.get(8).body : ''
);

// ─── ASSEMBLE content_blocks (RUNTUT, LENGKAP) ───────────────────────────────

const content_blocks = [];

// ── Section 1: Tujuan Belajar ──
if (sections.has(1)) {
  content_blocks.push({
    _type: "block",
    style: "h2",
    children: [{ _type: "span", text: `🎯 1. ${sections.get(1).title}` }]
  });
  if (summary) {
    content_blocks.push({
      _type: "block",
      style: "normal",
      children: [{ _type: "span", text: summary }]
    });
  }
  if (objectives.length > 0) {
    content_blocks.push({
      _type: "block",
      style: "normal",
      children: [{ _type: "span", text: objectives.map(o => `• ${o}`).join('\n') }]
    });
  }
}

// ── Section 2: Bedah Kosakata ──
if (sections.has(2)) {
  content_blocks.push({
    _type: "block",
    style: "h2",
    children: [{ _type: "span", text: `📖 2. ${sections.get(2).title}` }]
  });
  content_blocks.push({
    _type: "block",
    style: "normal",
    children: [{ _type: "span", text: "Format: Kanji (Hiragana - Romaji) : Arti" }]
  });
  content_blocks.push({
    _type: "vocabBlock",
    title: "Daftar Kosakata"
  });
}

// ── Section 3: Tata Bahasa ──
if (sections.has(3)) {
  content_blocks.push({
    _type: "block",
    style: "h2",
    children: [{ _type: "span", text: `🛠️ 3. ${sections.get(3).title}` }]
  });
  grammarBlocks.forEach(gb => content_blocks.push(gb));
}

// ── Section 4: Kanji ──
if (sections.has(4)) {
  content_blocks.push({
    _type: "block",
    style: "h2",
    children: [{ _type: "span", text: `🖌️ 4. ${sections.get(4).title}` }]
  });
  content_blocks.push({
    _type: "block",
    style: "normal",
    children: [{ _type: "span", text: "Detail urutan coretan (stroke order) dan gabungan kata dapat dilihat di rute halaman eksplorasi Kanji." }]
  });
  content_blocks.push({
    _type: "kanjiBlock",
    title: "Daftar Kanji"
  });
}

// ── Section 5: Catatan Budaya ──
if (sections.has(5)) {
  content_blocks.push({
    _type: "block",
    style: "h2",
    children: [{ _type: "span", text: `⛩️ 5. ${sections.get(5).title}` }]
  });
  calloutBlocks.forEach(cb => content_blocks.push(cb));
}

// ── Section 6: Dialog ──
if (sections.has(6)) {
  content_blocks.push({
    _type: "block",
    style: "h2",
    children: [{ _type: "span", text: `💬 6. ${sections.get(6).title}` }]
  });
  if (dialogueBlock) {
    content_blocks.push(dialogueBlock);
  }
}

// ── Section 7: Kuis (Header only, data goes to quizzes array) ──
if (sections.has(7)) {
  content_blocks.push({
    _type: "block",
    style: "h2",
    children: [{ _type: "span", text: `✏️ 7. ${sections.get(7).title}` }]
  });
}

// ─── FINAL JSON PAYLOAD ───────────────────────────────────────────────────────

const payload = {
  _type: "lesson",
  _id: `lesson-${slug}`,
  title: `Bab ${babNumber}: ${lessonTitle}`,
  slug: { _type: "slug", current: slug },
  order_number: babNumber,
  category_id: "N5-Course",
  summary: summary || `Ringkasan Bab ${babNumber}`,
  estimated_minutes: 15,
  is_premium: false,
  is_published: true,
  vocab_list: vocabList,
  kanji_list: kanjiList,
  grammar_list: grammarList,
  reading_list: [],
  listening_list: [],
  seo: {
    title: `Belajar Bab ${babNumber} Bahasa Jepang N5 - ${lessonTitle} | NihongoRoute`,
    description: `Kuasai materi pelajaran Bahasa Jepang N5 Bab ${babNumber}: ${lessonTitle}. Kosakata, Kanji, Tata Bahasa, Percakapan, dan Kuis interaktif.`,
    keywords: `NihongoRoute, N5, Bab ${babNumber}, ${lessonTitle}, Bahasa Jepang`
  },
  content_blocks,
  quizzes
};

// ─── OUTPUT ───────────────────────────────────────────────────────────────────

const outputPath = targetPath.replace(/\.md$/, '.json');
fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2), 'utf8');

console.log(`✅ Konversi sukses!`);
console.log(`📄 JSON disimpan di: ${outputPath}`);
console.log(`📊 Statistik:`);
console.log(`   - Seksi ditemukan  : ${sections.size}`);
console.log(`   - Content blocks   : ${content_blocks.length}`);
console.log(`   - Grammar blocks   : ${grammarBlocks.length}`);
console.log(`   - Callout blocks   : ${calloutBlocks.length}`);
console.log(`   - Dialog           : ${dialogueBlock ? 'Ya' : 'Tidak'}`);
console.log(`   - Kuis             : ${quizzes.length}`);
console.log(`   - Kosakata         : ${vocabList.length}`);
console.log(`   - Kanji            : ${kanjiList.length}`);
