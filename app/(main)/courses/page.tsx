/**
 * @file page.tsx
 * @description Halaman utama direktori silabus pembelajaran (Course Landing Page).
 * Mengambil kategori dari Sanity secara dinamis (JLPT, General, dll).
 * @module CoursesLandingPage
 */

import React from "react";
import { sanityFetch } from "@/lib/sanity.fetch";
import CoursesClient from "./CoursesClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pusat Belajar - Pilih Rute Kamu | NihongoRoute",
  description: "Pilih jalur belajar bahasa Jepangmu, mulai dari dasar Kana hingga persiapan JLPT N2.",
};


/**
 * Mengambil daftar kategori kursus dari Sanity CMS.
 */
async function getCategories() {
  const query = `*[_type == "course_category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    type,
    description,
    "previews": *[_type == "lesson" && references(^._id)] | order(orderNumber asc, _createdAt desc)[0...5] {
      _id, title, "slug": slug.current
    }
  }`;
  return await sanityFetch<any[]>({
    query,
    tags: ["course_category", "lesson"],
  });
}

export default async function CoursesLandingPage() {
  const categories = await getCategories();

  return <CoursesClient categories={categories} />;
}
