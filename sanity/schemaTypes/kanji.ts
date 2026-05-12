/**
 * @file kanji.ts
 * @description Definisi skema Sanity untuk dokumen 'kanji' (karakter kanji).
 * Mencakup logika validasi keunikan karakter dan ID untuk menjaga integritas data kamus kanji.
 * @module sanity/schemaTypes/kanji
 */

import { defineField, defineType, type ValidationContext } from "sanity";

// ======================
// VALIDATION LOGIC
// ======================

/**
 * Memastikan karakter kanji tidak duplikat dalam database.
 */
const isUniqueKanji = async (value: string | undefined, context: ValidationContext) => {
  if (!value) return true;
  const { document, getClient } = context;
  if (!document) return true;
  const client = getClient({ apiVersion: "2024-04-12" });
  const id = document._id.replace(/^drafts\./, "");

  const query = `*[_type == "kanji" && character == $value && _id != $draftId && _id != $publishedId][0]`;
  const params = { value, draftId: `drafts.${id}`, publishedId: id };
  const result = await client.fetch(query, params);

  return result
    ? `🚨 Kanji "${value}" sudah ada di database! Hindari duplikat.`
    : true;
};

// ======================
// SCHEMA DEFINITION
// ======================

export default defineType({
  name: "kanji",
  title: "Perpustakaan Kanji Global",
  type: "document",
  fields: [

    defineField({
      name: "character",
      type: "string",
      title: "Karakter Kanji",
      validation: (Rule) => Rule.required().custom(isUniqueKanji),
    }),

    defineField({
      name: "meaning",
      type: "string",
      title: "Arti (Bahasa Indonesia)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "onyomi",
      type: "string",
      title: "Onyomi (Katakana)",
    }),
    defineField({
      name: "kunyomi",
      type: "string",
      title: "Kunyomi (Hiragana)",
    }),
    defineField({
      name: "romaji",
      type: "string",
      title: "Romaji / Cara Baca Utama",
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "gradeLevel",
      title: "Grade Level",
      type: "string",
      description: "Contoh: Grade 1 (Kyouiku Kanji)",
    }),
    defineField({
      name: "showInFlashcard",
      type: "boolean",
      title: "Munculkan di Flashcard?",
      description: "Matikan (OFF) jika hanya untuk referensi UI materi.",
      initialValue: true,
    }),

    defineField({
      name: "strokeOrderSvg",
      title: "Stroke Order SVG Paths",
      type: "text",
      description: "Masukkan data path SVG (d attribute) atau XML lengkap untuk animasi goresan.",
    }),
    defineField({
      name: "radicals",
      title: "Radicals",
      type: "array",
      of: [{ type: "string" }],
    }),
    
    defineField({
      name: "mnemonics",
      title: "Mnemonic (Rich Content)",
      type: "array",
      of: [{ type: "block" }],
      description: "Gunakan Portable Text untuk mnemonic yang lebih kaya (gambar/bold).",
    }),
    defineField({
      name: "examples",
      title: "Contoh Kalimat",
      type: "array",
      of: [{ type: "exampleSentence" }],
      description: "Daftar contoh kalimat penggunaan karakter ini.",
    }),
  ],
  preview: {
    select: {
      title: "character",
      subtitle: "meaning",
      showInFlashcard: "showInFlashcard",
    },
    prepare({ title, subtitle, showInFlashcard }) {
      const isHidden = showInFlashcard === false ? " 🚷 (Hidden)" : "";
      const displayTitle = title || "Kosong";

      return {
        title: `${displayTitle}${isHidden}`,
        subtitle: subtitle || "Arti belum diisi",
      };
    },
  },
});
