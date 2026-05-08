import { sanityFetch } from "@/lib/sanity.fetch";
import DashboardClient from "./DashboardClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | NihongoRoute",
  description: "Pantau progres belajar bahasa Jepang Anda, kelola jadwal SRS, dan taklukkan quest harian.",
};

async function getCourseMetadata() {
  const query = `*[_type == "course_category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    "lessons": *[_type == "lesson" && references(^._id)] | order(orderNumber asc, _createdAt desc) {
      _id,
      title,
      "slug": slug.current
    }
  }`;
  return await sanityFetch({
    query,
    tags: ["course_category", "lesson"],
  });
}

export default async function DashboardPage() {
  const courseMetadata = await getCourseMetadata();

  return (
    <div className="w-full min-h-screen bg-background relative overflow-hidden pt-12 pb-24 px-4 md:px-8 transition-colors duration-300">
      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-cyber-neon/5 dark:bg-cyber-neon/10 blur-[120px] rounded-[100%] pointer-events-none opacity-50" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="neural-grid" />

      <DashboardClient courseMetadata={courseMetadata} />
    </div>
  );
}
