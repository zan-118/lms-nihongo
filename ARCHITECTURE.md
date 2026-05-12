```markdown
# 🌀 Ringkasan Arsitektur NihongoRoute

Dokumen ini menyajikan audit struktural yang komprehensif dari proyek NihongoRoute, merinci tumpukan teknologi, hubungan antar lapisan aplikasi, serta arsitektur alur data. File ini berfungsi sebagai rujukan teknis utama bagi para pengembang.

---

## 1. Tumpukan Teknologi Utama

NihongoRoute dibangun menggunakan arsitektur modern yang berfokus pada sisi antarmuka (*frontend-heavy*) dan mudah diskalakan. Fokus utamanya adalah memberikan pengalaman yang dikendalikan oleh klien dengan kemampuan penggunaan luring (*offline-first*), didukung oleh sinkronisasi awan (*cloud*).

- **Kerangka Kerja (Framework):** Next.js 15 (App Router)
- **Bahasa Pemrograman:** TypeScript (Pengetikan ketat untuk keandalan)
- **Gaya Visual (Styling):** Tailwind CSS & Radix UI (Estetika *Cyber-Glass*: `backdrop-blur`, *glassmorphism*, dan aksen neon)
- **Manajemen Status (State Management):** Zustand (Penyimpanan tersegmentasi dengan persistensi IndexedDB melalui `idb-keyval`)
- **Status Server:** React Query (`@tanstack/react-query`) untuk pencadangan cerdas (*caching*) dan orkestrasi sinkronisasi awan.
- **Sisi Server & Autentikasi:** Supabase (PostgreSQL, Fungsi Tepi/RPC, Autentikasi)
- **Manajemen Konten:** Sanity CMS (Sumber kebenaran utama untuk materi pelajaran statis, tata bahasa, dan kosakata)
- **Animasi:** Framer Motion (Transisi berbasis pegas yang sangat mulus)
- **Sinkronisasi Antar-Tab:** BroadcastChannel API (Memastikan konsistensi data di berbagai tab peramban)

---

## 2. Peta Rute & Tata Letak (`app/`)

Sistem perutean menggunakan App Router dari Next.js 15 dengan pemisahan tegas antara area utama aplikasi dan area yang terisolasi.

### Struktur Pohon Rute
```text
app/
├── (main)/                 # Grup Rute: Memerlukan Navigasi Samping & Atas
│   ├── courses/            # Katalog materi & detail pelajaran
│   ├── dashboard/          # Statistik pengguna & ringkasan kemajuan
│   ├── exams/              # Simulasi ujian JLPT
│   ├── library/            # Referensi tata bahasa & kamus
│   ├── review/             # Mesin utama pengulangan berkala (SRS)
│   ├── settings/           # Pengaturan profil & preferensi antarmuka
│   ├── share/              # Halaman publik untuk membagikan kemajuan
│   ├── social/             # Fitur sosial & papan peringkat
│   ├── support/            # Pusat bantuan & pertanyaan umum (FAQ)
│   └── tools/              # Alat bantu belajar tambahan
│       ├── flashcards/     # Mesin kartu pengingat dinamis
│       ├── kana/           # Latihan Hiragana & Katakana
│       └── writing/        # Mesin latihan menulis Kanji
├── auth/                   # Alur masuk, daftar, & panggilan balik
├── onboarding/             # Pengenalan bertahap (Terisolasi dari Tata Letak Utama)
├── studio/                 # Integrasi Sanity Studio (CMS)
├── globals.css             # Gaya dasar (Tailwind + Token Cyber-Glass)
├── layout.tsx              # Penyedia Utama (Autentikasi, Kueri, Tema)
└── page.tsx                # Halaman Utama (Pemasaran)

```

### Tujuan Tata Letak Khusus

* **`app/layout.tsx`**: Membungkus seluruh aplikasi dengan penyedia tema (`ThemeProvider`), kueri (`QueryClientProvider`), dan autentikasi (`AuthProvider`).
* **`app/(main)/layout.tsx`**: Menyediakan kerangka navigasi (Navigasi Samping, Navigasi Atas) yang seragam untuk pengalaman belajar.
* **`app/onboarding/`**: Menggunakan tata letak kosong (layar penuh) untuk meminimalkan gangguan saat pengguna pertama kali mengatur akun.

---

## 3. Anatomi Komponen & Fitur Domain (`components/`)

Folder `components/features/` dikelompokkan berdasarkan area fungsional untuk menghindari ketergantungan yang rumit.

| Folder Fitur | Tanggung Jawab |
| --- | --- |
| `course` | Menangani tampilan halaman materi pelajaran dan navigasi antar bab. |
| `dashboard` | Ekstensi statistik, grafik pengalaman (XP), dan cincin kemajuan untuk ringkasan belajar. |
| `exams` | Logika pengatur waktu ujian, navigasi soal, dan penilaian otomatis JLPT. |
| `gamification` | Komponen visual untuk bilah pengalaman (XP), lencana naik level, dan animasi rekor berturut-turut (*streak*). |
| `grammar` | Menampilkan struktur tata bahasa beserta contoh kalimat dan penjelasan. |
| `kanji` | Visualisasi urutan coretan, radikal, dan mnemonik. |
| `listening` | Pemutar audio yang tersinkronisasi dengan transkrip interaktif. |
| `pdf` | Pembuatan dan pengunduhan dokumen PDF (Sertifikat, *Cheatsheet*, Materi Pelajaran). |
| `reading` | Mode membaca berdampingan (Jepang-Indonesia) dengan integrasi teks-ke-suara (TTS). |
| `review` | Ringkasan sesi setelah menyelesaikan latihan pengulangan berkala (SRS). |
| `srs` | Tombol evaluasi (Sulit/Mudah) dan perhitungan jeda waktu. |

### Komponen Kerangka Global (`components/layout/`)

* **`Sidebar.tsx`**: Navigasi utama (Desktop) dengan integrasi tautan legal di bagian bawah.
* **`Topbar.tsx`**: Pusat kendali pengguna (XP, Level, Rekor) dan menu profil.
* **`MobileNav.tsx`**: Navigasi bawah (Bilah tab) untuk perangkat seluler.

---

## 4. Analisis Manajemen Status (`store/`)

NihongoRoute menggunakan Zustand yang dipadukan dengan persistensi IndexedDB untuk menjamin performa tinggi dan fungsionalitas luring (*offline*).

### Penyimpanan Utama & Logika

1. **`useAuthStore`**: Mengelola status autentikasi dan sesi pengguna.
2. **`useUserStore`**: Mengelola data gamifikasi (XP, Rekor), level, inventaris, serta daftar pelajaran yang diselesaikan dan yang belum tersinkronisasi (*dirty*).
3. **`useSRSStore`**: Mengelola basis data kartu pengulangan berkala (*srs*) dan melacak perubahan lokal yang belum tersinkronisasi (*dirtySrs*).
4. **`useUIStore`**: Mengelola status sementara seperti proses memuat, status sinkronisasi, notifikasi, serta pengaturan visual (Furigana, Target harian).

### Persistensi IndexedDB (`idb-keyval`)

Aplikasi menyimpan status ke peramban secara asinkron menggunakan kunci berikut:

* `nihongoroute_user_data`: Data profil dan riwayat belajar.
* `nihongoroute_srs_data`: Seluruh basis data pengulangan berkala (SRS) lokal.
* `nihongoroute_ui_data`: Pengaturan tema, furigana, dan status antarmuka sesi.

---

## 5. Alur Data & Sinkronisasi Awan

Sistem menggunakan metode campuran untuk menggabungkan konten statis dari Sanity dengan data kemajuan dinamis dari Supabase.

### Langkah 1: Pengambilan Konten (Sanity CMS)

Data edukasi statis diambil menggunakan kueri GROQ (`lib/queries.ts`) untuk jenis dokumen seperti: kosakata, pelajaran, materi membaca, kanji, dan tugas mendengarkan.

### Langkah 2: Sinkronisasi Awan ke Lokal (Supabase → Zustand)

1. Saat aplikasi dimuat, `useCloudData` mengambil salinan data dari Supabase (profil, data SRS, pelajaran).
2. Data digabungkan ke Zustand menggunakan strategi yang memprioritaskan data luring (*Offline-First*). Penyelesaian konflik data didasarkan pada stempel waktu terbaru.

### Langkah 3: Interaksi Lokal & Penandaan Belum Sinkron (*Dirty Marking*)

Setiap interaksi pengguna akan langsung memperbarui status lokal dan menandai ID tersebut sebagai belum tersinkronisasi (*dirty*). Hal ini memastikan antarmuka tetap responsif tanpa harus menunggu koneksi internet (Nir-Jeda).

### Langkah 4: Penyimpanan Latar Belakang (Zustand → Supabase)

1. `useSyncProgress` mengamati perubahan penyimpanan dengan penundaan (*debounce*) 2000 milidetik.
2. `useCloudMutation` memicu prosedur RPC `sync_user_progress` yang secara otomatis memperbarui XP, SRS, dan Pelajaran di awan.
3. Jika berhasil, penanda *dirty* dihapus dan pesan penyelesaian sinkronisasi dikirim melalui **BroadcastChannel** agar tab lain memperbarui datanya.

---

## 6. Batasan Arsitektur

1. **Desain Berprioritas Tamu:** Aplikasi secara otomatis membuat profil "Tamu" agar semua fitur lokal dapat digunakan tanpa harus masuk (*login*).
2. **Pemilihan Terperinci (*Atomic Selectors*):** Komponen WAJIB mengambil bagian data secara spesifik (contoh: `useUserStore(s => s.xp)`) untuk mencegah pemuatan ulang (*re-render*) yang tidak perlu.
3. **Keamanan Multi-Tab:** Ketidakkonsistenan data antar-tab dicegah dengan membatalkan memori sementara kueri (*Query Cache*) yang dipicu oleh BroadcastChannel API.
4. **Ketahanan Luring:** Semua penyimpanan utama dipertahankan di IndexedDB, memungkinkan pengguna belajar di area tanpa sinyal dan tersinkronisasi otomatis saat terhubung kembali.

---

## 9. Jalur Rendering Furigana & Interaksi

NihongoRoute menerapkan sistem rendering teks Jepang yang canggih dengan kontrol global dan interaksi kata yang cerdas.

### 9.1 Kontrol Mode Global (`useUIStore`)
Status pembacaan dikendalikan secara terpusat melalui `readingState`:
- **Kanji**: Hanya menampilkan Kanji asli.
- **Furigana**: Menampilkan Kanji dengan anotasi Ruby di atasnya.
- **Hiragana**: Mengonversi seluruh teks Jepang menjadi Hiragana.

### 9.2 Komponen Rendering Cerdas
- **`SmartJapanese`**: Komponen utama yang mendeteksi teks Jepang dan membungkusnya dengan logika interaksi.
- **`FuriganaDisplay`**: Mengelola tampilan visual (Ruby) berdasarkan mode yang aktif. Menggunakan `0.55em` untuk proporsi yang optimal.
- **`WordPopover`**: Muncul saat teks diklik, melakukan pencarian kosakata secara dinamis di Sanity/IDB untuk memberikan definisi, contoh, dan audio TTS.

---

## 10. Protokol Sinkronisasi 3-Tingkat (3-Tier Sync)

Untuk menjamin performa luring (*offline-first*) yang tangguh, NihongoRoute mengikuti protokol sinkronisasi tiga lapis:

1.  **Lapis UI (Zustand)**: Interaksi pengguna langsung memperbarui Zustand store (`useUserStore`, `useSRSStore`) untuk umpan balik instan (< 16ms).
2.  **Lapis Orkestrasi (`useSyncProgress`)**: Hook ini memantau perubahan store, melakukan *debouncing*, dan menyiapkan paket data untuk dikirim ke awan.
3.  **Lapis Persistensi Awan (`useCloudMutation`)**: Menggunakan React Query untuk mengeksekusi mutasi ke Supabase RPC. Jika sukses, ia akan menyiarkan `"SYNC_COMPLETE"` melalui `BroadcastChannel` untuk sinkronisasi antar-tab.

---

## 7. Standar Teknis (Aturan Pengembangan)

### 🎨 Desain Sistem & Gaya Ketat

* **DILARANG**: Penggunaan warna statis bawaan Tailwind secara mutlak (contoh: `bg-white`, `text-gray-900`), nilai transparansi tetap (`border-white/5`), dan nilai `rgba` absolut.
* **DIWAJIBKAN**: 100% menggunakan **Variabel CSS Semantik**: `bg-background`, `text-foreground`, `primary`, `secondary`, `success` (hijau), `warning` (kuning/oranye), `destructive` (merah), `muted`, dan `card`.
* **Transparansi & Pendaran**: Untuk efek bayangan atau pendaran, WAJIB menggunakan variabel RGB CSS (contoh: `rgba(var(--primary-rgb), 0.4)`).
* **Estetika Cyber-Glass**: Gunakan kelas `.glass` untuk elemen melayang/kartu. Pembatas visual harus selalu menggunakan `border-border`, BUKAN `border-white/5`.

### 📂 Aturan Direktori

* **lib/**: **DILARANG KERAS** menyimpan file `.jsx` atau `.tsx`. Direktori ini murni untuk fungsi pembantu, kueri data, dan konfigurasi TypeScript.
* **Komponen Antarmuka**: Harus ditempatkan di `components/ui/` (primitif) atau `components/features/` (spesifik domain).
* **Halaman**: Penyusunan tingkat halaman hanya diizinkan di dalam direktori `app/`.

### 📡 Pengambilan Data (ISR Sesuai Permintaan)

* **DILARANG**: Penggunaan pembaruan berbasis waktu (contoh: `export const revalidate = 3600;`).
* **DIWAJIBKAN**: Menggunakan fungsi `sanityFetch` dari `@/lib/sanity.fetch` dengan mengirimkan `tags` yang relevan agar sinkron dengan Webhook Sanity.

### ♿ Aksesibilitas & Tipografi

* **Furigana ()**: Wajib menggunakan ukuran relatif (`0.55em`) agar seimbang di berbagai peramban melalui komponen `SmartJapanese`.
* **Label Aksesibilitas**: Semua tombol yang hanya berupa ikon WAJIB memiliki `aria-label`. Ikon dekorasi wajib memiliki atribut `aria-hidden="true"`.

---

## 8. Infrastruktur Pengujian & Alat Pengembangan

Repositori ini menerapkan standar pengujian yang menyeluruh untuk memastikan stabilitas fitur.

* **Pengujian Unit & Integrasi (Vitest):** Digunakan secara luas pada direktori `__tests__/` untuk menguji logika fungsional (*hooks*) seperti `useAddToSRS` dan `useDailyQuests`, serta fungsi utilitas lainnya.
* **Pengujian Ujung-ke-Ujung / E2E (Playwright):** Terletak di folder `e2e/`, digunakan untuk mensimulasikan perjalanan pengguna secara utuh (seperti alur dasbor, perjalanan belajar, dan ujian).
* **Pengecekan Kualitas Kode (Linting & Pre-commit):** Proyek ini menggunakan **Husky** untuk mengamankan proses sebelum melakukan *commit* dan memiliki konfigurasi **ESLint** yang ketat (`.eslintrc.json`) untuk menjaga kebersihan dan standar kode.

```

```