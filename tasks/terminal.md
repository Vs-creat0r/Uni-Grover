# Terminal Agent Prompts — Uni-Grover

> **Purpose:** Ready-to-paste prompts for Claude Code terminal sessions. Copy a prompt below and paste it into a terminal running `claude`.
> **Last Updated:** 2026-06-21

---

## 📋 Prompt Log (Completed)

### Prompt #1 — Initial Setup ✅
**Status:** DONE
**Given to:** Terminal 1
```
Read the file specs/spec-initial-setup.md in d:\SDLC\projects\Uni-Grover. Execute all the steps defined there to initialize Next.js 14 with TypeScript, Tailwind CSS, and Supabase client wrappers. Work inside the src/ directory. Do not modify any files outside d:\SDLC\projects\Uni-Grover.
```

---

## 🔜 Next Prompts (Ready to Paste)

### Prompt #2 — Courses Page (CRUD + Join Codes) ✅
**Status:** DONE
**Assign to:** Any terminal
```
You are working on the Uni-Grover project at d:\SDLC\projects\Uni-Grover.

CONTEXT:
- This is a Next.js 14 App Router project. The app code lives in src/src/app/.
- We use Tailwind CSS with CSS custom properties for theming (dark + light mode). See src/src/app/globals.css for all design tokens.
- The dashboard layout with sidebar already exists at src/src/app/dashboard/layout.tsx.
- The Supabase URL is in src/.env.local. The database schema is at supabase/migrations/20260621_initial_schema.sql.
- Read context/architecture.md for the system design and prd.md for full product requirements.

TASK:
1. Create the Courses page at src/src/app/dashboard/courses/page.tsx
   - Display a grid of course cards showing: title, description, student count, join code
   - Include a "Create New Course" button that opens a modal/form
   - Use mock data for now (3-4 sample courses)
   - Each course card should link to /dashboard/courses/[id]

2. Create the Course Detail page at src/src/app/dashboard/courses/[id]/page.tsx
   - Show course title, description, join code with copy button
   - Show a list of topics generated for this course
   - Show enrolled students count
   - Include a "Generate Content for This Course" link to /dashboard/generate

STYLING RULES:
- Use CSS custom properties from globals.css (e.g., var(--bg-card), var(--text-primary), var(--accent), var(--border))
- Use the existing CSS classes: .card, .btn, .btn-primary, .btn-secondary, .btn-ghost, .input
- Support dark mode — all colors must use CSS variables, never hardcode colors
- Add the class "animate-fade-in" to page wrapper divs for entrance animation
- Do NOT install any new npm packages
- Do NOT modify globals.css, layout.tsx, or any existing files
```

---

### Prompt #3 — Landing Page + Auth Pages ✅
**Status:** DONE
**Assign to:** Any terminal
```
You are working on the Uni-Grover project at d:\SDLC\projects\Uni-Grover.

CONTEXT:
- Next.js 14 App Router. App code in src/src/app/.
- Tailwind CSS + CSS custom properties for dark/light theming. See src/src/app/globals.css.
- Supabase is the auth provider. Client wrappers are in src/lib/supabase/.
- Read prd.md for the product vision and context/architecture.md for the system design.

TASK:
1. Create the Landing Page at src/src/app/page.tsx (REPLACE the existing default Next.js page)
   - Hero section: "Uni-Grover — AI-Powered Education Platform"
   - Subtitle: "Transform teaching with AI-generated content, behavioral nudges, and interactive student engagement"
   - Two CTA buttons: "Get Started as Professor" and "Join as Student"
   - Features section: highlight 4 key features (Content Generation, Nudge Engine, Live Sessions, Anonymous Q&A) with icons and short descriptions
   - Clean, premium, modern design — inspired by Linear.app landing page aesthetics
   - Must support dark and light modes using CSS variables from globals.css

2. Create Login page at src/src/app/auth/login/page.tsx
   - Email + password form
   - "Sign in" button
   - Link to signup page
   - Centered card layout

3. Create Signup page at src/src/app/auth/signup/page.tsx
   - Email + password + full name form
   - Role selector: "I am a Professor" / "I am a Student" (two toggle buttons)
   - "Create Account" button
   - Link to login page

STYLING RULES:
- Use CSS custom properties from globals.css (var(--bg-card), var(--text-primary), var(--accent), var(--border), etc.)
- Use existing CSS classes: .card, .btn, .btn-primary, .btn-secondary, .input
- Dark mode support required — never hardcode colors
- Add "animate-fade-in" class to wrapper divs
- Do NOT install new packages. Do NOT modify globals.css or dashboard files.
```

---

### Prompt #4 — Student Portal ✅
**Status:** DONE
**Assign to:** Any terminal
```
You are working on the Uni-Grover project at d:\SDLC\projects\Uni-Grover.

CONTEXT:
- Next.js 14 App Router. App code in src/src/app/.
- Tailwind CSS + CSS custom properties. See src/src/app/globals.css for all design tokens.
- Read context/student_features_discussion.md for the full student feature requirements.
- Read prd.md for product requirements and context/architecture.md for system design.
- The professor dashboard layout already exists as a reference at src/src/app/dashboard/layout.tsx.

TASK:
1. Create Student layout at src/src/app/student/layout.tsx
   - Sidebar with nav: Dashboard, My Courses, Live Sessions, Portfolio, Settings
   - Header with theme toggle (import useTheme from @/components/theme-provider)
   - Same collapsible sidebar pattern as the professor dashboard but with different nav items and a green accent instead of indigo

2. Create Student Dashboard at src/src/app/student/page.tsx
   - Welcome message
   - Learning Streak Tracker (show current streak as "🔥 5 Day Streak")
   - Enrolled courses grid (mock data: 3 courses)
   - "Did You Know?" sidebar widget with a fun fact
   - Achievement Badges section (3-4 mock badges)

3. Create Student Course View at src/src/app/student/course/[id]/page.tsx
   - Course title + professor name
   - List of topics with difficulty level badges (Beginner/Intermediate/Advanced)
   - "Explore Mode" section with 3 mini-challenges
   - "Career Path" section showing related careers

4. Create Student Topic View at src/src/app/student/topic/[id]/page.tsx
   - Display the full generated lesson (hook, why_this_matters, core_explanation, analogy, etc.)
   - "Explain Like I'm 5" button
   - "Explain Differently" button (calls /api/generate with different prompt)
   - Curiosity Question section for debate
   - "Build This" challenge suggestion

STYLING RULES:
- Use CSS custom properties from globals.css
- Use existing CSS classes: .card, .btn, .btn-primary, .btn-secondary, .btn-ghost, .input, .nudge-card
- Support dark mode — all colors via CSS variables
- Add "animate-fade-in" to wrapper divs
- Do NOT install new packages. Do NOT modify globals.css or any dashboard/ files.
```

---

### Prompt #5 — Live Presentation + Settings ✅
**Status:** DONE
**Assign to:** Any terminal
```
You are working on the Uni-Grover project at d:\SDLC\projects\Uni-Grover.

CONTEXT:
- Next.js 14 App Router. App code in src/src/app/.
- Tailwind CSS + CSS custom properties. See src/src/app/globals.css.
- Read context/professor_features_discussion.md for live session features.
- The Nudge Engine API is at src/src/app/api/nudges/route.ts.
- Anonymous Questions schema: see supabase/migrations/20260621_initial_schema.sql (live_questions table).

TASK:
1. Create Live Presentation page at src/src/app/dashboard/live/page.tsx
   - "Start New Session" button that generates a session ID
   - QR code display area (just show the URL as text for now: "Share this link: localhost:3000/student/live/[sessionId]")
   - Anonymous Questions panel: list of questions with upvote buttons
   - Nudge widget that fetches from /api/nudges?context=live_session
   - Slide navigation (Previous / Next buttons with slide counter)

2. Create Student Live Session page at src/src/app/student/live/[sessionId]/page.tsx
   - "Ask a Question" text input with submit button
   - Display current question list
   - Simple poll widget (mock: "Do you understand this concept? Yes / Somewhat / No")

3. Create Settings page at src/src/app/dashboard/settings/page.tsx
   - Profile section: name, email (read-only for now)
   - Theme section: dark/light toggle (use useTheme from @/components/theme-provider)
   - API section: show masked OpenRouter API key
   - Danger zone: "Delete Account" button (non-functional, just UI)

4. Create Content Library page at src/src/app/dashboard/library/page.tsx
   - Grid of previously generated topic cards (mock data: 6-8 topics)
   - Search bar at top
   - Filter by course dropdown
   - Each card shows: topic title, course name, date generated, audience level badge

STYLING RULES:
- Use CSS custom properties from globals.css
- Use existing CSS classes: .card, .btn, .btn-primary, .btn-secondary, .btn-ghost, .input, .nudge-card
- Support dark mode — all colors via CSS variables
- Add "animate-fade-in" to wrapper divs
- Do NOT install new packages. Do NOT modify globals.css or existing pages.
```

---

## 📝 How to Use This File

1. Open a terminal in VS Code
2. Run `claude` to start Claude Code
3. Copy ONE prompt from above and paste it
4. Wait for it to finish
5. Move to the next prompt

**Rule:** Only run ONE prompt per terminal at a time. If you have 2 terminals, run 2 different prompts simultaneously (they work on different files so no conflicts).
