# CLAUDE.md — Uni-Grover

> This file provides context to AI coding assistants (Claude Code, Antigravity) about this project.
> **Last updated: 2026-06-22**

---

## Project Overview

- **Name**: Uni-Grover (also referred to as EDU-Oracle)
- **Description**: AI-powered education platform that generates structured lesson content for professors and provides interactive learning tools for students. Core differentiator: a "Nudge Engine" that subtly improves teaching behavior through contextual tips. Includes a Live Presentation system with AI slide analysis and real-time student feedback.
- **Type**: web (Next.js full-stack)
- **Status**: Active — Phase 2 (Building)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Language | TypeScript (Strict) |
| Framework | Next.js 16 (App Router) + CSS Custom Properties |
| UI Components | Custom CSS design system (see globals.css) |
| Backend/Database | Supabase (Postgres, Realtime) |
| AI/LLM | Google Gemini 2.5 Flash API |
| PDF Processing | pdfjs-dist (Mozilla PDF.js) |
| Package Manager | npm |
| Fonts | Geist Sans, Geist Mono (via next/font) |

---

## Project Structure

```
d:\SDLC\projects\Uni-Grover\
├── prd.md                          # Product Requirements Document
├── CLAUDE.md                       # This file — AI context
├── research-scratchpad.md          # Research notes
├── adr/                            # Architecture Decision Records
│   └── adr-001-initial-architecture.md
├── context/
│   ├── architecture.md             # System architecture & Nudge Engine design
│   ├── overview.md                 # Project overview
│   ├── prompts.md                  # AI prompt engineering templates
│   ├── professor_features_discussion.md  # Full professor feature spec
│   └── student_features_discussion.md    # Full student feature spec
├── specs/
│   ├── spec-initial-setup.md       # Phase 1 setup spec (DONE)
│   └── spec-core-features.md       # Phase 2 core features spec
├── supabase/
│   └── migrations/
│       ├── 20260621_initial_schema.sql   # Original schema (superseded)
│       └── 20260622_full_schema.sql      # ⭐ Current schema (courses, generated_content, live_sessions, slide_feedback)
├── tasks/
│   ├── checklist.md                # Phase checklist
│   └── terminal.md                 # Ready-to-paste Claude Code prompts
├── src/                            # Next.js project root
│   ├── .env.local                  # Environment variables (Supabase, Gemini)
│   ├── package.json
│   ├── tsconfig.json               # @/* alias → ./src/*
│   └── src/
│       ├── app/
│       │   ├── globals.css         # ⭐ Full design system (dark/light tokens, components)
│       │   ├── layout.tsx          # Root layout with ThemeProvider
│       │   ├── page.tsx            # Landing page
│       │   ├── api/
│       │   │   ├── generate/route.ts       # Content generation (Gemini 2.5 Flash)
│       │   │   ├── generate-quiz/route.ts  # Quiz generation from content
│       │   │   ├── nudges/route.ts         # Nudge Engine API
│       │   │   └── live/
│       │   │       ├── analyze/route.ts    # AI slide analysis (single call)
│       │   │       ├── session/route.ts    # Live session CRUD
│       │   │       └── feedback/route.ts   # Student feedback per slide
│       │   ├── dashboard/
│       │   │   ├── layout.tsx      # Dashboard layout (sidebar, header)
│       │   │   ├── page.tsx        # Professor Dashboard
│       │   │   ├── generate/page.tsx       # ⭐ Content Generation (working buttons)
│       │   │   ├── courses/
│       │   │   │   ├── page.tsx    # Courses list (Supabase CRUD)
│       │   │   │   └── [id]/page.tsx       # Course detail
│       │   │   ├── library/
│       │   │   │   ├── page.tsx    # Content Library (clickable cards)
│       │   │   │   └── [id]/page.tsx       # ⭐ Content detail view
│       │   │   ├── live/page.tsx   # ⭐ Live Presentation (PDF upload, slides, feedback)
│       │   │   └── settings/page.tsx
│       │   └── student/
│       │       ├── layout.tsx
│       │       ├── page.tsx
│       │       └── live/
│       │           └── [sessionId]/page.tsx # ⭐ Student live view (AI questions, feedback)
│       ├── components/
│       │   └── theme-provider.tsx
│       └── lib/
│           └── supabase.ts         # Supabase client
```

---

## Database Schema (Supabase)

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `courses` | Professor courses | `id` (TEXT slug), `title`, `join_code` |
| `generated_content` | AI lesson content | `course_id` → courses, `topic`, `hook`, `analogy`, etc. |
| `live_sessions` | Live presentation sessions | `id` (6-char code), `slide_data` (JSONB), `current_slide` |
| `slide_feedback` | Student responses per slide | `session_id` → live_sessions, `student_id`, `response_type` |

---

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/generate` | POST | Generate AI lesson content. Body: `{ topic, audience, includeEthics, courseId, regenerate }` |
| `/api/generate-quiz` | POST | Generate 5 MCQ quiz. Body: `{ topic, content }` |
| `/api/nudges` | GET | Get a teaching tip. Params: `?context=dashboard` |
| `/api/live/session` | POST/GET/PATCH | Create, read, update live sessions |
| `/api/live/analyze` | POST | AI analysis of PDF slide texts (single call for all slides) |
| `/api/live/feedback` | POST/GET | Student feedback submission and retrieval |

---

## Design System

The entire design system lives in `src/src/app/globals.css`. It uses CSS custom properties that automatically switch between dark and light modes via the `.dark` class on `<html>`.

**Key CSS classes available:**
- `.card` — bordered container with shadow and hover effect
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost` — button variants
- `.input` — styled form input with focus ring
- `.sidebar`, `.sidebar-nav-item`, `.sidebar-nav-item.active` — sidebar navigation
- `.header` — sticky header with blur backdrop
- `.nudge-card` — yellow/amber tip card with 💡 icon
- `.animate-fade-in`, `.animate-slide-in`, `.animate-nudge` — entrance animations
- `.toggle-switch`, `.toggle-switch.active` — theme toggle switch

**Key CSS variables:**
- `var(--bg-primary)`, `var(--bg-secondary)`, `var(--bg-card)`, `var(--bg-sidebar)`, `var(--bg-input)`
- `var(--text-primary)`, `var(--text-secondary)`, `var(--text-muted)`
- `var(--accent)`, `var(--accent-hover)`, `var(--accent-light)`
- `var(--border)`, `var(--border-strong)`
- `var(--success)`, `var(--warning)`, `var(--error)`
- `var(--nudge-bg)`, `var(--nudge-border)`, `var(--nudge-text)`

---

## Coding Conventions

- Follow existing code style and patterns in this project
- Name things explicitly — avoid generic AI names
- **Use CSS custom properties from globals.css — never hardcode colors**
- **Support dark mode — all new UI must work in both light and dark**
- **Add `animate-fade-in` class to page wrapper divs**
- **All AI calls go through Gemini 2.5 Flash** (`gemini-2.5-flash`)

---

## Context Files

- **PRD**: See `prd.md` for product requirements
- **Feature Specs**: See `context/professor_features_discussion.md` and `context/student_features_discussion.md`
- **Architecture**: See `context/architecture.md` for system design & Nudge Engine
- **Prompts**: See `context/prompts.md` for AI prompt engineering templates
- **Tasks**: See `tasks/checklist.md` for phase checklist
- **DB Schema**: See `supabase/migrations/20260622_full_schema.sql`

---

## Environment Variables (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
GEMINI_API_KEY=...
```

---

## Test Commands

```powershell
cd d:\SDLC\projects\Uni-Grover\src
npm run dev
```

---

## Known Issues / TODOs

- Landing page needs polish
- Professor star/bookmark on student queries not yet implemented
- PPTX support deferred to v2 (PDF only for now)
- Phase 2 professor features (Story generator, anonymous box, etc) are next.
