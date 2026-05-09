import { defineType, defineArrayMember } from "sanity";

/**
 * Ini adalah skema utama untuk Rich Text (Portable Text) di NihongoRoute.
 * Menggabungkan standar teks dengan objek kustom (Image, Callout, Dialog, YouTube).
 */
export default defineType({
  title: "Block Content",
  name: "blockContent",
  type: "array",
  of: [
    defineArrayMember({
      title: "Block",
      type: "block",
      // Styles define the visual appearance of blocks in the editor
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [{ title: "Bullet", value: "bullet" }],
      // Marks let you mark up inline text
      marks: {
        // Decorators usually represent a single property
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Underline", value: "underline" },
          { title: "Code", value: "code" },
          {
            title: "Highlight",
            value: "highlight",
            icon: () => "H",
          },
        ],
        // Annotations can be any object structure
        annotations: [
          {
            title: "URL",
            name: "link",
            type: "object",
            fields: [
              {
                title: "URL",
                name: "href",
                type: "url",
              },
            ],
          },
          {
            title: "Furigana",
            name: "furigana",
            type: "furigana", // Mengacu pada furiganaAnnotation.ts
          },
        ],
      },
    }),
    // Memasukkan gambar kustom
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Penting untuk aksesibilitas (SEO).",
        },
      ],
    }),
    // Objek Kustom lainnya
    defineArrayMember({ type: "callout" }), // Pastikan callout sudah ada di schemaTypes
    defineArrayMember({ type: "exampleSentence" }),
    defineArrayMember({ type: "dialogueBlock" }),
    defineArrayMember({ type: "youtubeEmbed" }),
  ],
});
