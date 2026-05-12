/**
 * @file quiz.ts
 * @description Definisi skema Sanity untuk objek 'quiz' (pertanyaan kuis).
 * Digunakan sebagai komponen evaluasi interaktif dalam dokumen materi (lesson).
 * @module sanity/schemaTypes/quiz
 */

import { defineField, defineType } from "sanity";
import { KanaInput } from "../components/KanaInput";
import { AutoRomajiInput } from "../components/AutoRomajiInput";

// ======================
// SCHEMA DEFINITION
// ======================

export default defineType({
  name: "quiz",
  title: "Quiz",
  type: "object",
  fields: [
    defineField({
      name: "question",
      title: "Question (Japanese)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "questionFurigana",
      title: "Question Furigana",
      type: "string",
      components: { input: KanaInput },
    }),
    defineField({
      name: "questionRomaji",
      title: "Question Romaji",
      type: "string",
      components: { input: AutoRomajiInput },
      options: { sourceField: "questionFurigana" },
    }),
    defineField({
      name: "options",
      title: "Answer Options",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "text", title: "Option Text (JP)", type: "string" },
            { name: "furigana", title: "Option Furigana", type: "string", components: { input: KanaInput } },
            { name: "romaji", title: "Option Romaji", type: "string", components: { input: AutoRomajiInput } },
            {
              name: "isCorrect",
              title: "Is Correct?",
              type: "boolean",
              initialValue: false,
            },
          ],
        },
      ],
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "explanation",
      title: "Explanation (Optional)",
      type: "text",
      description: "Penjelasan jika user menjawab salah",
    }),
  ],
});
