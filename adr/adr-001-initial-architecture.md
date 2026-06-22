# 📝 ADR-001 — Initial Architecture

> **Project**: Uni-Grover
> **Date**: 2026-06-20
> **Status**: Accepted
> **Deciders**: Dishank

---

## Context

_What is the issue or situation that prompted this decision?_

We need to build a platform for professors and students that generates educational content (lecture docs, PPTs, warm-ups) from raw topics (text, PDF, images). The platform must:
- Reduce professor prep time by 50%
- Include behavioral nudges to improve teaching quality
- Support real-time features (anonymous questions, live quizzes)
- Be cost-efficient (target < $0.50/lecture AI cost)

---

## Decision

_What is the change we are making?_

We will build Uni-Grover with the following technology stack:

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | Next.js 16 App Router, TypeScript | React Server Components for performance; API routes for AI interactions |
| **Styling** | Vanilla CSS (CSS Custom Properties) | Custom design system, built-in light/dark mode, premium aesthetic without Tailwind clutter |
| **Backend/Database** | Supabase (PostgreSQL) | Instant Postgres, built-in Auth, Realtime for live features (quizzes, Q&A) |
| **AI Services** | Gemini 2.5 Flash API | Fast, high-quality content generation with lower latency |
| **Hosting** | Vercel (frontend), Supabase (DB/Auth) | Zero-config deployments, auto-scaling |
| **Language** | Strict TypeScript | Type safety for AI-generated JSON structures |

---

## Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| **Chosen**: Next.js + Supabase + Vercel | Full-stack JS/TS, integrated auth/realtime, serverless, cost-effective | Vendor lock-in to Vercel/Supabase |
| Alternative 1: Next.js + custom Node/Express + PostgreSQL + Railway | Full control, no vendor lock-in | More ops overhead, manual auth/realtime setup |
| Alternative 2: Python/FastAPI + React + Supabase | Python AI ecosystem, flexible backend | Split stack adds complexity, harder code sharing |

---

## Consequences

### Positive
- **Developer velocity**: Shared TypeScript types across frontend/backend
- **Real-time ready**: Supabase Realtime channels for live quizzes/Q&A
- **Cost optimization**: On-demand AI generation, caching, model routing
- **Type safety**: End-to-end TypeScript reduces runtime bugs

### Negative
- **Vendor dependency**: Vercel + Supabase pricing changes could affect costs
- **Cold starts**: Serverless functions may have latency for AI generation
- **Bundle size**: Next.js + shadcn/ui may increase initial JS payload

### Risks
- **AI API cost overruns**: Mitigated by strict topic limits, caching, and model routing
- **Supabase rate limits**: Realtime channels have connection limits; need connection pooling
- **OCR accuracy**: Tesseract.js may struggle with complex PDFs; fallback to manual input

---

## Notes

- Supabase RLS policies must enforce professor-only access to own materials and student data isolation
- AI generation should be server-side (Next.js API routes) to protect API keys
- Consider implementing a job queue (e.g., using Supabase Edge Functions or Inngest) for long-running AI generation 
