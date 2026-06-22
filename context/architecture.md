# System Architecture: Uni-Grover

> **Last updated: 2026-06-21**

---

## High-Level System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│   Next.js 14 App Router (RSC + Client Components)               │
│   ┌──────────────────┐  ┌──────────────────┐                    │
│   │  Professor Portal │  │  Student Portal   │                   │
│   │  /dashboard/*     │  │  /student/*        │                  │
│   └────────┬─────────┘  └────────┬──────────┘                   │
│            │                      │                               │
│   ┌────────▼──────────────────────▼──────────┐                  │
│   │         API Routes (Middleware)           │                   │
│   │  /api/generate  /api/nudges  /api/auth   │                  │
│   └────────┬──────────────────────┬──────────┘                  │
└────────────┼──────────────────────┼──────────────────────────────┘
             │                      │
     ┌───────▼───────┐    ┌────────▼────────┐
     │  OpenRouter    │    │   Supabase      │
     │  (LLM API)    │    │   PostgreSQL    │
     │  Free models   │    │   Auth          │
     │               │    │   Realtime WS   │
     └───────────────┘    └─────────────────┘
```

---

## 🧠 The Nudge Engine Architecture

The most critical differentiator of Uni-Grover. Subtly improves teaching behavior without formal training.

### Implementation Status: ✅ API Built, Seeded with 12 Tips

```
┌─────────────────────────────────────────────────┐
│                 NUDGE ENGINE                     │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌───────────┐    ┌──────────────┐               │
│  │  Nudge    │    │  Context     │               │
│  │  Library  │───▶│  Matcher     │               │
│  │  (12 tips │    │  (category + │               │
│  │   seeded) │    │   trigger)   │               │
│  └───────────┘    └──────┬───────┘               │
│                          │                        │
│  ┌───────────┐    ┌──────▼───────┐               │
│  │  User     │    │  Display     │               │
│  │  History  │───▶│  Controller  │               │
│  │  (TODO:   │    │  (random,    │               │
│  │  Supabase)│    │   dismiss)   │               │
│  └───────────┘    └──────┬───────┘               │
│                          │                        │
│                   ┌──────▼───────┐               │
│                   │  Rendered as │               │
│                   │  .nudge-card │               │
│                   │  component   │               │
│                   └──────────────┘               │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Nudge Categories:** `behavior`, `content_creation`, `general`
**Trigger Contexts:** `dashboard`, `pre_generation`, `post_generation`, `live_session`

**API:** `GET /api/nudges?category=behavior&context=dashboard`

### Trigger Points (Currently Active)
- ✅ **Dashboard load** → shows 1 teaching tip in `.nudge-card`
- ✅ **Content generation page** → tip appears before generation
- 🔲 **Live session** → tip during presentation (pending)
- 🔲 **Weekly digest** → email notification (future)

---

## Data Flow: Content Generation

### Implementation Status: ✅ API Built with OpenRouter

1. **Professor Input:** Topic name, target audience (Beginner/Intermediate/Advanced), toggles (Ethics, Industry Examples)
2. **Prompt Assembly:** Next.js API route constructs structured prompt from templates in `context/prompts.md`
3. **LLM Execution:** Calls OpenRouter API (model: `google/gemma-7b-it:free`)
4. **Response Parsing:** AI returns structured JSON with: hook, why_this_matters, real_world_examples, core_explanation, analogy, common_misconception, curiosity_question
5. **Delivery:** Frontend renders each section in styled cards
6. 🔲 **Storage:** Save to Supabase `topics` table (pending Supabase auth setup)

**API:** `POST /api/generate` with body `{ topic, audience, includeEthics }`

---

## Database Schema

Defined in `supabase/migrations/20260621_initial_schema.sql`

| Table | Purpose | Status |
|-------|---------|--------|
| `profiles` | Extends Supabase Auth (name, role) | Defined |
| `courses` | Professor's courses with join codes | Defined |
| `enrollments` | Student ↔ Course many-to-many | Defined |
| `topics` | AI-generated lesson content (JSON) | Defined |
| `nudges` | Teaching tip library | Defined (seeded in API) |
| `nudge_history` | Track shown/dismissed nudges | Defined |
| `live_questions` | Anonymous student questions | Defined |

---

## Page Map

### Professor Portal
| Route | Component | Status |
|-------|-----------|--------|
| `/dashboard` | Dashboard with nudge, stats, news | ✅ Built |
| `/dashboard/generate` | Content generation form + output | ✅ Built |
| `/dashboard/courses` | Course management | 🔲 Pending |
| `/dashboard/courses/[id]` | Single course detail | 🔲 Pending |
| `/dashboard/library` | Content library | 🔲 Pending |
| `/dashboard/live` | Live presentation mode | 🔲 Pending |
| `/dashboard/settings` | Profile & preferences | 🔲 Pending |

### Student Portal
| Route | Component | Status |
|-------|-----------|--------|
| `/student` | Student dashboard | 🔲 Pending |
| `/student/course/[id]` | Course view + explore mode | 🔲 Pending |
| `/student/topic/[id]` | Full lesson view | 🔲 Pending |
| `/student/live/[sessionId]` | Live Q&A session | 🔲 Pending |

### Shared
| Route | Component | Status |
|-------|-----------|--------|
| `/` | Landing page | 🔲 Needs rebuild |
| `/auth/login` | Login | 🔲 Pending |
| `/auth/signup` | Signup with role selection | 🔲 Pending |
| `/join/[code]` | Join course via link | 🔲 Pending |

---

## Design System

Lives entirely in `src/src/app/globals.css`. Both dark and light modes supported via `.dark` class toggle.

**Theming:** CSS custom properties (30+ tokens) switch automatically
**Theme Toggle:** `ThemeProvider` component at `src/src/components/theme-provider.tsx`
**Persistence:** localStorage key `uni-grover-theme`
**Default:** Follows OS preference, then user choice
