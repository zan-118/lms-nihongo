/**
 * @file grammarArticle.ts
 * @description Definisi skema Sanity untuk dokumen 'grammar_article' (artikel tata bahasa).
 * Menyediakan struktur konten berbasis blok (Portable Text) untuk penjelasan tata bahasa yang mendalam.
 * @module sanity/schemaTypes/grammarArticle
 */

import { defineType, defineField } from "sanity";

// ======================
// SCHEMA DEFINITION
// ======================

export default defineType({
  name: "grammar_article",
  title: "Grammar Article",
  type: "document",
  fields: [
    defineField({
      name: "grammarId",
      title: "Grammar ID",
      type: "string",
      description: "Contoh: GRM-N5-01",
    }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
    }),
    defineField({
      name: "course_category",
      title: "Course Category",
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
      name: "notes",
      title: "Catatan (Notes)",
      type: "text",
      description: "Penjelasan nuansa atau tips penggunaan tata bahasa ini.",
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
      customId: "grammarId",
      systemId: "_id",
    },
    prepare({ title, subtitle, customId, systemId }) {
      const displayTitle = customId ? `[${customId}] ${title}` : title;
      return {
        title: displayTitle,
        subtitle: `SysID: ${systemId} | ${subtitle || ""}`,
      };
    },
  },
});
