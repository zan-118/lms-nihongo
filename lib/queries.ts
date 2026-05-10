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
  pitchAccent,
  mnemonic,
  examples,
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
  "slug": character
}`;

export const listeningListQuery = `*[_type == "listeningTask"] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current
}`;

export const kanjiQuery = `*[_type == "kanji" && (character == $slug || _id == $slug)][0] {
  _id,
  character,
  meaning,
  onyomi,
  kunyomi,
  "jlpt": course_category->slug.current,
  examples,
  strokeOrderSvg,
  radicals,
  mnemonics,
  "slug": character,
  "relatedVocab": *[_type == "vocab" && references(^._id)] {
    _id,
    word,
    furigana,
    romaji,
    meaning
  }
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

export const vocabDetailQuery = `*[(_type == "vocab" || _type == "verb_dictionary") && (romaji == $id || _id == $id)][0] {
  _id,
  word,
  furigana,
  romaji,
  meaning,
  hinshi,
  pitchAccent,
  mnemonic,
  showInFlashcard,
  jlptLevel,
  "audioUrl": audio.asset->url,
  relatedKanji[]->{ 
    _id, 
    character, 
    meaning, 
    onyomi, 
    kunyomi,
    "slug": character 
  },
  synonyms[]->{ _id, word, meaning, furigana, romaji },
  antonyms[]->{ _id, word, meaning, furigana, romaji },
  examples[] { japanese, indonesian },
  negative,
  past,
  pastNegative,
  teForm,
  adverbial
}`;
