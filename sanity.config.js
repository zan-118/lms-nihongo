"use client"; // Tambahkan ini di baris pertama

import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { schema } from "./sanity/schemaTypes";

export default defineConfig({
  name: "default",
  title: "NihongoPath CMS",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  basePath: "/studio",
  plugins: [deskTool()],
  schema: schema,
});
