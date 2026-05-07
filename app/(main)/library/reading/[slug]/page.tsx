import { client } from "@/sanity/lib/client";
import { readingMaterialQuery } from "@/lib/queries";
import ReadingPageClient from "./ReadingPageClient";
import { notFound } from "next/navigation";

export default async function ReadingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await client.fetch(readingMaterialQuery, { slug });

  if (!data) {
    notFound();
  }

  return <ReadingPageClient data={data} />;
}
