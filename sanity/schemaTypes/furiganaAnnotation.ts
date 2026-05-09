import { defineType, defineField } from "sanity";

export default defineType({
  name: "furigana",
  type: "object",
  title: "Furigana",
  fields: [
    defineField({
      name: "reading",
      type: "string",
      title: "Bacaan (Reading)",
      description: "Masukkan cara baca (Hiragana/Katakana) untuk teks yang dipilih.",
      validation: (Rule) => Rule.required().error("Bacaan furigana wajib diisi."),
    }),
  ],
});
