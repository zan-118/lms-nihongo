# 🌀 NihongoRoute Architecture Overview

This document provides a comprehensive structural audit of the NihongoRoute project, detailing the technology stack, the relationships between different application layers, and the data flow architecture. It serves as the primary technical reference for developers.

---

## 1. Primary Tech Stack

NihongoRoute is built using a modern, scalable Frontend-heavy architecture, with a focus on an offline-first, client-driven experience backed by cloud synchronization.

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (Strict typing for robustness)
- **Styling:** Tailwind CSS & Radix UI (Cyber-Glass Aesthetic: `backdrop-blur`, `glassmorphism`, and neon accents)
- **State Management:** Zustand (Segmented stores with IndexedDB persistence via `idb-keyval`)
- **Server State:** React Query (@tanstack/react-query) for intelligent caching and cloud sync orchestration.
- **Backend & Auth:** Supabase (PostgreSQL, Edge Functions/RPCs, Authentication)
- **Content Management:** Sanity CMS (Source of truth for static lessons, grammar, and vocabulary)
- **Animations:** Framer Motion (Spring-based, "buttery smooth" transitions)
- **Cross-Tab Sync:** BroadcastChannel API (Ensures state consistency across multiple browser tabs)

---

## 2. Peta Routing & Layout (`app/`)

Sistem routing menggunakan Next.js 15 App Router dengan pemisahan antara area aplikasi utama dan area terisolasi.

### Tree Struktur Rute
```text
app/
├── (main)/                 # Route Group: Memerlukan Sidebar & Topbar
│   ├── courses/            # Katalog materi & detail lesson
│   ├── dashboard/          # Statistik user & progress overview
│   ├── exams/              # Simulasi ujian JLPT
│   ├── library/            # Referensi grammar & kamus mandiskri
│   ├── review/             # Engine utama SRS (Spaced Repetition)
│   ├── settings/           # Pengaturan profil & preferensi UI
│   ├── share/              # Halaman publik untuk sharing progress
│   ├── social/             # Fitur pertemanan & leaderboard
│   ├── support/            # Help center & FAQ
│   └── tools/              # Alat bantu belajar tambahan
│       ├── flashcards/     # Flashcard engine dinamis
│       ├── kana/           # Latihan Hiragana & Katakana
│       └── writing/        # Engine latihan menulis Kanji
├── auth/                   # Flow login, signup, & callback
├── onboarding/             # Intro multi-step (Terisolasi dari Main Layout)
├── studio/                 # Integrasi Sanity Studio (CMS)
├── globals.css             # Root styles (Tailwind + Cyber-Glass tokens)
├── layout.tsx              # Root Provider (Auth, Query, Theme)
└── page.tsx                # Landing Page (Marketing)
```

### Tujuan Layout Khusus
- **`app/layout.tsx`**: Membungkus seluruh aplikasi dengan `ThemeProvider`, `QueryClientProvider`, dan `AuthProvider`.
- **`app/(main)/layout.tsx`**: Menyediakan shell navigasi (`Sidebar`, `Topbar`) yang konsisten untuk pengalaman belajar.
- **`app/onboarding/`**: Menggunakan layout kosong (full-screen) untuk meminimalkan distraksi saat user pertama kali setup.

---

## 3. Anatomi Komponen & Fitur Domain (`components/`)

Folder `components/features/` diatur berdasarkan domain fungsional untuk menghindari ketergantungan yang berantakan.

| Folder Fitur | Tanggung Jawab (Responsibility) |
| :--- | :--- |
| `course` | Menangani render halaman materi pelajaran dan navigasi antar bab. |
| `dashboard` | Widget statistik, XP chart, dan progress ring untuk ringkasan belajar. |
| `exams` | Logika timer ujian, navigasi soal, dan grading otomatis untuk JLPT. |
| `gamification` | Komponen visual untuk XP bar, badge level-up, dan animasi streak. |
| `grammar` | Display struktur tata bahasa dengan contoh kalimat dan penjelasan. |
| `kanji` | Visualisasi urutan coretan (Stroke Order), radikal, dan mnemonik. |
| `listening` | Player audio yang sinkron dengan transkrip interaktif. |
| `reading` | Mode membaca side-by-side (Jepang-Indo) dengan integrasi TTS. |
| `review` | Summary session setelah selesai melakukan sesi SRS. |
| `srs` | Tombol evaluasi (Hard/Easy) dan kalkulasi interval waktu. |

### Global Shell Components (`components/layout/`)
- **`Sidebar.tsx`**: Navigasi utama (Desktop) dengan integrasi link legal di bagian bawah.
- **`Topbar.tsx`**: Pusat kontrol user (XP, Level, Streak) dan profil menu.
- **`MobileNav.tsx`**: Navigasi bawah (Tab bar) untuk perangkat seluler.

---

## 4. Bedah State Management (`store/`)

NihongoRoute menggunakan Zustand dengan persistensi IndexedDB untuk memastikan performa tinggi dan dukungan offline.

### Store Utama & Logic
1. **`useAuthStore`**: Mengelola status `isAuthenticated` dan session user.
2. **`useUserStore`**: Mengelola data gamification (XP, Streak), level, `inventory`, serta daftar `completedLessons` dan `dirtyLessons` (penanda belum sinkron).
3. **`useSRSStore`**: Mengelola database kartu SRS (`srs`) dan set `dirtySrs` untuk pelacakan perubahan lokal.
4. **`useUIStore`**: Mengelola state ephemeral seperti `loading`, `isSyncing`, `notifications`, serta setting (Furigana, Goal).

### Persistensi IndexedDB (`idb-keyval`)
Aplikasi menyimpan state ke browser secara asinkron menggunakan key berikut:
- `nihongoroute_user_data`: Data profil dan histori belajar.
- `nihongoroute_srs_data`: Seluruh database SRS lokal.
- `nihongoroute_ui_data`: Pengaturan tema, furigana, dan state UI sesi.

---

## 5. Aliran Data & Sinkronisasi Cloud

Sistem menggunakan pendekatan hibrida untuk menggabungkan konten statis (Sanity) dengan progres dinamis (Supabase).

### Step 1: Content Retrieval (Sanity CMS)
Data edukasi statis diambil menggunakan GROQ queries (`lib/queries.ts`) untuk tipe dokumen: `vocab`, `lesson`, `readingMaterial`, `kanji`, dan `listeningTask`.

### Step 2: Cloud-to-Local Sync (Supabase → Zustand)
1. On mount, `useCloudData` mengambil snapshot dari Supabase (`profiles`, `user_srs`, `user_lessons`).
2. Data digabung ke Zustand menggunakan strategi **Offline-First**. Conflict resolution berbasis timestamp terbaru dilakukan di level kartu/lesson.

### Step 3: Local Interaction & Dirty Marking
Setiap interaksi user langsung memperbarui state lokal dan menandai ID sebagai `dirty`. Ini menjamin UI responsif (Zero Latency) tanpa menunggu koneksi internet.

### Step 4: Background Commit (Zustand → Supabase)
1. `useSyncProgress` mengamati perubahan store dengan debounce 2000ms.
2. `useCloudMutation` memicu RPC `sync_user_progress` yang secara atomik mengupdate XP, SRS, dan Lesson di cloud.
3. Setelah sukses, marker `dirty` dihapus dan pesan `"SYNC_COMPLETE"` dikirim via **BroadcastChannel** untuk memberi tahu tab lain agar melakukan refetch data.

---

## 6. Architectural Guardrails

1. **Guest-First Design:** Aplikasi menginisialisasi profile "Guest" secara default agar seluruh fitur lokal tetap berfungsi tanpa login.
2. **Atomic Selectors:** Komponen WAJIB berlangganan ke irisan state yang granular (misal: `useUserStore(s => s.xp)`) untuk mencegah re-render massal.
3. **Multi-Tab Safety:** Inkonsistensi data antar tab dicegah melalui invalidasi Query Cache yang dipicu oleh BroadcastChannel API.
4. **Offline Resilience:** Semua store utama dipersistensi ke IndexedDB, memungkinkan user belajar di lingkungan tanpa sinyal dan melakukan sinkronisasi otomatis saat kembali online.

---

## 7. Technical Standards (Development Rules)

### 🎨 Strict Styling & Design System
- **BANNED**: Dilarang keras menggunakan utility warna statis Tailwind (misal: `bg-white`, `text-gray-900`, `bg-red-500`, `text-blue-400`, `dark:bg-slate-800`).
- **ALLOWED**: Wajib 100% menggunakan **Semantic CSS Variables**: `bg-background`, `text-foreground`, `primary`, `secondary`, `success` (hijau), `warning` (kuning/oranye), `destructive` (merah), `muted`, dan `card`.
- **Cyber-Glass Aesthetic**: Gunakan utility `.glass` untuk elemen overlay/card. Pastikan `border-border` selalu digunakan untuk membatasi elemen visual.

### 📂 Directory Rules (Strict Placement)
- **lib/**: **HARAM** berisi file `.jsx` atau `.tsx`. Folder ini murni untuk utilitas TypeScript, fetcher, dan konfigurasi.
- **UI Components**: Harus masuk ke `components/ui/` (global/primitif) atau `components/features/` (domain-specific).
- **Pages**: Page-level composition hanya boleh ada di direktori `app/`.

### 📡 Data Fetching (On-Demand ISR)
- **BANNED**: Dilarang menggunakan time-based revalidation (misal: `export const revalidate = 3600;`).
- **ALLOWED**: Wajib menggunakan `sanityFetch` dari `@/lib/sanity.fetch` dan mengirimkan `tags` yang relevan (contoh: `tags: ['lesson', 'vocab']`) agar sinkron dengan Sanity Webhook.

### ♿ Accessibility & Typography
- **Furigana (<rt>)**: Wajib menggunakan skala relatif (`0.55em`) agar proporsional di semua browser. Gunakan komponen `SmartJapanese`.
- **Aria Labels**: Semua tombol icon-only WAJIB memiliki `aria-label` yang deskriptif. Ikon dekoratif wajib memiliki `aria-hidden="true"`.

