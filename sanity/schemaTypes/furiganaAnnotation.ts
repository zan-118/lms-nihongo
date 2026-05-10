import { defineType, defineField } from "sanity";
import { KanaInput } from "../components/KanaInput";

export default defineType({
  name: "furigana",
  type: "object",
  title: "Furigana",
  fields: [
    defineField({
      name: "reading",
      type: "string",
      title: "Bacaan (Reading)",
      description: "Masukkan cara baca (Hiragana) untuk teks yang dipilih.",
      components: {
        input: KanaInput,
      },
      validation: (Rule) => Rule.required().error("Bacaan furigana wajib diisi."),
    }),
  ],
});
