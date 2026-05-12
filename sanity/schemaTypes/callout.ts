import { defineField, defineType } from "sanity";
import { KanaInput } from "../components/KanaInput";
import { AutoRomajiInput } from "../components/AutoRomajiInput";

/**
 * @file callout.ts
 * @description Definisi skema Sanity untuk objek 'callout' (kotak informasi/catatan).
 * Digunakan sebagai komponen visual dalam blok konten untuk menonjolkan informasi penting.
 */

export default defineType({
  name: "callout",
  title: "Callout / Info Box",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Judul (Contoh: Aturan Grammar, Pengecualian)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "Tipe Visual",
      type: "string",
      options: {
        list: [
          { title: "Grammar (Cyan)", value: "grammar" },
          { title: "Info (Biru)", value: "info" },
          { title: "Warning (Kuning)", value: "warning" },
        ],
        layout: "radio",
      },
      initialValue: "grammar",
    }),
    defineField({
      name: "text",
      title: "Isi Konten",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "furigana",
      title: "Furigana",
      type: "text",
      components: { input: KanaInput },
    }),
    defineField({
      name: "romaji",
      title: "Romaji",
      type: "text",
      components: { input: AutoRomajiInput },
    }),
  ],
});
