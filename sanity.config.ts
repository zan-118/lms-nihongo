import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { structure } from "./sanity/structure";
import { GenerateAIAction } from "./sanity/actions/GenerateAIAction";

export default defineConfig({
  name: "default",
  title: "NihongoRoute CMS",

  projectId: "qoczxvvo",
  dataset: "production",

  plugins: [
    structureTool({
      structure,
    }),
    visionTool(),
  ],

  schema: {
    types: schema.types,
  },

  document: {
    actions: (prev, context) => {
      // Hanya tampilkan tombol AI pada tipe dokumen tertentu
      if (["vocab", "kanji", "verb_dictionary"].includes(context.schemaType)) {
        return [GenerateAIAction, ...prev];
      }
      return prev;
    },
  },
});
