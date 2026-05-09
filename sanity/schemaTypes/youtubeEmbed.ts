import { defineType, defineField } from "sanity";
import { Youtube } from "lucide-react";

export default defineType({
  name: "youtubeEmbed",
  type: "object",
  title: "YouTube Embed",
  icon: Youtube,
  fields: [
    defineField({
      name: "url",
      type: "url",
      title: "URL Video YouTube",
      description: "Contoh: https://www.youtube.com/watch?v=...",
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ["http", "https"],
        }),
    }),
  ],
});
