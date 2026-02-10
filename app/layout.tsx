import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NihongoPath | Belajar Bahasa Jepang Gratis",
  description: "Platform belajar mandiri dengan kurikulum terstruktur.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body
        className={`${inter.className} antialiased bg-[#1f242d] text-[#c4cfde]`}
      >
        <Navbar />
        {/* Main tanpa padding-top global agar Hero Landing Page bisa presisi */}
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
