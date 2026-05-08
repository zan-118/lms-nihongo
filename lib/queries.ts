/**
 * @file queries.ts
 * @description Koleksi query GROQ (Graph Relational Object Queries) untuk pengambilan data dari Sanity CMS.
 * Mengatur struktur proyeksi data yang dikirimkan ke frontend.
 * @module lib/queries
 */

// ======================
// CONTENT QUERIES
// ======================

/**
 * Mengambil dataset kosakata spesifik berdasarkan daftar ID.
 * Digunakan terutama oleh sistem SRS (Spaced Repetition System).
 */
export const vocabByIdsQuery = `*[_type == "vocab" && _id in $ids] {
  _id,
  word,
  furigana,
  romaji,
  meaning,
  hinshi,
  "audioUrl": audio.asset->url
}`;

/**
 * Query detail materi (Lesson) mencakup daftar kosakata dan kuis.
 */
export const lessonQuery = `*[_type == "lesson" && slug.current == $slug][0] {
  title,
  summary,
  orderNumber,
  vocabList[]->{ 
    _id, word, furigana, romaji, meaning, hinshi, examples 
  },
  referenceWords[]->{ 
    _id, word, furigana, romaji, meaning, hinshi, examples 
  },
  patterns,
  examples,
  conversation,
  grammar,
  quizzes[] {
    question,
    "options": options[].text,
    "answer": options[isCorrect == true][0].text,
    explanation
  }
}`;

export const readingMaterialQuery = `*[_type == "readingMaterial" && slug.current == $slug][0] {
  title,
  difficulty,
  "audioUrl": audioFile.asset->url,
  isTTSDisabled,
  body,
  hiragana,
  translation
}`;

export const readingListQuery = `*[_type == "readingMaterial"] | order(_createdAt desc) {
  title,
  difficulty,
  "slug": slug.current,
  "category": category->title
}`;

export const kanjiListQuery = `*[_type == "kanji"] | order(course_category->slug.current asc, character asc) {
  _id,
  character,
  meaning,
  onyomi,
  kunyomi,
  "jlpt": course_category->slug.current,
  "slug": slug.current
}`;

export const listeningListQuery = `*[_type == "listeningTask"] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current
}`;

export const kanjiQuery = `*[_type == "kanji" && slug.current == $slug][0] {
  character,
  meaning,
  onyomi,
  kunyomi,
  "jlpt": course_category->slug.current,
  examples,
  strokeOrderSvg,
  radicals,
  mnemonics,
  "slug": slug.current
}`;

export const listeningTaskQuery = `*[_type == "listeningTask" && slug.current == $slug][0] {
  title,
  "audioUrl": audioFile.asset->url,
  transcript[] {
    speaker,
    text,
    translation,
    startTime,
    endTime
  },
  "quiz": quiz[]-> {
    _id,
    question,
    options[] {
      text,
      isCorrect
    },
    explanation
  }
}`;
