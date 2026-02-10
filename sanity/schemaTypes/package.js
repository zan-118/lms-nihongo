export const quizPackageType = {
  name: "quizPackage",
  title: "Paket Soal",
  type: "document",
  fields: [
    {
      name: "packageName",
      title: "Nama Paket",
      type: "string",
      description: "Contoh: JLPT N5 Mock Test",
    },
    {
      name: "slug",
      title: "Slug (ID Paket)",
      type: "slug",
      options: { source: "packageName" },
    },
    {
      name: "isTryout", // TAMBAHKAN INI DI SINI
      title: "Apakah ini Tryout Besar?",
      type: "boolean",
      initialValue: false,
      description: "Jika ON, akan muncul di Dashboard sebagai Simulasi Ujian.",
    },
    {
      name: "category",
      title: "Kategori",
      type: "string",
      options: {
        list: ["Hiring", "JLPT N5", "JLPT N4", "Kanji Quiz"],
      },
    },
    {
      name: "timeLimit",
      title: "Batas Waktu (Menit)",
      type: "number",
      initialValue: 20,
    },
  ],
};
