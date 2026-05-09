# 🌀 NihongoRoute (日本語ルート)

<div align="center">
  <img src="./public/logo-branding.svg" alt="NihongoRoute Logo" width="120" height="120" />
  <h3>Professional Japanese Learning Ecosystem for Indonesia</h3>
  <p align="center">
    Next-generation, offline-first platform designed to bridge the gap between traditional pedagogy and modern interactive technology.
  </p>

  [![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![Sanity](https://img.shields.io/badge/Sanity-F1662A?style=for-the-badge&logo=sanity&logoColor=white)](https://www.sanity.io/)
  [![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

---

## 📖 Project Overview

**NihongoRoute** is an enterprise-grade Japanese language learning ecosystem tailored specifically for Indonesian learners. It integrates massive pedagogical data with a cutting-edge **Cyber-Glass Semantic Design System**. The platform focuses on high-performance, offline-first interactions while ensuring seamless cloud synchronization for continuous learning across devices.

---

## ✨ Key Features

### 💎 Semantic Cyber-Glass UI/UX
An immersive interface built entirely on **Semantic Design Tokens**. No more static colors—our system adapts dynamically between Light and Dark modes with a premium "Glassmorphism" aesthetic, providing a focus-oriented environment.

### 🧠 Intelligent SRS & Learning Engines
- **Advanced Spaced Repetition (SRS)**: Local-first algorithm that guarantees long-term retention.
- **On-Demand ISR**: Real-time content updates via Sanity Webhooks, ensuring you always have the latest curriculum without sacrificing speed.
- **Smart Reading Mode**: Side-by-side (JP-ID) text rendering with integrated TTS (Text-to-Speech) and dictionary lookup.

### 🎮 Gamified Pedagogical Journey
- **XP & Streak System**: Reward-based learning to maintain motivation.
- **JLPT N5 - N2 Mastery**: Structured lessons, comprehensive grammar guides with formation formulas, and interactive mock exams.
- **Dynamic PDF Generator**: Export study materials, vocab lists, and certificates in branded, print-ready layouts.

### 🛡️ Offline-First Architecture
Built with a **3-Tier Sync Protocol**:
1. **Local Store (Zustand + IndexedDB)**: Zero-latency feedback.
2. **Orchestrator (useSyncProgress)**: Background debouncing and change detection.
3. **Cloud Mutation (Supabase RPC)**: Reliable persistence and multi-tab integrity via BroadcastChannel API.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS (Semantic), Framer Motion, Radix UI |
| **Database & Auth** | Supabase (PostgreSQL, Edge Functions, RPC) |
| **Content CMS** | Sanity CMS (GROQ Queries, Portable Text) |
| **State Management** | Zustand (Persistent via idb-keyval), TanStack Query v5 |
| **Infrastructure** | Vercel (Analytics & Speed Insights), PWA Service Workers |

---

## 📂 System Architecture

NihongoRoute follows a strict directory standard for modularity and scalability:

- `app/`: Routing layer and page compositions.
- `components/features/`: Domain-specific business logic (Quiz, SRS, Exams).
- `components/ui/`: Atomic primitive components (Semantic-first).
- `lib/`: Pure utility functions and configurations (**No TSX**).
- `store/`: Segmented global state management with offline persistence.
- `sanity/`: Declarative content schemas and CMS configurations.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.x or higher
- NPM or PNPM

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/zan-118/nihongoroute.git

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory and provide your keys:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SANITY_REVALIDATE_SECRET=...
```

### 4. Development
```bash
npm run dev
```

---

## 🛡️ Maintainers & Support

**Fauzan Abdul Basith**
- GitHub: [@zan-118](https://github.com/zan-118)
- Website: [www.fauzanabdulbasith.com](https://www.fauzanabdulbasith.com)

---
<div align="center">
  Built with passion to democratize high-quality Japanese education in Indonesia. 🇯🇵💙
</div>
