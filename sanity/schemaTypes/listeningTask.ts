import { defineField, defineType } from "sanity";
import { Headphones } from "lucide-react";
import { AutoSlugInput } from "../components/AutoSlugInput";
import { KanaInput } from "../components/KanaInput";
import { AutoRomajiInput } from "../components/AutoRomajiInput";

export default defineType({
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
      components: {
        input: AutoSlugInput,
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
            {
              name: "speaker",
              title: "Speaker",
              type: "string",
            },
            {
              name: "text",
              title: "Japanese Text (Portable Text)",
              type: "array",
              of: [{ type: "block" }],
            },
            {
              name: "furigana",
              title: "Furigana (Plain)",
              type: "text",
              components: { input: KanaInput },
            },
            {
              name: "romaji",
              title: "Romaji (Plain)",
              type: "text",
              components: { input: AutoRomajiInput },
            },
            {
              name: "translation",
              title: "Translation (Indonesian)",
              type: "string",
            },
            {
              name: "startTime",
              title: "Start Time (Seconds)",
              type: "number",
              validation: (Rule: any) => Rule.required().min(0),
            },
            {
              name: "endTime",
              title: "End Time (Seconds)",
              type: "number",
              validation: (Rule: any) => Rule.required().min(0),
            },
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
      of: [{ type: "quiz" }],
    }),
  ],
});
