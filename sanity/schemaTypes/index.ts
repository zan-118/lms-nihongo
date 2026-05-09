/**
 * @file index.ts
 * @description Titik masuk utama untuk definisi skema Sanity Studio.
 * Mendaftarkan seluruh tipe dokumen dan objek yang digunakan dalam CMS.
 * @module sanity/schemaTypes
 */

// ======================
// IMPORTS
// ======================
import { type SchemaTypeDefinition } from "sanity";

import quiz from "./quiz";
import lesson from "./lesson";
import achievement from "./achievement";
import callout from "./callout";
import exampleSentence from "./exampleSentence";
import vocab from "./vocab";
import verbDictionary from "./verbDictionary";
import cheatsheet from "./cheatsheet";
import grammarArticle from "./grammarArticle";
import courseCategory from "./courseCategory";
import mockExam from "./mockExam";
import kanji from "./kanji";
import readingMaterial from "./readingMaterial";
import listeningTask from "./listeningTask";
import blockContent from "./blockContent";
import furigana from "./furiganaAnnotation";
import dialogueBlock from "./dialogueBlock";
import youtubeEmbed from "./youtubeEmbed";

// ======================
// MAIN EXECUTION
// ======================

/**
 * Konfigurasi skema global untuk Sanity.
 */
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    quiz,
    lesson,
    achievement,
    callout,
    exampleSentence,
    vocab,
    verbDictionary,
    cheatsheet,
    grammarArticle,
    mockExam,
    courseCategory,
    kanji,
    readingMaterial,
    listeningTask,
    blockContent,
    furigana,
    dialogueBlock,
    youtubeEmbed,
  ],
};
