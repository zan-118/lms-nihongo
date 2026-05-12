import { sanityFetch } from "@/lib/sanity.fetch";
import { listeningTaskQuery } from "@/lib/queries";
import ListeningPageClient from "./ListeningPageClient";
import { notFound } from "next/navigation";
import { ListeningTaskData } from "@/components/features/listening/types";

export default async function ListeningPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const data = await sanityFetch<ListeningTaskData | null>({
    query: listeningTaskQuery,
    params: { slug: decodedSlug },
    tags: ["listeningTask"],
  });

  if (!data) {
    notFound();
  }

  return <ListeningPageClient data={data} />;
}
