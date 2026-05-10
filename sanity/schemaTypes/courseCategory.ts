/**
 * @file courseCategory.ts
 * @description Definisi skema Sanity untuk dokumen 'course_category' (kategori kursus).
 * Mengelompokkan materi pembelajaran berdasarkan level JLPT, topik umum, atau simulasi ujian.
 * @module sanity/schemaTypes/courseCategory
 */

import { defineType, defineField } from "sanity";
import { AutoSlugInput } from "../components/AutoSlugInput";

// ======================
// SCHEMA DEFINITION
// ======================

export default defineType({
  name: "course_category",
  title: "Course Category",
  type: "document",
  fields: [

    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "Category Type",
      type: "string",
      options: {
        list: [
          { title: "JLPT Curriculum", value: "jlpt" },
          { title: "General Topics", value: "general" },
          { title: "Simulations / Exams", value: "exam" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      components: {
        input: AutoSlugInput,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "type",
    },
    prepare({ title, subtitle }) {
      return {
        title: title,
        subtitle: `Type: ${subtitle}`,
      };
    },
  },
});
