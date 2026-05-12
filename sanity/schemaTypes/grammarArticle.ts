import { defineType, defineField } from "sanity";
import { AutoSlugInput } from "../components/AutoSlugInput";
import { AutoFuriganaInput } from "../components/AutoFuriganaInput";
import { AutoRomajiInput } from "../components/AutoRomajiInput";

// ======================
// SCHEMA DEFINITION
// ======================

export default defineType({
  name: "grammar_article",
  title: "Grammar Article",
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
    defineField({
      name: "course_category",
      title: "Course Category",
      type: "reference",
      to: [{ type: "course_category" }],
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
      name: "formalityLevel",
      title: "Tingkat Kesopanan (Formality)",
      type: "string",
      options: {
        list: [
          { title: "Casual (Biasa)", value: "casual" },
          { title: "Polite (Sopan)", value: "polite" },
          { title: "Keigo (Hormat)", value: "keigo" },
        ],
      },
    }),
    defineField({ name: "meaning", title: "Meaning / Focus", type: "string" }),
    defineField({
      name: "content",
      title: "Isi Materi (Portable Text)",
      type: "blockContent",
      description: "Gunakan Portable Text untuk penjelasan yang kaya (Rich Text).",
    }),
    defineField({
      name: "formation",
      title: "Rumus (Formation)",
      type: "string",
      description: "Contoh: V-ta / N-no + あげく",
    }),
    defineField({
      name: "formationFurigana",
      title: "Rumus Furigana",
      type: "string",
      components: { input: AutoFuriganaInput },
      options: { sourceField: "formation" },
    }),
    defineField({
      name: "formationRomaji",
      title: "Rumus Romaji",
      type: "string",
      components: { input: AutoRomajiInput },
      options: { sourceField: "formationFurigana" },
    }),
    defineField({
      name: "notes",
      title: "Catatan (Notes)",
      type: "text",
      description: "Penjelasan nuansa atau tips penggunaan tata bahasa ini.",
    }),
    defineField({
      name: "examples",
      title: "Contoh Kalimat (Terstruktur)",
      type: "array",
      of: [{ type: "exampleSentence" }],
      description: "Contoh kalimat baku yang bisa diekstrak menjadi Flashcard otomatis.",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description: "Maks 60 karakter.",
      validation: (Rule) => Rule.max(60).warning("SEO Title terlalu panjang."),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 2,
      description: "Maks 160 karakter.",
      validation: (Rule) => Rule.max(160).warning("SEO Description terlalu panjang."),
    }),
    defineField({
      name: "relatedGrammar",
      title: "Tata Bahasa Terkait",
      type: "array",
      of: [{ type: "reference", to: [{ type: "grammar_article" }] }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "meaning",
    },
    prepare({ title, subtitle }) {
      return {
        title: title,
        subtitle: subtitle || "",
      };
    },
  },
});
