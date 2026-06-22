# 🛠️ Specification: Initial Setup (Phase 1)

**Project:** Uni-Grover
**Status:** Ready for Execution
**Objective:** Establish the foundational infrastructure, boilerplate, and database connections required before building core features.

---

## 1. Scope of Work

This first chunk of work focuses strictly on **Project Initialization and Foundation**. We will not build any business logic (like topic extraction or AI generation) in this phase. The goal is to get a clean, functional environment running to support all future work.

### 1.1. Frontend Initialization
- [x] Initialize a Next.js 14 project (App Router, TypeScript).
- [x] Configure Tailwind CSS.
- [x] Initialize `shadcn/ui` with core utilities and theming (standardizing typography and primary brand colors).
- [x] Set up a clean folder structure inside `src/` (e.g., `app`, `components`, `lib`, `hooks`).

### 1.2. Database & Authentication (Supabase)
- [x] Set up the Supabase client connection inside `src/lib/supabase`.
- [x] Establish standard `.env.local` and `.env.example` configurations.
- [x] Set up Supabase SSR auth helpers for Next.js App Router.
- [x] Create the foundational database schema definitions (either SQL files or Supabase migrations folder) for users.

### 1.3. Code Quality & Formatting
- [x] Configure ESLint and Prettier for strict, standardized formatting.
- [x] Ensure standard Git ignores (`.gitignore`) are correctly updated for Next.js and Supabase environment variables.

---

## 2. Technical Decisions

- **Framework:** Next.js 14 App Router.  
  *Why?* To leverage React Server Components (RSC) for performance, and to use its simple API route handling for future AI interactions (OpenRouter/Claude).
- **Styling:** Tailwind CSS + `shadcn/ui`.  
  *Why?* Highly customizable, accessible, and allows us to rapidly build premium-feeling interfaces without fighting overriding CSS.
- **Backend as a Service:** Supabase.  
  *Why?* Instant Postgres, built-in Auth, and real-time sockets (channels) which we need later for live quizzes and anonymous questions.
- **Language:** Strict TypeScript.  
  *Why?* Reduces runtime bugs, especially when passing complex AI-generated JSON objects between the server and client.

---

## 3. Execution Steps

1. Configure Next.js in the root directory, utilizing the existing `src/` folder for application code.
2. Run the `shadcn/ui` init command to establish the component library configuration.
3. Install required dependencies: `@supabase/supabase-js`, `@supabase/ssr`, `lucide-react` (icons), etc.
4. Create `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts` wrappers for Supabase interactions.
5. Create an `.env.example` file with placeholder variables for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
6. Define the basic layout skeleton in `src/app/layout.tsx` (font imports, main wrapper).

---

## 4. Verification

- The Next.js dev server (`npm run dev`) runs without errors.
- A basic "Welcome to Uni-Grover" splash page renders at `/`.
- The Supabase client code compiles and initializes correctly.
- Component imports utilizing the `@/*` path alias work seamlessly.
