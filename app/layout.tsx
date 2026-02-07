import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

// Konfigurasi Metadata untuk SEO dan PWA
export const metadata: Metadata = {
  title: "NihongoPath | Belajar Bahasa Jepang Gratis",
  description:
    "Platform belajar bahasa Jepang mandiri dengan kurikulum terstruktur dan simulasi kuis JLPT.",
  manifest: "/manifest.json",
  icons: {
    apple: "/icons/icon-192x192.png",
  },
};

// Konfigurasi Viewport (Penting agar UI tidak zoom otomatis di mobile)
export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// Definisi Interface untuk Props
interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id">
      <head>
        {/* Kamu bisa menambahkan script atau link font tambahan di sini jika perlu */}
      </head>
      <body className={`${inter.className} antialiased bg-white`}>
        {/* Pembungkus Utama */}
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
