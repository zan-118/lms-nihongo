import { StructureResolver } from "sanity/structure";
import { 
  Book, 
  Library, 
  GraduationCap, 
  Trophy, 
  Dictionary, 
  FileText, 
  CheckCircle, 
  Languages 
} from "lucide-react";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("NihongoRoute Content Hub")
    .items([
      // --- FOLDER: KAMUS GLOBAL ---
      S.listItem()
        .title("📚 Kamus Global")
        .icon(Library)
        .child(
          S.list()
            .title("Database Kosakata & Kanji")
            .items([
              S.documentTypeListItem("vocab").title("Daftar Kosakata").icon(Languages),
              S.documentTypeListItem("verb_dictionary").title("Kamus Kata Kerja").icon(Dictionary),
              S.documentTypeListItem("kanji").title("Perpustakaan Kanji").icon(FileText),
            ])
        ),

      // --- FOLDER: KURIKULUM AKADEMIK ---
      S.listItem()
        .title("🏫 Kurikulum Akademik")
        .icon(GraduationCap)
        .child(
          S.list()
            .title("Materi & Kurikulum")
            .items([
              S.documentTypeListItem("lesson").title("Materi Pelajaran").icon(Book),
              S.documentTypeListItem("grammar_article").title("Artikel Tata Bahasa"),
              S.documentTypeListItem("readingMaterial").title("Graded Reading"),
              S.documentTypeListItem("course_category").title("Kategori Kursus"),
              S.documentTypeListItem("cheatsheet").title("Cheatsheets"),
            ])
        ),

      // --- FOLDER: PUSAT EVALUASI ---
      S.listItem()
        .title("🎯 Pusat Evaluasi")
        .icon(CheckCircle)
        .child(
          S.list()
            .title("Kuis & Ujian")
            .items([
              S.documentTypeListItem("mockExam").title("Simulasi Ujian JLPT"),
              S.documentTypeListItem("quiz").title("Bank Kuis"),
              S.documentTypeListItem("listeningTask").title("Tugas Mendengar"),
            ])
        ),

      // --- FOLDER: SISTEM GAMIFIKASI ---
      S.listItem()
        .title("⚙️ Sistem Gamifikasi")
        .icon(Trophy)
        .child(
          S.documentTypeListItem("achievement").title("Pencapaian (Achievements)")
        ),

      S.divider(),
      
      // Sisanya yang tidak masuk kategori (jika ada)
      ...S.documentTypeListItems().filter(
        (listItem) => ![
          "vocab", "verb_dictionary", "kanji", 
          "lesson", "grammar_article", "readingMaterial", 
          "course_category", "cheatsheet",
          "mockExam", "quiz", "listeningTask",
          "achievement"
        ].includes(listItem.getId() as string)
      ),
    ]);
