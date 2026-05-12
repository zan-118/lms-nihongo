/**
 * @file mockExam.ts
 * @description Definisi skema Sanity untuk dokumen 'mockExam' (simulasi ujian JLPT).
 * Mengatur struktur soal ujian multi-seksi (Kosakata, Tata Bahasa, Membaca, Mendengar) dengan dukungan audio dan gambar.
 * @module sanity/schemaTypes/mockExam
 */

import { defineField, defineType } from "sanity";
import { AutoSlugInput } from "../components/AutoSlugInput";
import { KanaInput } from "../components/KanaInput";
import { AutoRomajiInput } from "../components/AutoRomajiInput";

// ======================
// SCHEMA DEFINITION
// ======================

export default defineType({
  name: "mockExam",
  title: "Mock Exam (Tryout JLPT)",
  type: "document",
  fields: [

    defineField({
      name: "title",
      title: "Judul Ujian",
      type: "string",
      description: "Contoh: Simulasi JLPT N5 (Paket 1)",
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
      name: "course_category",
      title: "Level (Course Category)",
      type: "reference",
      to: [{ type: "course_category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "timeLimit",
      title: "Batas Waktu (Menit)",
      type: "number",
      initialValue: 105,
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "passingScore",
      title: "Nilai Kelulusan (Passing Score)",
      type: "number",
      initialValue: 80,
      description: "Minimal skor untuk lulus (contoh: 80 dari 180)",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "choukaiAudio",
      title: "Audio Sesi Choukai (Global)",
      type: "file",
      description:
        "Unggah satu file audio panjang untuk seluruh sesi mendengarkan (opsional). Jika diisi, aplikasi akan menggunakan file ini sebagai audio utama sesi Choukai.",
      options: { accept: "audio/*" },
    }),
    defineField({
      name: "questions",
      title: "Daftar Pertanyaan",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "section",
              title: "Bagian Ujian",
              type: "string",
              options: {
                list: [
                  { title: "Kosakata & Kanji (Moji/Goi)", value: "vocabulary" },
                  { title: "Tata Bahasa (Bunpou)", value: "grammar" },
                  { title: "Membaca (Dokkai)", value: "reading" },
                  { title: "Mendengar (Choukai)", value: "listening" },
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: "questionText",
              title: "Teks Pertanyaan / Konteks",
              type: "text",
              description:
                "Kosongkan jika pertanyaan sepenuhnya ada di dalam Audio/Gambar. BISA MENGGUNAKAN TAG HTML seperti <u>kata</u> untuk garis bawah.",
            },
            {
              name: "questionFurigana",
              title: "Question Furigana",
              type: "text",
              components: { input: KanaInput },
            },
            {
              name: "questionRomaji",
              title: "Question Romaji",
              type: "text",
              components: { input: AutoRomajiInput },
              options: { sourceField: "questionFurigana" },
            },
            {
              name: "image",
              title: "Gambar Soal (Opsional)",
              type: "image",
              options: { hotspot: true },
            },
            {
              name: "audio",
              title: "File Audio (Khusus Choukai)",
              type: "file",
              options: { accept: "audio/*" },
            },
            {
              name: "options",
              title: "Pilihan Jawaban",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    { name: "text", type: "string", title: "Teks Jawaban" },
                    { name: "furigana", type: "string", title: "Furigana", components: { input: KanaInput } },
                    { name: "romaji", type: "string", title: "Romaji", components: { input: AutoRomajiInput } },
                  ],
                },
              ],
              validation: (Rule) => Rule.required().min(3).max(4),
            },
            {
              name: "correctAnswer",
              title: "Index Jawaban Benar (0-3)",
              type: "number",
              validation: (Rule) => Rule.required().min(0).max(3),
            },
            {
              name: "explanation",
              title: "Penjelasan Jawaban (Opsional)",
              type: "text",
              description: "Penjelasan mengapa jawaban ini benar (berguna untuk mode Review Ujian).",
            },
            {
              name: "passageText",
              title: "Teks Cerita / Passage (Khusus Dokkai)",
              type: "text",
              description: "Gunakan field ini pada soal PERTAMA dari sebuah teks bacaan Dokkai yang panjang.",
            },
            {
              name: "passageFurigana",
              title: "Passage Furigana",
              type: "text",
              components: { input: KanaInput },
            },
            {
              name: "passageRomaji",
              title: "Passage Romaji",
              type: "text",
              components: { input: AutoRomajiInput },
              options: { sourceField: "passageFurigana" },
            },
          ],
          preview: {
            select: {
              title: "questionText",
              subtitle: "section",
              media: "image",
            },
            prepare({ title, subtitle, media }) {
              const sectionLabels: Record<string, string> = {
                vocabulary: "📝 Kosakata/Kanji",
                grammar: "🎯 Tata Bahasa",
                reading: "📖 Membaca",
                listening: "🎧 Mendengar",
              };
              return {
                title: title
                  ? title.replace(/<[^>]*>?/gm, "")
                  : "[Soal Gambar/Audio Tanpa Teks]", // Hapus tag HTML di preview
                subtitle: sectionLabels[subtitle] || subtitle,
                media: media || undefined,
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "course_category.title",
    },
    prepare({ title, subtitle }) {
      return {
        title: title,
        subtitle: subtitle || "",
      };
    },
  },
});
