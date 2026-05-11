import { sanityFetch } from "@/lib/sanity.fetch";
import { readingListQuery } from "@/lib/queries";
import ReadingListClient from "./ReadingListClient";
import type { Metadata } from "next";

interface ReadingListMaterial {
  title: string;
  difficulty: string;
  slug: string;
  category?: string;
}

export const metadata: Metadata = {
  title: "Graded Reading | NihongoRoute",
  description: "Tingkatkan kemampuan membaca Anda dengan teks interaktif yang disesuaikan dengan level JLPT Anda.",
};

export default async function ReadingListPage() {
  const materials: ReadingListMaterial[] = await sanityFetch<ReadingListMaterial[]>({
    query: readingListQuery,
    tags: ["reading_material"],
  });

  return (
    <div className="w-full min-h-screen bg-background relative overflow-hidden pt-12 pb-24 px-4 md:px-8">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-primary/10 blur-[120px] rounded-[100%] pointer-events-none opacity-50" />
      <div className="neural-grid" />

      <div className="max-w-6xl mx-auto relative z-10">
        <ReadingListClient materials={materials} />
      </div>
    </div>
  );
}
