# 🌀 NihongoRoute (日本語ルート)

<div align="center">
  <img src="./public/logo-branding.svg" alt="Logo NihongoRoute" width="120" height="120" />
  <h3>Ekosistem Pembelajaran Bahasa Jepang Profesional untuk Indonesia</h3>
  <p align="center">
    Platform pembelajaran generasi baru berbasis offline-first, dirancang untuk menjembatani pedagogi tradisional dengan teknologi interaktif modern.
  </p>

  [![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![Sanity](https://img.shields.io/badge/Sanity-F1662A?style=for-the-badge&logo=sanity&logoColor=white)](https://www.sanity.io/)
  [![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

---

## 📖 Gambaran Proyek

**NihongoRoute** adalah ekosistem pembelajaran bahasa Jepang kelas enterprise yang disesuaikan khusus untuk pembelajar di Indonesia. Platform ini mengintegrasikan data pedagogis masif dengan **Sistem Desain Semantik Cyber-Glass** yang mutakhir. Fokus utama platform ini adalah pada performa tinggi dan interaksi berbasis *offline-first*, sembari memastikan sinkronisasi *cloud* yang mulus untuk pengalaman belajar yang berkesinambungan di berbagai perangkat.

---

## ✨ Fitur Unggulan

### 💎 UI/UX Semantic Cyber-Glass
Antarmuka imersif yang dibangun sepenuhnya di atas **Token Desain Semantik** dan **Variabel RGB**. Tidak ada lagi warna statis (seperti `bg-white`, `border-white/5` atau absolute `rgba`)—sistem kami beradaptasi 100% secara dinamis antara mode Terang dan Gelap. Setiap border, shadow, dan efek neon (glow) memanfaatkan variabel dinamis untuk menyediakan lingkungan yang berorientasi pada fokus belajar dengan estetika premium.

### 🧠 Mesin Pembelajaran Cerdas & SRS
- **Spaced Repetition (SRS) Lanjutan**: Algoritma cerdas berbasis *local-first* yang menjamin retensi ingatan jangka panjang.
- **On-Demand ISR**: Pembaruan konten secara real-time melalui Sanity Webhooks, memastikan Anda selalu mendapatkan kurikulum terbaru tanpa mengorbankan kecepatan.
- **Mode Membaca Pintar**: Rendering teks berdampingan (Jepang-Indonesia) dengan integrasi TTS (Text-to-Speech) dan pencarian kamus instan.

### 🎮 Perjalanan Pedagogis Tergamifikasi
- **Sistem XP & Streak**: Pembelajaran berbasis imbalan untuk menjaga motivasi belajar setiap hari.
- **Penguasaan JLPT N5 - N2**: Pelajaran terstruktur, panduan tata bahasa komprehensif dengan rumus pembentukan kalimat, serta simulasi ujian interaktif.
- **Generator PDF Dinamis**: Ekspor materi belajar, daftar kosakata, dan sertifikat dalam tata letak bermerek yang siap cetak.

### 🛡️ Arsitektur Offline-First
Dibangun dengan **Protokol Sinkronisasi 3-Tier**:
1. **Penyimpanan Lokal (Zustand + IndexedDB)**: Umpan balik instan tanpa latensi.
2. **Orchestrator (useSyncProgress)**: Pendeteksian perubahan dan *debouncing* di latar belakang.
3. **Mutasi Cloud (Supabase RPC)**: Persistensi data yang handal dan integritas multi-tab melalui BroadcastChannel API.

---

## 🛠️ Stack Teknologi

| Layer | Teknologi |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS (Semantik), Framer Motion, Radix UI |
| **Database & Auth** | Supabase (PostgreSQL, Edge Functions, RPC) |
| **Konten CMS** | Sanity CMS (GROQ Queries, Portable Text) |
| **State Management** | Zustand (Persisten via idb-keyval), TanStack Query v5 |
| **Infrastruktur** | Vercel (Analytics & Speed Insights), PWA Service Workers |

---

## 📂 Arsitektur Sistem

NihongoRoute mengikuti standar direktori yang ketat untuk modularitas dan skalabilitas:

- `app/`: Layer perutean (routing) dan komposisi halaman.
- `components/features/`: Logika bisnis spesifik domain (Quiz, SRS, Exams).
- `components/ui/`: Komponen primitif atomik (berbasis semantik).
- `lib/`: Fungsi utilitas murni dan konfigurasi (**Tanpa TSX**).
- `store/`: Manajemen state global terfragmentasi dengan persistensi offline.
- `sanity/`: Skema konten deklaratif dan konfigurasi CMS.

---

## 🚀 Memulai (Getting Started)

### 1. Prasyarat
- Node.js 18.x atau versi lebih tinggi
- NPM atau PNPM

### 2. Instalasi
```bash
# Clone repositori
git clone https://github.com/zan-118/nihongoroute.git

# Instal dependensi
npm install
```

### 3. Konfigurasi Lingkungan (Environment)
Buat file `.env.local` di direktori root dan masukkan kunci API Anda:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SANITY_REVALIDATE_SECRET=...
```

### 4. Pengembangan
```bash
npm run dev
```

---

## 🛡️ Pemeliharaan & Dukungan

**Fauzan Abdul Basith**
- GitHub: [@zan-118](https://github.com/zan-118)
- Website: [www.fauzanabdulbasith.com](https://www.fauzanabdulbasith.com)

---
<div align="center">
  Dibangun dengan semangat untuk mendemokratisasi akses pendidikan Bahasa Jepang berkualitas di Indonesia. 🇯🇵💙
</div>
