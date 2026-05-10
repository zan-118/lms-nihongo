import { defineType, defineField } from "sanity";
import { MessageSquare } from "lucide-react";

export default defineType({
  name: "dialogueBlock",
  type: "object",
  title: "Dialogue Block",
  icon: MessageSquare,
  fields: [
    defineField({
      name: "lines",
      type: "array",
      title: "Dialog Lines",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "speakerName",
              type: "string",
              title: "Nama Pembicara",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "text",
              type: "array",
              title: "Pesan/Teks",
              of: [{ type: "block" }],
              description: "Mendukung Portable Text (termasuk Furigana Annotation).",
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
    }),
  ],
});
