/**
 * @file verbDictionary.ts
 * @description Definisi skema Sanity untuk dokumen 'verb_dictionary' (kamus kata kerja).
 * Menyimpan data kata kerja beserta seluruh konjugasi teknisnya (masu, jisho, te, nai, potensial, pasif, dsb).
 * @module sanity/schemaTypes/verbDictionary
 */

import { defineField, defineType } from "sanity";
import { KanaInput } from "../components/KanaInput";
import { AutoRomajiInput } from "../components/AutoRomajiInput";

// ======================
// SCHEMA DEFINITION
// ======================

export default defineType({
  name: "verb_dictionary",
  title: "Kamus Kata Kerja (Verb)",
  type: "document",
  fieldsets: [
    { name: "identity", title: "Identitas Utama" },
    { name: "basic", title: "Konjugasi Dasar" },
    { name: "advanced", title: "Konjugasi Lanjutan" },
  ],
  fields: [
    // --- IDENTITAS UTAMA ---

    defineField({
      name: "masu",
      title: "Bentuk Masu (Utama)",
      type: "string",
      description: "Bentuk sopan (~masu). Contoh: 食べます",
      fieldset: "identity",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "furigana",
      title: "Furigana (Hiragana)",
      type: "string",
      description: "Cara baca dalam Hiragana murni.",
      components: {
        input: KanaInput,
      },
      fieldset: "identity",
    }),
    defineField({
      name: "pitchAccent",
      title: "Pitch Accent",
      type: "string",
      description: "Contoh: LHL (Low-High-Low)",
      fieldset: "identity",
    }),
    defineField({
      name: "romaji",
      title: "Romaji",
      type: "string",
      components: {
        input: AutoRomajiInput,
      },
      description: "Terisi otomatis mengikuti Furigana. Bisa diedit manual jika perlu.",
      fieldset: "identity",
    }),
    defineField({
      name: "jisho",
      title: "Bentuk Kamus (Jisho-kei)",
      type: "string",
      description: "Bentuk dasar/kamus. Contoh: 食べる",
      fieldset: "identity",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "meaning",
      title: "Arti (Bahasa Indonesia)",
      type: "string",
      fieldset: "identity",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "audioFile",
      title: "Audio Pengucapan Asli",
      type: "file",
      options: { accept: "audio/*" },
      fieldset: "identity",
      description: "Rekaman suara native speaker.",
    }),
    defineField({
      name: "usageNotes",
      title: "Nuansa & Kolokasi (Opsional)",
      type: "text",
      fieldset: "identity",
      description: "Contoh: Hanya dipakai untuk benda mati atau dalam konteks formal.",
    }),
    defineField({
      name: "group",
      title: "Golongan (Group)",
      type: "number",
      options: { list: [1, 2, 3] },
      fieldset: "identity",
      validation: (Rule) => Rule.required().min(1).max(3),
    }),
    defineField({
      name: "jlptLevel",
      title: "JLPT Level",
      type: "string",
      fieldset: "identity",
      options: {
        list: [
          { title: "N5 (Beginner)", value: "N5" },
          { title: "N4 (Elementary)", value: "N4" },
          { title: "N3 (Intermediate)", value: "N3" },
          { title: "N2 (Upper Intermediate)", value: "N2" },
          { title: "N1 (Advanced)", value: "N1" },
        ],
        layout: "radio",
      },
      initialValue: "N5",
    }),
    defineField({
      name: "lesson",
      title: "Bab (Lesson)",
      type: "string",
    }),
    defineField({
      name: "course_category",
      title: "Course Category (Level)",
      type: "reference",
      to: [{ type: "course_category" }],
      description: "Pilih level untuk memunculkan kata kerja ini di Flashcard",
    }),
    defineField({
      name: "showInFlashcard",
      type: "boolean",
      title: "Munculkan di Flashcard?",
      initialValue: true,
    }),

    // --- KONJUGASI DASAR ---
    defineField({
      name: "te",
      title: "Bentuk ~Te",
      type: "string",
      description: "Contoh: 食べて",
      fieldset: "basic",
    }),
    defineField({
      name: "nai",
      title: "Bentuk ~Nai",
      type: "string",
      description: "Contoh: 食べない",
      fieldset: "basic",
    }),
    defineField({
      name: "ta",
      title: "Bentuk ~Ta",
      type: "string",
      description: "Contoh: 食べた",
      fieldset: "basic",
    }),

    // --- KONJUGASI LANJUTAN ---
    defineField({
      name: "tai",
      title: "Bentuk ~Tai (Keinginan)",
      type: "string",
      fieldset: "advanced",
    }),
    defineField({
      name: "kanou",
      title: "Bentuk Kanou (Potensial)",
      type: "string",
      fieldset: "advanced",
    }),
    defineField({
      name: "shieki",
      title: "Bentuk Shieki (Kausatif)",
      type: "string",
      fieldset: "advanced",
    }),
    defineField({
      name: "ukemi",
      title: "Bentuk Ukemi (Pasif)",
      type: "string",
      fieldset: "advanced",
    }),
    defineField({
      name: "katei",
      title: "Bentuk Katei (Pengandaian)",
      type: "string",
      fieldset: "advanced",
    }),
    defineField({
      name: "ikou",
      title: "Bentuk Ikou (Volitional)",
      type: "string",
      fieldset: "advanced",
    }),
    defineField({
      name: "meirei",
      title: "Bentuk Meirei (Perintah)",
      type: "string",
      fieldset: "advanced",
    }),
    defineField({
      name: "mnemonic",
      title: "Mnemonic (Cerita Pengingat)",
      type: "text",
      description: "Tuliskan cerita atau cara mudah untuk mengingat kata kerja ini.",
    }),
    defineField({
      name: "relatedKanji",
      title: "Kanji Terkait",
      type: "array",
      of: [{ type: "reference", to: [{ type: "kanji" }] }],
      description: "Pilih karakter Kanji yang membentuk kata kerja ini.",
    }),
    defineField({
      name: "synonyms",
      title: "Sinonim",
      type: "array",
      of: [{ type: "reference", to: [{ type: "vocab" }, { type: "verb_dictionary" }] }],
    }),
    defineField({
      name: "antonyms",
      title: "Antonim",
      type: "array",
      of: [{ type: "reference", to: [{ type: "vocab" }, { type: "verb_dictionary" }] }],
    }),
    defineField({
      name: "transitivity",
      title: "Transitivitas",
      type: "string",
      options: {
        list: [
          { title: "Tadoushi (Transitif - Membutuhkan Objek)", value: "transitive" },
          { title: "Jidoushi (Intransitif - Tanpa Objek)", value: "intransitive" },
        ],
      },
    }),
    defineField({
      name: "pair_verb",
      title: "Pasangan Kata Kerja (Pair)",
      type: "reference",
      to: [{ type: "verb_dictionary" }],
      description: "Pilih pasangan kata kerja (misal: Akeru berpasangan dengan Aku).",
    }),
    defineField({
      name: "examples",
      title: "Contoh Kalimat",
      type: "array",
      of: [{ type: "exampleSentence" }],
      description: "Daftar contoh kalimat penggunaan kata kerja ini.",
    }),
  ],
  preview: {
    select: {
      title: "masu",
      subtitle: "meaning",
      group: "group",
    },
    prepare({ title, subtitle, group }) {
      return {
        title: title,
        subtitle: `${subtitle} (Gol. ${group})`,
      };
    },
  },
});
