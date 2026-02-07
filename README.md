---
### File: `README.md`

```markdown
# 🇯🇵 NihongoPath - Free Japanese Learning Platform

**NihongoPath** adalah platform pembelajaran bahasa Jepang mandiri yang gratis dan berbasis donasi. Dirancang untuk membantu pembelajar tingkat N5 hingga N1 menguasai tata bahasa, kosakata, dan simulasi ujian dengan pengalaman aplikasi modern (PWA).

![Next.js](https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)

---

## ✨ Fitur Unggulan

- 📚 **Modul Materi Terstruktur**: Belajar per bab dengan penjelasan yang mendalam dan mudah dipahami.
- 📝 **Mini Quiz Interaktif**: Uji pemahamanmu langsung setelah membaca materi di setiap bab.
- ⏱️ **Simulasi Tryout JLPT**: Ujian dengan batasan waktu sungguhan. Dilengkapi fitur _Persistence Timer_ (waktu tidak reset meski browser di-refresh).
- 📱 **Mobile First & PWA**: Bisa diinstal di Android/iOS dan diakses dengan cepat seperti aplikasi asli.
- ❤️ **Donation-Based**: Platform ini sepenuhnya gratis, didukung oleh komunitas melalui sistem donasi.

---

## 🚀 Teknologi yang Digunakan

- **Frontend**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Deployment**: [Vercel](https://vercel.com/)
- **State Management**: React Hooks (useState, useEffect, use)

---

## 🛠️ Cara Menjalankan Secara Lokal

1. **Clone Repository**
   ```bash
   git clone [https://github.com/username-kamu/nihongopath.git](https://github.com/username-kamu/nihongopath.git)
   cd nihongopath
   ```

````

2. **Install Dependensi**
```bash
npm install

````

3. **Konfigurasi Environment Variables**
   Buat file `.env.local` di root folder dan masukkan key Supabase kamu:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

```

4. **Jalankan Aplikasi**

```bash
npm run dev

```

Buka [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) di browser kamu.

---

## 📂 Struktur Folder Utama

- `/app`: Logika halaman (Dashboard, Materi, Tryout, Support).
- `/components`: Komponen UI yang dapat digunakan kembali.
- `/lib`: Konfigurasi client Supabase.
- `/public`: Aset gambar dan manifest PWA.

---

## 🤝 Kontribusi & Dukungan

Proyek ini dibangun untuk kemajuan pendidikan bahasa Jepang yang aksesibel bagi semua orang. Jika Anda ingin mendukung operasional kami (Server & Pengembangan), Anda dapat berdonasi melalui:

- [Trakteer](https://www.google.com/search?q=https://trakteer.id/Zan118)
- [Saweria](https://www.google.com/search?q=https://saweria.co/Zan118)

---

## 📄 Lisensi

Proyek ini bersifat open-source. Silakan gunakan untuk belajar dan pengembangan lebih lanjut.

---

_Dibuat dengan ❤️ untuk pembelajar Bahasa Jepang._

```

---

```
