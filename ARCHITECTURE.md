# NihongoRoute Architecture Overview

This document provides a comprehensive structural audit of the NihongoRoute project, detailing the technology stack, the relationships between different application layers, and the data flow architecture.

## 1. Primary Tech Stack

NihongoRoute is built using a modern, scalable Frontend-heavy architecture, with a focus on an offline-first, client-driven experience backed by cloud synchronization.

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (Strict typing for robustness)
- **Styling:** Tailwind CSS & Radix UI (for accessible primitive components)
- **State Management:** Zustand (Segmented stores with IndexedDB persistence)
- **Backend & Auth:** Supabase (PostgreSQL, Edge Functions/RPCs, Authentication)
- **Content Management:** Sanity CMS (Headless CMS for grammar, vocabulary, and lessons)
- **Animations:** Framer Motion
- **Testing:** Jest (Unit) and Playwright (E2E)

## 2. Layer Relationships (`app/`, `hooks/`, and `store/`)

The application architecture strictly separates routing, business logic, and global state to maintain modularity.

### `app/` (Routing & Layouts)
The Next.js App Router dictates the navigation and page-level layouts. Pages inside `app/` are generally kept thin. Their primary role is to compose feature components from `components/features/` and provide the necessary layout boundaries (e.g., `layout.tsx`, `loading.tsx`, `error.tsx`).

### `components/features/` (UI Components)
The UI components are grouped by domain logic rather than being flat. For instance, `features/srs/`, `features/exams/`, and `features/gamification/` contain specific logic, isolating complex UI rendering from page layouts.

### `hooks/` (Business Logic & Side Effects)
Custom hooks (like `useSyncProgress`) act as the glue between the UI layer and the global state/backend. They encapsulate complex logic such as debounced cloud synchronization, data fetching orchestration, and component lifecycle management (e.g., `useHasMounted`), preventing components from becoming bloated with `useEffect` blocks.

### `store/` (Global State)
State management is handled by Zustand and split into modular domains:
- `useAuthStore`: Manages user authentication status.
- `useUserStore`: Manages gamification state (XP, Level, Streak, Inventory).
- `useSRSStore`: Manages the spaced repetition algorithm's local state (intervals, ease factors).
- `useUIStore`: Manages ephemeral UI states like loading screens and notifications.

**Relationship Flow:** `app/` renders `components/` -> `components/` consume `hooks/` and `store/` -> `hooks/` mutate `store/` and communicate with APIs.

## 3. Data Flow: Supabase & Sanity into the SRS System

The Spaced Repetition System (SRS) requires a hybrid data approach, merging static educational content with dynamic, user-specific progress data.

### Step 1: Content Retrieval (Sanity)
Sanity acts as the source of truth for educational content. Using GROQ queries in `lib/queries.ts` (e.g., `vocabByIdsQuery`), the application fetches the static properties of vocabulary items (kanji, furigana, romaji, meanings, audio URLs). This data is typically fetched on-demand or pre-rendered.

### Step 2: Progress Retrieval (Supabase -> Zustand)
Supabase holds the user's progress. When the app initializes:
1. `useSyncProgress.ts` (a hook) fires a React Query to fetch the user's `profiles` (gamification) and `user_srs` (repetition, interval, ease factor, next review date).
2. The fetched data is merged into the local IndexedDB-backed Zustand store (`useSRSStore.ts`) via the `mergeProgress` action, resolving any conflicts between local and cloud data (Offline-first approach).

### Step 3: SRS Review Execution
1. The UI components (`components/features/srs/`) read the unified state from `useSRSStore` to determine which cards are due for review.
2. The UI uses the IDs of due cards to render the actual content fetched from Sanity.
3. When a user answers a flashcard, `useSRSStore` updates the card's interval and ease factor locally. The ID of the modified card is added to a `dirtySrs` Set.

### Step 4: Background Synchronization (Zustand -> Supabase)
1. `useSyncProgress.ts` constantly observes changes to the `dirtySrs` Set.
2. Upon detecting changes, it triggers a debounced background mutation (to avoid spamming the database).
3. The mutation calls a Supabase RPC (`sync_user_progress`) that atomically upserts the new SRS states and updates gamification (XP/Streak) ensuring data integrity without blocking the user interface.
