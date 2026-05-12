/**
 * @file exampleSentence.ts
 * @description Definisi skema Sanity untuk objek 'exampleSentence' (contoh kalimat).
 * Digunakan sebagai komponen pendukung dalam kosakata (vocab) atau artikel tata bahasa.
 * @module sanity/schemaTypes/exampleSentence
 */

import { defineField, defineType } from "sanity";
import { AutoFuriganaInput } from "../components/AutoFuriganaInput";
import { AutoRomajiInput } from "../components/AutoRomajiInput";

// ======================
// SCHEMA DEFINITION
// ======================

export default defineType({
  name: "exampleSentence",
  title: "Contoh Kalimat (Audio)",
  type: "object",
  fields: [
    defineField({
      name: "jp",
      type: "string",
      title: "Bahasa Jepang (Kanji/Kana)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "furigana",
      type: "string",
      title: "Cara Baca (Furigana)",
      components: {
        input: AutoFuriganaInput,
      },
      options: { sourceField: "jp" },
    }),
    defineField({
      name: "romaji",
      type: "string",
      title: "Cara Baca (Romaji)",
      components: {
        input: AutoRomajiInput,
      },
      options: { sourceField: "furigana" },
    }),
    defineField({
      name: "id",
      type: "string",
      title: "Arti (Bahasa Indonesia)",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
