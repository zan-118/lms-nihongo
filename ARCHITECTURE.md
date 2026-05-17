# 🌀 Ringkasan Arsitektur NihongoRoute

Dokumen ini menyajikan audit struktural yang komprehensif dari proyek NihongoRoute, merinci tumpukan teknologi, hubungan antar lapisan aplikasi, serta arsitektur alur data. File ini berfungsi sebagai rujukan teknis utama bagi para pengembang.

---

## 1. Tumpukan Teknologi Utama

NihongoRoute dibangun menggunakan arsitektur modern yang berfokus pada sisi antarmuka (*frontend-heavy*) dan mudah diskalakan. Fokus utamanya adalah memberikan pengalaman yang dikendalikan oleh klien dengan kemampuan penggunaan luring (*offline-first*), didukung oleh sinkronisasi awan (*cloud*).

- **Kerangka Kerja (Framework):** Next.js 16 (App Router)
- **Bahasa Pemrograman:** TypeScript (Pengetikan ketat untuk keandalan)
- **Gaya Visual (Styling):** Tailwind CSS & Radix UI (Estetika *Cyber-Glass*: `backdrop-blur`, *glassmorphism*, dan aksen neon)
- **Manajemen Status (State Management):** Zustand (Penyimpanan tersegmentasi dengan persistensi IndexedDB melalui `idb-keyval`)
- **Status Server:** React Query (`@tanstack/react-query`) untuk pencadangan cerdas (*caching*) dan orkestrasi sinkronisasi awan.
- **Sisi Server & Autentikasi:** Supabase (PostgreSQL, RPC, Auth)
- **Manajemen Konten (Split-Source):** 
  - **Sanity CMS**: Sumber kebenaran utama untuk konten editorial (*Lessons*, *Reading*, *Listening*, *Exams*).
  - **Supabase**: Basis data terstruktur untuk entitas leksikal (*Kanji*, *Vocab*, *Grammar*) dan progres dinamis pengguna (*XP*, *SRS*).
- **Animasi:** Framer Motion (Transisi berbasis pegas yang sangat mulus)
- **Sinkronisasi Antar-Tab:** BroadcastChannel API (Memastikan konsistensi data di berbagai tab peramban)

---

## 2. Peta Rute & Tata Letak (`app/`)

Sistem perutean menggunakan App Router dari Next.js 16 dengan pemisahan tegas antara area utama aplikasi dan area yang terisolasi.

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
│       └── srs/            # Logika utama pengulangan berkala
├── auth/                   # Alur masuk, daftar, & panggilan balik
├── onboarding/             # Pengenalan bertahap (Terisolasi dari Tata Letak Utama)
├── (admin)/                # Command Center (Custom CMS)
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

Sistem menggunakan arsitektur terpadu berbasis Supabase untuk semua jenis data, menggabungkan konten statis dengan kemajuan pengguna secara real-time.

### Langkah 1: Pengambilan Konten Paralel (Promise.all & Server Actions)

Data edukasi diambil secara paralel menggunakan arsitektur *Split-Source* melalui Server Actions. 
- **Sanity CMS** melayani pemanggilan konten editorial yang kaya (mis. `lesson.actions.ts`, `reading.actions.ts`).
- **Supabase** melayani pengambilan data kamus leksikal yang kaku (mis. `library.actions.ts`).
Proses pengambilan data ini secara ketat mengimplementasikan pola `Promise.all` untuk menghindari *waterfall latency*, memanfaatkan *fetch caching* bawaan Next.js alih-alih invalidasi waktu kaku.

### Langkah 2: Sinkronisasi Awan ke Lokal (Supabase → Zustand)

1. Saat aplikasi dimuat, `useCloudData` mengambil salinan data dari Supabase (profil, data SRS, status pelajaran).
2. Data digabungkan ke Zustand menggunakan strategi **Offline-First**. Penyelesaian konflik data didasarkan pada `updated_at` terbaru.

### Langkah 3: Interaksi Lokal & Dirty Marking

Setiap interaksi (XP bertambah, kartu SRS dijawab) akan langsung memperbarui status lokal di Zustand dan menandai ID tersebut sebagai "dirty". UI memberikan umpan balik instan (< 16ms) tanpa menunggu respon jaringan.

### Langkah 4: Penyimpanan Latar Belakang (3-Tier Sync)

1. **`useSyncProgress`**: Mengamati perubahan store dan melakukan debouncing paket data "dirty".
2. **`useCloudMutation`**: Mengeksekusi prosedur RPC `sync_user_progress` di Supabase.
3. **Konfirmasi**: Jika sukses, penanda *dirty* dihapus dan pesan `"SYNC_COMPLETE"` disiarkan melalui **BroadcastChannel** agar tab lain melakukan cache invalidation.

---

## 6. Batasan Arsitektur

1. **Akses Bebas 100% (Free Access Strategy):** Pengguna dapat menikmati seluruh konten dan fitur secara gratis tanpa harus membuat akun (*login*). *Middleware Auth* bekerja secara pasif (hanya mengelola penyegaran token jika ada), dan profil lokal diamankan di *IndexedDB* secara penuh. Pembuatan akun sepenuhnya bersifat opsional demi keperluan pencadangan ke *cloud*.
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
- **`WordPopover`**: Muncul saat teks diklik, melakukan pencarian kosakata secara dinamis di Supabase/IDB untuk memberikan definisi, contoh, dan audio TTS.

---

## 10. Protokol Sinkronisasi 3-Tingkat (3-Tier Sync)

Untuk menjamin performa luring (*offline-first*) yang tangguh, NihongoRoute mengikuti protokol sinkronisasi tiga lapis:

1.  **Lapis UI (Zustand)**: Interaksi pengguna langsung memperbarui Zustand store (`useUserStore`, `useSRSStore`) untuk umpan balik instan (< 16ms).
2.  **Lapis Orkestrasi (`useSyncProgress`)**: Hook ini memantau perubahan store, melakukan *debouncing*, dan menyiapkan paket data untuk dikirim ke awan.
3.  **Lapis Persistensi Awan (`useCloudMutation`)**: Menggunakan React Query untuk mengeksekusi mutasi ke Supabase RPC. Jika sukses, ia akan menyiarkan `"SYNC_COMPLETE"` melalui `BroadcastChannel` untuk sinkronisasi antar-tab.

---

## 11. Arsitektur AI-Native & Tata Kelola Konten

NihongoRoute menggunakan alur kerja editorial yang ditenagai AI dengan kontrol deterministik, transparansi operasional yang tinggi, dan pengawasan manusia sebagai prioritas utama.

### 11.1 Batasan Kepemilikan AI (Ownership Boundaries)
Terdapat pemisahan tegas antara data yang dihasilkan AI dan metadata yang dimiliki oleh sistem untuk menjaga integritas relasional:
- **Milik AI (Semantic Content)**: Isi blok konten, ringkasan, soal kuis, metadata SEO, dan contoh kalimat.
- **Milik Sistem (Structural Governance)**: Status editorial (`status`), identitas unik (`id`), stempel waktu (`timestamps`), dan riwayat audit. AI dilarang keras mengubah metadata struktural ini secara otonom.

### 11.2 Siklus Hidup Generasi (Generation Lifecycle)
Setiap konten melewati pipa pemrosesan lima tahap sebelum masuk ke tahap peninjauan:
1. **Generation**: AI menghasilkan draf konten berdasarkan konteks database terbaru.
2. **Validation**: Validasi skema ketat menggunakan Zod untuk memastikan integritas struktural dan tipe data.
3. **Normalization**: Perbaikan otomatis pada format (pembersihan spasi, normalisasi enum, konversi tipe).
4. **Enrichment (Semantic Resolution)**: Resolusi istilah referensi manusia (misal: "N5") menjadi ID database (UUID) secara deterministik melalui lapisan utilitas server.
5. **Governance**: Penempelan otomatis pada status editorial, peringatan (*warnings*), jejak audit, dan sinyal kepercayaan.

### 11.3 Tata Kelola Editorial (Editorial Governance)
Infrastruktur ini menyediakan visibilitas operasional penuh bagi editor manusia:
- **Status Konten**: Mengikuti siklus hidup `draft` → `review` (default AI) → `approved` → `published` (atau `rejected`).
- **Editorial Warnings**: Peringatan terstruktur (High/Medium/Low) yang bersifat penasihat (bukan pemblokir). Menggunakan kunci identitas kanonik (`v1:category:severity:target:path`) untuk mencegah duplikasi.
- **Audit Trail (Operational Narrative)**: Riwayat peristiwa yang tidak dapat diubah (*immutable*) dan mudah dibaca manusia, menangkap "narasi operasional" (Peristiwa, Aktor, Pesan).
- **Confidence Indicators**: Sinyal kepercayaan berbasis aturan deterministik (bukan intuisi AI) yang diturunkan dari fakta operasional seperti jumlah percobaan ulang (*retries*) dan tingkat keparahan peringatan.

### 11.4 Filosofi Metadata Operasional
- **Immutable Snapshots**: Setiap peristiwa generasi menghasilkan rekaman permanen yang tidak dapat diubah. Perbaikan konten menghasilkan snapshot baru alih-alih memutasi riwayat lama (*append-only*).
- **Semantic Transparency**: Memisahkan konten teks dari referensi database keras untuk mencegah kerusakan relasional selama proses regenerasi sebagian.
- **Human-in-the-Loop**: AI hanya berfungsi sebagai pendukung keputusan; kewenangan akhir status `published` tetap berada di tangan editor manusia melalui sistem sinyal yang transparan.

### 11.6 Post-Phase 4 Scaling Constraints (PENTING)
Setelah Phase 4 selesai, pengembangan masa depan WAJIB mematuhi batasan berikut untuk mencegah inflasi kompleksitas:
- **Prioritas Utama**: Throughput editorial (kecepatan publish), ergonomi alur kerja (kenyamanan editor), dan stabilitas operasional.
- **DILARANG**: Otonomi AI yang tidak perlu, sistem tata kelola bergaya enterprise yang birokratis, mesin moderasi probabilistik, dan fragmentasi infrastruktur prematur.
- **Fokus Evolusi**: Mempercepat editor, memperjelas sinyal operasional, dan menjaga performa kueri tetap ringan meskipun metadata (audit/warnings) semakin kaya.

### 11.5 Governance UX & Review Queue (Phase 4)
- **Urgency-First Sorting**: Konten diurutkan berdasarkan `status` (Review diutamakan) dan kemudian `confidence_rank` (Kepercayaan rendah diutamakan) untuk memprioritaskan intervensi manusia.
- **Inline Operational Signals**: Editor menampilkan `Confidence Banners` dan `Warning Inspectors` untuk menjelaskan keandalan AI kepada manusia secara transparan.
- **Lifecycle Governance**: Transisi status manual (misal: Review -> Approved) dicatat dalam `audit_log` yang tidak dapat diubah dengan deskripsi naratif.
- **Cognitive Simplicity**: Metadata tata kelola disajikan sebagai sinyal bantuan, bukan sebagai hambatan birokrasi yang kaku.