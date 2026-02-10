export const materiType = {
  name: "materi",
  title: "Materi Pembelajaran",
  type: "document",
  fields: [
    {
      name: "orderIndex",
      title: "Urutan Materi (Angka)",
      type: "number",
      description: "Contoh: 1 untuk bab pertama, 2 untuk bab kedua",
    },
    { name: "title", title: "Judul Materi", type: "string" },
    {
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
    },
    {
      name: "category",
      title: "Kategori",
      type: "string",
      options: { list: ["N5", "N4", "N3", "Grammar", "Kanji"] },
    },
    {
      name: "content",
      title: "Isi Materi",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    },
    {
      name: "quizReference",
      title: "Hubungkan ke Paket Kuis (Opsional)",
      description:
        "Masukkan Slug Paket Soal yang ingin dimunculkan di akhir materi ini",
      type: "string",
    },
  ],
};
