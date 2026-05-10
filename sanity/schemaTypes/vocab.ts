/**
 * @file vocab.ts
 * @description Definisi skema Sanity untuk dokumen 'vocab' (kosakata).
 * Mencakup logika validasi keunikan ID dan kata Jepang.
 * @module sanity/schemaTypes/vocab
 */

import { defineField, defineType, type ValidationContext } from "sanity";
import { KanaInput } from "../components/KanaInput";
import { AutoRomajiInput } from "../components/AutoRomajiInput";

// ======================
// VALIDATION LOGIC
// ======================

/**
 * Memastikan kata Jepang (word) tidak duplikat untuk menjaga integritas data.
 */
const isUniqueWord = async (value: string | undefined, context: ValidationContext) => {
  if (!value) return true;
  const { document, getClient } = context;
  if (!document) return true;
  const client = getClient({ apiVersion: "2024-04-12" });
  const id = document._id.replace(/^drafts\./, "");

  const query = `*[_type == "vocab" && word == $value && _id != $draftId && _id != $publishedId][0]`;
  const params = { value, draftId: `drafts.${id}`, publishedId: id };
  const result = await client.fetch(query, params);

  return result
    ? `🚨 Kata "${value}" sudah ada di database! Hindari duplikat.`
    : true;
};

// ======================
// SCHEMA DEFINITION
// ======================

export default defineType({
  name: "vocab",
  title: "Perpustakaan Kosakata Global",
  type: "document",
  fieldsets: [
    { name: "adjectiveConjugation", title: "Konjugasi Kata Sifat (Khusus Keiyoushi)" },
  ],
  fields: [

    defineField({
      name: "word",
      type: "string",
      title: "Kata (Kanji/Kana)",
      validation: (Rule) => Rule.required().custom(isUniqueWord),
    }),

    defineField({
      name: "hinshi",
      type: "string",
      title: "Hinshi (Kelas Kata / Part of Speech)",
      options: {
        list: [
          { title: "Meishi (Kata Benda)", value: "noun" },
          { title: "I-Keiyoushi (Kata Sifat-I)", value: "i-adjective" },
          { title: "Na-Keiyoushi (Kata Sifat-Na)", value: "na-adjective" },
          { title: "Fukushi (Kata Keterangan)", value: "adverb" },
          { title: "Joshi (Partikel)", value: "particle" },
          { title: "Setsuzokushi (Kata Sambung)", value: "conjunction" },
          { title: "Daimeishi (Kata Ganti)", value: "pronoun" },
          { title: "Hyougen (Ungkapan / Frasa)", value: "expression" },
          { title: "Suushi (Angka/Numeric)", value: "numeric" },
          { title: "Josuushi (Satuan Hitung/Counter)", value: "counter" },
          { title: "Rentaishi (Pre-noun Adjectival)", value: "pre-noun-adjectival" },
          { title: "Fukushi-teki Meishi (Adverbial Noun)", value: "adverbial-noun" },
          { title: "Meishi-teki Fukushi (Temporal Noun)", value: "temporal-noun" },
          { title: "Kandoushi (Interjection)", value: "interjection" },
          { title: "Setsudougo (Prefix)", value: "prefix" },
          { title: "Setsubigo (Suffix)", value: "suffix" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "jlptLevel",
      title: "JLPT Level",
      type: "string",
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
      name: "showInFlashcard",
      type: "boolean",
      title: "Munculkan di Flashcard (Vocab Drill)?",
      description:
        "Matikan (OFF) jika kata ini hanya untuk referensi Cheatsheet / UI materi.",
      initialValue: true,
    }),
    defineField({
      name: "furigana",
      type: "string",
      title: "Cara Baca (Furigana)",
      components: {
        input: KanaInput,
      },
      description: "Ketik romaji, akan otomatis diubah jadi Hiragana.",
    }),
    defineField({
      name: "romaji",
      type: "string",
      title: "Romaji",
      components: {
        input: AutoRomajiInput,
      },
      description: "Terisi otomatis mengikuti Furigana. Bisa diedit manual jika perlu.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pitchAccent",
      title: "Pitch Accent",
      type: "string",
      description: "Contoh: LHL (Low-High-Low)",
    }),
    defineField({
      name: "meaning",
      type: "string",
      title: "Arti (Bahasa Indonesia)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "course_category",
      title: "Course Category",
      type: "reference",
      to: [{ type: "course_category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "audio",
      type: "file",
      title: "Audio Pengucapan (Opsional)",
      options: { accept: "audio/*" },
    }),
    defineField({
      name: "usageNotes",
      title: "Nuansa & Kolokasi (Opsional)",
      type: "text",
      description: "Contoh: Sering digunakan bersama partikel 'ni' atau hanya untuk konteks formal.",
    }),
    defineField({
      name: "mnemonic",
      title: "Mnemonic (Cerita Pengingat)",
      type: "text",
      description: "Tuliskan cerita atau cara mudah untuk mengingat kata ini.",
    }),
    defineField({
      name: "relatedKanji",
      title: "Kanji Terkait",
      type: "array",
      of: [{ type: "reference", to: [{ type: "kanji" }] }],
      description: "Pilih karakter Kanji yang membentuk kosa kata ini.",
    }),
    defineField({
      name: "synonyms",
      title: "Sinonim",
      type: "array",
      of: [{ type: "reference", to: [{ type: "vocab" }] }],
    }),
    defineField({
      name: "antonyms",
      title: "Antonim",
      type: "array",
      of: [{ type: "reference", to: [{ type: "vocab" }] }],
    }),
    defineField({
      name: "examples",
      title: "Contoh Kalimat",
      type: "array",
      of: [{ type: "exampleSentence" }],
      description: "Daftar contoh kalimat penggunaan kata ini.",
    }),

    // --- KONJUGASI KATA SIFAT (CONDITIONAL) ---
    defineField({
      name: "negative",
      title: "Bentuk Negatif (~kunai / ~ja nai)",
      type: "string",
      fieldset: "adjectiveConjugation",
      hidden: ({ document }) => !["i-adjective", "na-adjective"].includes(document?.hinshi as string),
    }),
    defineField({
      name: "past",
      title: "Bentuk Lampau (~katta / ~datta)",
      type: "string",
      fieldset: "adjectiveConjugation",
      hidden: ({ document }) => !["i-adjective", "na-adjective"].includes(document?.hinshi as string),
    }),
    defineField({
      name: "pastNegative",
      title: "Bentuk Lampau Negatif (~kunakatta / ~ja nakatta)",
      type: "string",
      fieldset: "adjectiveConjugation",
      hidden: ({ document }) => !["i-adjective", "na-adjective"].includes(document?.hinshi as string),
    }),
    defineField({
      name: "teForm",
      title: "Bentuk ~Te (~kute / ~de)",
      type: "string",
      fieldset: "adjectiveConjugation",
      hidden: ({ document }) => !["i-adjective", "na-adjective"].includes(document?.hinshi as string),
    }),
    defineField({
      name: "adverbial",
      title: "Bentuk Adverbial (~ku / ~ni)",
      type: "string",
      fieldset: "adjectiveConjugation",
      hidden: ({ document }) => !["i-adjective", "na-adjective"].includes(document?.hinshi as string),
    }),
  ],
  preview: {
    select: {
      title: "word",
      subtitle: "meaning",
      hinshi: "hinshi",
      showInFlashcard: "showInFlashcard",
    },
    prepare({ title, subtitle, hinshi, showInFlashcard }) {
      const isHidden = showInFlashcard === false ? " 🚷 (Hidden)" : "";
      const displayTitle = title || "Kosong";

      return {
        title: `${displayTitle}${isHidden}`,
        subtitle: `[${hinshi?.toUpperCase() || "UNKNOWN"}] ${subtitle || ""}`,
      };
    },
  },
});
