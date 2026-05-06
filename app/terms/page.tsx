import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service | NihongoRoute",
  description: "Syarat dan Ketentuan penggunaan platform NihongoRoute.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground py-16 px-6 md:px-12 flex justify-center">
      <div className="max-w-3xl w-full">
        {/* Header Jepang */}
        <header className="mb-16 border-b border-border pb-8">
          <h1 className="text-4xl md:text-5xl font-black text-foreground font-japanese tracking-tight mb-3">
            利用規約
          </h1>
          <p className="text-sm md:text-base font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">
            Terms of Service (Syarat & Ketentuan)
          </p>
        </header>

        {/* Konten Tipografi Minimalis */}
        <article className="prose prose-slate dark:prose-invert prose-headings:font-black prose-headings:tracking-tight prose-a:text-indigo-500 max-w-none mb-20">
          <p className="lead font-medium text-muted-foreground">
            Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
          </p>

          <h2>1. Penerimaan Syarat</h2>
          <p>
            Dengan mengakses dan menggunakan platform <strong>NihongoRoute</strong>, Anda menyetujui untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan sebagian atau seluruh syarat ini, Anda dilarang untuk menggunakan platform kami.
          </p>

          <h2>2. Platform Edukasi Non-Komersial</h2>
          <p>
            NihongoRoute dibangun secara independen sebagai sarana edukasi bahasa Jepang berbasis non-komersial. Seluruh materi, aset, teks penjelasan grammar, dan sistem yang ada di dalam aplikasi disediakan secara gratis untuk membantu pelajar Indonesia dalam menguasai JLPT.
          </p>

          <h2>3. Penggunaan yang Diizinkan</h2>
          <p>Anda diberikan lisensi terbatas, non-eksklusif, dan tidak dapat dialihkan untuk menggunakan platform ini murni untuk kepentingan belajar mandiri Anda. Anda setuju untuk <strong>tidak melakukan hal-hal berikut</strong>:</p>
          <ul>
            <li>Menyalin, mengekstrak, memodifikasi, atau mendistribusikan ulang konten edukasi dari Sanity CMS atau sistem database kami untuk dijual atau dijadikan produk komersial.</li>
            <li>Menggunakan program otomatis (seperti bot atau <em>scraper</em>) yang berpotensi membebani peladen (server) kami secara tidak wajar atau merusak pengalaman pengguna lain.</li>
            <li>Mencoba mengeksploitasi kerentanan keamanan platform dengan sengaja.</li>
          </ul>

          <h2>4. Ketersediaan Layanan (&quot;As-Is&quot; Basis)</h2>
          <p>
            Aplikasi dan fitur-fiturnya (termasuk algoritma SRS, Kuis, TTS, dsb.) disediakan secara &quot;Seadanya&quot; (<em>As-Is</em>) tanpa jaminan ketersediaan mutlak. Layanan kami mungkin mengalami <em>downtime</em>, pembaruan, atau perbaikan *bug*. Namun, arsitektur <em>Offline-First</em> kami memastikan bahwa Anda tetap bisa belajar dan menyimpan progres secara lokal ketika terjadi gangguan jaringan.
          </p>

          <h2>5. Penghentian Layanan</h2>
          <p>
            Kami memegang hak prerogatif untuk mengubah, menangguhkan, atau menghentikan operasional platform sebagian atau seluruhnya kapan saja. Meskipun demikian, kami akan berupaya keras mengomunikasikan pembaruan atau pemadaman besar kepada seluruh pengguna aktif.
          </p>

          <h2>6. Perubahan Syarat & Ketentuan</h2>
          <p>
            Syarat dan Ketentuan ini dapat diperbarui atau direvisi dari waktu ke waktu menyesuaikan dengan arah pengembangan proyek. Tanggal pembaruan terbaru akan selalu dicantumkan. Lanjutan penggunaan platform oleh Anda menandakan penerimaan penuh atas revisi tersebut.
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
