import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react"; // Tambahkan ini untuk tipe data

const inter = Inter({ subsets: ["latin"] });

// Definisikan metadata dengan tipe Metadata agar lebih aman
export const metadata: Metadata = {
  title: "NihongoPath | Belajar Bahasa Jepang Gratis",
  description: "Platform belajar mandiri dengan kurikulum terstruktur.",
};

// Definisikan interface untuk props agar TypeScript tidak komplain
interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id">
      <body
        className={`${inter.className} antialiased bg-[#1f242d] text-[#c4cfde] selection:bg-[#0ef] selection:text-[#1f242d]`}
      >
        <Navbar />
        {/* Main tanpa padding-top global agar Hero Landing Page bisa presisi */}
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
