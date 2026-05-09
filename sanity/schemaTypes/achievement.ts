import { defineType, defineField } from "sanity";
import { Trophy } from "lucide-react";

export default defineType({
  name: "achievement",
  title: "Sistem Gamifikasi (Achievement)",
  type: "document",
  icon: Trophy,
  fields: [
    defineField({
      name: "achievementId",
      title: "Achievement ID",
      type: "string",
      description: "Contoh: ACH-FIRST-VOCAB",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Judul Achievement",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Deskripsi",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Ikon (Image/String)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "xpReward",
      title: "Hadiah XP",
      type: "number",
      initialValue: 10,
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
});
