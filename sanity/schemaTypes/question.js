export const questionType = {
  name: "question",
  title: "Bank Soal",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Nama Internal (Hanya untuk Admin)",
      type: "string",
    },
    { name: "order", type: "number", title: "Urutan Soal" },
    {
      name: "category", // TAMBAHKAN INI
      title: "Kategori Sesi",
      type: "string",
      description: "Tentukan soal ini masuk sesi mana untuk penilaian JLPT/JFT",
      options: {
        list: [
          {
            title: "Moji-Go / Bunpou (Language Knowledge)",
            value: "languageKnowledge",
          },
          { title: "Dokkai (Reading)", value: "reading" },
          { title: "Choukai (Listening)", value: "listening" },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "package",
      title: "Pilih Paket Soal",
      type: "reference",
      to: [{ type: "quizPackage" }],
      validation: (Rule) => Rule.required(),
    },
    { name: "questionText", title: "Teks Soal", type: "text" },
    {
      name: "image",
      title: "Gambar Soal (Opsional)",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "audio",
      title: "Audio Choukai (Opsional)",
      type: "file",
      options: { accept: "audio/*" },
    },
    {
      name: "options",
      title: "Pilihan Jawaban (Harus 4)",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.min(4).max(4),
    },
    {
      name: "correctAnswer",
      title: "Index Jawaban Benar (0-3)",
      type: "number",
      validation: (Rule) => Rule.min(0).max(3),
    },
  ],
};
