import { sanityFetch } from "@/lib/sanity.fetch";
import { readingMaterialQuery } from "@/lib/queries";
import ReadingPageClient from "./ReadingPageClient";
import { notFound } from "next/navigation";
import { ReadingData } from "@/components/features/reading/types";

export default async function ReadingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await sanityFetch<ReadingData | null>({
    query: readingMaterialQuery,
    params: { slug },
    tags: ["reading_material"],
  });

  if (!data) {
    notFound();
  }

  return <ReadingPageClient data={data} />;
}
