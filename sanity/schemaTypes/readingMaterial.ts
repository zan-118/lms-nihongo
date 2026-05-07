import { defineType, defineField } from "sanity";
import { BookOpen } from "lucide-react";

export default defineType({
  name: "readingMaterial",
  title: "Graded Reading",
  type: "document",
  icon: BookOpen,
  fields: [
    defineField({
      name: "title",
      title: "Judul",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "difficulty",
      title: "Level JLPT",
      type: "string",
      options: {
        list: [
          { title: "N5", value: "N5" },
          { title: "N4", value: "N4" },
          { title: "N3", value: "N3" },
          { title: "N2", value: "N2" },
          { title: "N1", value: "N1" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "reference",
      to: [{ type: "course_category" }],
    }),
    defineField({
      name: "audioFile",
      title: "File Audio (Native)",
      type: "file",
      options: {
        accept: "audio/*",
      },
    }),
    defineField({
      name: "isTTSDisabled",
      title: "Matikan TTS Otomatis",
      description: "Centang jika tidak ingin menggunakan suara AI jika file audio native tidak ada.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "body",
      title: "Bacaan Asli (Kanji/Kana)",
      description: "Teks asli dalam bahasa Jepang. Gunakan baris baru untuk paragraf.",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "hiragana",
      title: "Full Hiragana",
      description: "Versi Hiragana lengkap dari teks di atas untuk pembentukan Furigana otomatis.",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "translation",
      title: "Terjemahan (Bahasa Indonesia)",
      description: "Terjemahan cerita untuk membantu pemahaman.",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "difficulty",
    },
  },
});
