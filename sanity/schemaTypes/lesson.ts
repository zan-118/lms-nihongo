/**
 * @file lesson.ts
 * @description Definisi skema Sanity untuk dokumen 'lesson' (materi pembelajaran).
 * Mengatur struktur konten materi, referensi kosakata, artikel, dan kuis terkait.
 * @module sanity/schemaTypes/lesson
 */

import { defineType, defineField } from "sanity";
import { AutoSlugInput } from "../components/AutoSlugInput";

// ======================
// SCHEMA DEFINITION
// ======================

export default defineType({
  name: "lesson",
  title: "Lesson",
  type: "document",
  fields: [

    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      components: {
        input: AutoSlugInput,
      },
    }),
    defineField({ name: "orderNumber", title: "Order Number", type: "number" }),
    defineField({
      name: "mainImage",
      title: "Thumbnail / Cover Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "estimatedMinutes",
      title: "Estimasi Waktu Baca (Menit)",
      type: "number",
      initialValue: 5,
    }),
    defineField({
      name: "isPremium",
      title: "Konten Premium? 💎",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "summary", title: "Summary", type: "text" }),
    defineField({
      name: "course_category",
      title: "Course Category",
      type: "reference",
      to: [{ type: "course_category" }],
    }),
    defineField({
      name: "vocabList",
      title: "Vocab List",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "vocab" }, { type: "verb_dictionary" }],
        },
      ],
    }),
    defineField({
      name: "referenceWords",
      title: "Reference Words",
      type: "array",
      of: [{ type: "reference", to: [{ type: "vocab" }] }],
    }),
    defineField({
      name: "articles",
      title: "Artikel Materi",
      type: "blockContent",
      description: "Gunakan Portable Text untuk menyusun artikel pembelajaran.",
    }),
    defineField({
      name: "grammar",
      title: "Materi Tata Bahasa",
      type: "blockContent",
      description: "Penjelasan tata bahasa menggunakan Portable Text.",
    }),
    defineField({
      name: "quizzes",
      title: "Quizzes",
      type: "array",
      of: [{ type: "quiz" }],
    }),
    defineField({
      name: "is_published",
      title: "Is Published?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description: "Idealnya maksimal 60 karakter.",
      validation: (Rule) => Rule.max(60).warning("SEO Title yang terlalu panjang mungkin terpotong di Google."),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      description: "Ringkasan konten untuk hasil pencarian Google (Maks 160 karakter).",
      validation: (Rule) => Rule.max(160).warning("SEO Description sebaiknya tidak lebih dari 160 karakter."),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "summary",
    },
    prepare({ title, subtitle }) {
      return {
        title: title,
        subtitle: subtitle || "No summary",
      };
    },
  },
});
