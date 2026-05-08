import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | NihongoRoute",
  description: "Kebijakan Privasi pengguna platform NihongoRoute.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground py-16 px-6 md:px-12 flex justify-center">
      <div className="max-w-3xl w-full">
        {/* Header Jepang */}
        <header className="mb-16 border-b border-border pb-8">
          <h1 className="text-4xl md:text-5xl font-black text-foreground font-japanese tracking-tight mb-3">
            プライバシーポリシー
          </h1>
          <p className="text-sm md:text-base font-bold text-primary text-primary uppercase tracking-widest">
            Privacy Policy (Kebijakan Privasi)
          </p>
        </header>

        {/* Konten Tipografi Minimalis */}
        <article className="prose prose-slate dark:prose-invert prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary max-w-none mb-20">
          <p className="lead font-medium text-muted-foreground">
            Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
          </p>

          <h2>1. Pendahuluan</h2>
          <p>
            Selamat datang di <strong>NihongoRoute</strong>. Kami menghargai privasi Anda dan berkomitmen penuh untuk melindungi informasi pribadi Anda. Dokumen ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan menjaga data Anda saat menggunakan platform edukasi non-komersial kami.
          </p>

          <h2>2. Data yang Kami Kumpulkan</h2>
          <p>Karena NihongoRoute beroperasi dengan prinsip &quot;Offline-First&quot; dan menjunjung tinggi privasi, kami mengumpulkan data yang sangat minimal, yaitu:</p>
          <ul>
            <li><strong>Data Profil (Opsional)</strong>: Nama dan alamat surel (email) apabila Anda memilih untuk masuk log (login) guna menyinkronkan progres Anda ke penyimpanan awan (cloud).</li>
            <li><strong>Data Progres Belajar</strong>: Riwayat penyelesaian materi, perolehan XP (Experience Points), dan riwayat ulasan algoritma Spaced Repetition System (SRS).</li>
          </ul>

          <h2>3. Penggunaan Data</h2>
          <p>Data yang kami kumpulkan murni digunakan untuk meningkatkan pengalaman belajar Anda, dengan rincian:</p>
          <ul>
            <li>Menyimpan dan mengembalikan progres belajar lintas perangkat secara mulus.</li>
            <li>Menghitung algoritma pengulangan materi (SRS) secara akurat dan terpersonalisasi agar Anda bisa menguasai kosakata lebih efisien.</li>
            <li>Mengidentifikasi area untuk meningkatkan kualitas konten NihongoRoute di masa depan.</li>
          </ul>

          <h2>4. Berbagi Data dengan Pihak Ketiga</h2>
          <p>
            NihongoRoute adalah <strong>platform edukasi non-komersial</strong>. Kami <strong>tidak pernah menjual, menyewakan, atau memperdagangkan</strong> data pribadi Anda kepada pihak ketiga mana pun untuk tujuan periklanan, pemasaran, atau komersial.
          </p>

          <h2>5. Keamanan Data Anda</h2>
          <p>
            Kami menerapkan berbagai standar keamanan modern untuk melindungi informasi Anda. Operasi sinkronisasi data ke basis data (Supabase) kami dilakukan menggunakan enkripsi standar industri serta kontrol akses baris (Row Level Security). Namun, karena tidak ada transmisi data di internet yang 100% kebal, kami mendesain aplikasi ini untuk menyimpan data sensitif secara lokal terlebih dahulu.
          </p>

          <h2>6. Kontak</h2>
          <p>
            Jika Anda memiliki pertanyaan terkait Kebijakan Privasi ini atau ingin melakukan penghapusan data secara penuh, silakan hubungi kami melalui kanal komunikasi yang tersedia atau repositori proyek resmi kami.
          </p>
        </article>

        {/* Footer Navigation */}
        <div className="pt-8 border-t border-border flex justify-start">
          <Link href="/dashboard">
            <Button variant="outline" className="rounded-2xl px-6 h-12 shadow-sm font-bold tracking-widest uppercase text-xs">
              <ArrowLeft size={16} className="mr-2" />
              Kembali ke Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
