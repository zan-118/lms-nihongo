import { client } from "@/sanity/lib/client";
import { listeningTaskQuery } from "@/lib/queries";
import ListeningPageClient from "./ListeningPageClient";
import { notFound } from "next/navigation";

export default async function ListeningPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await client.fetch(listeningTaskQuery, { slug });

  if (!data) {
    notFound();
  }

  return <ListeningPageClient data={data} />;
}
