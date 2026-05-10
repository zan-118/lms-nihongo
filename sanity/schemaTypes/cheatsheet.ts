/**
 * @file cheatsheet.ts
 * @description Definisi skema Sanity untuk dokumen 'cheatsheet' (referensi cepat).
 * Memungkinkan penggabungan data dari database kosakata global dan item manual untuk topik khusus.
 * @module sanity/schemaTypes/cheatsheet
 */

import { defineField, defineType } from "sanity";
import { AutoSlugInput } from "../components/AutoSlugInput";

// ======================
// SCHEMA DEFINITION
// ======================

export default defineType({
  name: "cheatsheet",
  title: "Cheatsheet (Referensi Cepat)",
  type: "document",
  fields: [

    defineField({
      name: "title",
      title: "Judul Cheatsheet",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      components: {
        input: AutoSlugInput,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      options: {
        list: [
          "Angka & Matematika",
          "Waktu & Tanggal",
          "Kata Bantu Bilangan (Counter)",
          "Keluarga & Relasi",
          "Aturan Partikel & Grammar",
          "Topik Khusus Lainnya",
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "linkedVocab",
      title: "Tarik dari Kosakata Global",
      type: "array",
      description:
        "Gunakan ini untuk menarik kosakata yang sudah ada di database tanpa perlu mengetik ulang.",
      of: [{ type: "reference", to: [{ type: "vocab" }] }],
    }),
    defineField({
      name: "items",
      title: "Item Manual (Opsional)",
      type: "array",
      description: "Gunakan ini HANYA jika datanya bukan kosakata biasa.",
      of: [
        {
          type: "object",
          fields: [

            { name: "label", title: "Konteks / Arti", type: "string" },
            { name: "jp", title: "Bahasa Jepang / Rumus", type: "string" },
            { name: "romaji", title: "Romaji", type: "string" },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
    },
    prepare({ title, subtitle }) {
      return {
        title: title,
        subtitle: subtitle,
      };
    },
  },
});
