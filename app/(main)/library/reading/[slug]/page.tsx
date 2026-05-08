import { sanityFetch } from "@/lib/sanity.fetch";
import { readingMaterialQuery } from "@/lib/queries";
import ReadingPageClient from "./ReadingPageClient";
import { notFound } from "next/navigation";

export default async function ReadingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await sanityFetch({
    query: readingMaterialQuery,
    params: { slug },
    tags: ["readingMaterial"],
  });

  if (!data) {
    notFound();
  }

  return <ReadingPageClient data={data} />;
}
