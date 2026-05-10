import { defineField, defineType } from "sanity";
import { Headphones } from "lucide-react";

export const listeningTask = defineType({
  name: "listeningTask",
  title: "Listening Task",
  type: "document",
  icon: Headphones,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "audioFile",
      title: "Audio File",
      type: "file",
      options: {
        accept: "audio/*",
      },
    }),
    defineField({
      name: "transcript",
      title: "Transcript",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "speaker",
              title: "Speaker",
              type: "string",
            }),
            defineField({
              name: "text",
              title: "Japanese Text",
              type: "array", // Portable text to support VocabTrigger
              of: [{ type: "block" }],
            }),
            defineField({
              name: "translation",
              title: "Translation (Indonesian)",
              type: "string",
            }),
            defineField({
              name: "startTime",
              title: "Start Time (Seconds)",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),
            defineField({
              name: "endTime",
              title: "End Time (Seconds)",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),
          ],
          preview: {
            select: {
              title: "speaker",
              subtitle: "startTime",
            },
            prepare({ title, subtitle }) {
              return {
                title: title || "Dialogue",
                subtitle: `Starts at: ${subtitle}s`,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "quiz",
      title: "Post-Listening Quiz",
      type: "array",
      of: [{ type: "reference", to: [{ type: "quiz" }] }],
    }),
  ],
});
export default listeningTask;
