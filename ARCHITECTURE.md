# 🌀 NihongoRoute Architecture Overview

This document provides a comprehensive structural audit of the NihongoRoute project, detailing the technology stack, the relationships between different application layers, and the data flow architecture.

## 1. Primary Tech Stack

NihongoRoute is built using a modern, scalable Frontend-heavy architecture, with a focus on an offline-first, client-driven experience backed by cloud synchronization.

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (Strict typing for robustness)
- **Styling:** Tailwind CSS & Radix UI (Cyber-Glass Aesthetic: `backdrop-blur`, `glassmorphism`, and neon accents)
- **State Management:** Zustand (Segmented stores with IndexedDB persistence via `idb-keyval`)
- **Backend & Auth:** Supabase (PostgreSQL, Edge Functions/RPCs, Authentication)
- **Content Management:** Sanity CMS (Headless CMS for grammar, vocabulary, and lessons)
- **Animations:** Framer Motion (Spring-based, "buttery smooth" transitions)
- **Testing:** Vitest (Unit) and Playwright (E2E)

## 2. Layer Relationships (`app/`, `hooks/`, and `store/`)

The application architecture strictly separates routing, business logic, and global state to maintain modularity and scalability.

### `app/` (Routing & Layouts)
The Next.js App Router dictates the navigation and page-level layouts. Pages inside `app/` are generally kept thin. Their primary role is to compose feature components from `components/features/` and provide the necessary layout boundaries (e.g., `layout.tsx`, `loading.tsx`, `error.tsx`). 

**Routing Strategy (Centralized Hubs):** To uphold the DRY principle, redundant dynamic routes are strictly avoided. Instead, modular feature hubs (like `/tools/flashcards`) serve as centralized engines that dynamically adapt content based on URL query parameters (`?mode=quick`), streamlining maintenance and unifying the user experience.

**Immersive Layouts:** Dedicated experiences (such as `/onboarding`) live outside the `(main)` route group to intentionally bypass standard navigation shells, creating focused, distraction-free environments.

### `components/` (Component Library)
- **`features/`**: Grouped by domain logic (e.g., `srs/`, `exams/`, `gamification/`). These contain complex UI logic and state interactions.
- **`layout/`**: Global shells like `Sidebar.tsx` and `Topbar.tsx`.
- **`ui/`**: Atomic primitive components (shadcn-based).
- **`providers/`**: Context-level logic (Theme, Auth, QueryClient).

### `hooks/` (Business Logic & Side Effects)
Custom hooks (like `useSyncProgress`) act as the glue between the UI layer and the global state/backend. They encapsulate complex logic such as debounced cloud synchronization, data fetching orchestration, and component lifecycle management.

### `store/` (Global State)
State management is handled by Zustand and split into modular domains:
- `useAuthStore`: Manages user authentication status and sessions.
- `useUserStore`: Manages gamification state (XP, Level, Streak, Inventory).
- `useSRSStore`: Manages the spaced repetition algorithm's local state (intervals, ease factors) with IndexedDB persistence.
- `useUIStore`: Manages ephemeral UI states like loading screens and notifications.

**Architectural Strictness:**
1. **Guest-First Design:** By default, the application treats all users as active "Guests". Default states are explicitly seeded so that local offline play works flawlessly without a database connection.
2. **Atomic Selectors:** Components **must** subscribe to granular state slices (e.g., `useUserStore(state => state.xp)`) to prevent unnecessary re-renders and hydration mismatches.
3. **Navigation Integrity:** All auxiliary routes (Privacy, Terms) are anchored in the `Sidebar` mini-footer, and contextual entry points (like "Re-run Onboarding" in Support) ensure no user feels "trapped" or "lost".

## 3. Data Flow: Supabase & Sanity into the SRS System

The Spaced Repetition System (SRS) requires a hybrid data approach, merging static educational content with dynamic, user-specific progress data.

### Step 1: Content Retrieval (Sanity)
Sanity acts as the source of truth for educational content. Using GROQ queries in `lib/queries.ts`, the application fetches the static properties of vocabulary items. This data is typically fetched on-demand or pre-rendered via ISR.

### Step 2: Progress Retrieval (Supabase -> Zustand)
Supabase holds the user's progress. When the app initializes:
1. `useSyncProgress.ts` fires a query to fetch `profiles` and `user_srs`.
2. The fetched data is merged into the local IndexedDB-backed Zustand store via `mergeProgress`, resolving conflicts using an offline-first strategy.

### Step 3: SRS Review Execution
1. The UI components read the unified state from `useSRSStore` to determine which cards are due.
2. The UI uses card IDs to render the content fetched from Sanity.
3. User interactions trigger updates in `useSRSStore`, marking cards as `dirtySrs`.

### Step 4: Background Synchronization (Zustand -> Supabase)
1. `useSyncProgress.ts` observes the `dirtySrs` state.
2. It triggers a debounced background mutation to a Supabase RPC (`sync_user_progress`).
3. This ensures data integrity and high performance without blocking user interaction.
