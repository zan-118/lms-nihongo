import { sanityFetch } from "@/lib/sanity.fetch";
import { listeningTaskQuery } from "@/lib/queries";
import ListeningPageClient from "./ListeningPageClient";
import { notFound } from "next/navigation";

export default async function ListeningPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data: any = await sanityFetch<any>({
    query: listeningTaskQuery,
    params: { slug },
    tags: ["listening_task"],
  });

  if (!data) {
    notFound();
  }

  return <ListeningPageClient data={data} />;
}
