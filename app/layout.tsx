import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Konfigurasi Font
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata untuk PWA dan SEO
export const metadata = {
  title: "NihongoPath",
  description: "Belajar Bahasa Jepang Gratis",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NihongoPath",
  },
};

// Viewport dipisah (Standar Next.js terbaru)
export const viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* Icon khusus iOS agar muncul saat 'Add to Home Screen' */}
        <link
          rel="apple-touch-icon"
          href="https://img.icons8.com/color/192/000000/torii-gate.png"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
