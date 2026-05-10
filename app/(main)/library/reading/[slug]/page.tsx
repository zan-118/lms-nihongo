import { sanityFetch } from "@/lib/sanity.fetch";
import { readingMaterialQuery } from "@/lib/queries";
import ReadingPageClient from "./ReadingPageClient";
import { notFound } from "next/navigation";

export default async function ReadingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data: any = await sanityFetch<any>({
    query: readingMaterialQuery,
    params: { slug },
    tags: ["reading_material"],
  });

  if (!data) {
    notFound();
  }

  return <ReadingPageClient data={data} />;
}
