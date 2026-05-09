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
              type: "text",
              title: "Pesan/Teks",
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
    }),
  ],
});
