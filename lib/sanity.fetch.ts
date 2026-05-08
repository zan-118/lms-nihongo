import { client } from "@/sanity/lib/client";

/**
 * Helper function for Sanity data fetching with Next.js 15 App Router caching features.
 * Supports On-Demand ISR via tags.
 * 
 * @param query - The GROQ query string
 * @param params - Optional parameters for the query
 * @param tags - Optional tags for revalidation (e.g., ['vocab', 'lesson'])
 */
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags = [],
}: {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
}) {
  return client.fetch<QueryResponse>(query, params, {
    next: {
      revalidate: false, // Disables time-based revalidation in favor of tags
      tags,
    },
  });
}
