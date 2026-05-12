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
      title: "Daftar Kosakata",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "vocab" }, { type: "verb_dictionary" }],
        },
      ],
      description: "Kosakata utama yang dipelajari di lesson ini.",
    }),
    defineField({
      name: "kanjiList",
      title: "Daftar Kanji",
      type: "array",
      of: [{ type: "reference", to: [{ type: "kanji" }] }],
      description: "Kanji yang diperkenalkan atau dipelajari di lesson ini.",
    }),
    defineField({
      name: "grammar",
      title: "Tata Bahasa (Inline)",
      type: "blockContent",
      description: "Gunakan ini untuk penjelasan tata bahasa singkat langsung di lesson.",
    }),
    defineField({
      name: "grammarList",
      title: "Hubungkan Library Grammar",
      type: "array",
      of: [{ type: "reference", to: [{ type: "grammar_article" }] }],
      description: "Hubungkan dengan artikel tata bahasa mendalam dari Library.",
    }),
    defineField({
      name: "articles",
      title: "Artikel Materi (Inline)",
      type: "blockContent",
      description: "Gunakan ini untuk penjelasan teks langsung di dalam lesson.",
    }),
    defineField({
      name: "listeningList",
      title: "Latihan Mendengar",
      type: "array",
      of: [{ type: "reference", to: [{ type: "listeningTask" }] }],
    }),
    defineField({
      name: "readingList",
      title: "Bahan Bacaan",
      type: "array",
      of: [{ type: "reference", to: [{ type: "readingMaterial" }] }],
    }),
    defineField({
      name: "cheatsheets",
      title: "Referensi Cepat (Cheatsheets)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "cheatsheet" }] }],
    }),
    defineField({
      name: "quizzes",
      title: "Kuis Pendek (Inline)",
      type: "array",
      of: [{ type: "quiz" }],
    }),
    defineField({
      name: "finalPractice",
      title: "Ujian/Latihan Akhir",
      type: "reference",
      to: [{ type: "mockExam" }],
      description: "Hubungkan dengan simulasi ujian atau latihan komprehensif.",
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
