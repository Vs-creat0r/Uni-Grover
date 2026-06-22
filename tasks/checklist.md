# ✅ Task Checklist — Uni-Grover

> **Created**: 2026-06-20
> **Last Updated**: 2026-06-22
> **Status**: In Progress

---

## Phase 1: Planning 📐
- [x] Brainstorm & expand idea
- [x] Complete PRD (`prd.md`)
- [x] Create initial spec(s) in `specs/`
- [x] Document architecture decisions in `adr/`
- [x] Set up `CLAUDE.md` context file
- [x] Create architecture document in `context/`

## Phase 2: Building 🔨
- [x] Set up project structure in `src/`
- [x] Implement design system (globals.css — dark/light mode, 30+ tokens)
- [x] Implement ThemeProvider component
- [x] Build Content Generation API (`/api/generate` — Gemini 2.5 Flash)
- [x] Build Quiz Generation API (`/api/generate-quiz`)
- [x] Build Nudge Engine API (`/api/nudges` — 12 teaching tips)
- [x] Build Professor Dashboard (nudge widget, stats, news feed)
- [x] Build Content Generation UI (topic input, audience selector, AI output, **working buttons**)
- [x] Build Courses Page (CRUD with Supabase, join codes, copy link)
- [x] Build Course Detail Page (topics from Supabase, students, breadcrumb)
- [x] Build Content Library Page (search, filter, **clickable cards** → detail view)
- [x] Build Content Library Detail Page (`/dashboard/library/[id]`)
- [x] Build Live Presentation Page (**PDF upload, AI analysis, fullscreen, feedback panel**)
- [x] Build Live Session API (`/api/live/session`, `/api/live/analyze`, `/api/live/feedback`)
- [x] Build Settings Page (profile, theme, API keys, nudge prefs)
- [x] Build Student Portal (layout, dashboard, course view, topic view)
- [x] Build Student Live Session Page (**enrollment login, AI questions/options, feedback**)
- [x] Build Landing Page (hero, features, CTA)
- [x] Build Auth Pages (login, signup with role selection)
- [x] Build Join Course Page (QR/link flow)
- [x] Wire Courses CRUD to Supabase ✅
- [x] Wire Content Generation to Supabase ✅
- [x] Wire Content Library to Supabase ✅
- [x] Update CLAUDE.md with full project context ✅
- [x] Create terminal.md with ready-to-paste prompts
- [x] Wire auth to Supabase
- [x] Build session history view (past sessions)
- [ ] Professor star/bookmark on student queries
- [ ] Run context update after major changes

## Phase 3: Testing 🧪
- [ ] Verify dev build compiles
- [ ] Write unit tests for critical logic
- [ ] Write integration tests
- [ ] Write E2E tests (if applicable)
- [ ] All tests passing

## Phase 4: Security 🔒
- [ ] Run dependency audit
- [ ] Run static analysis
- [ ] Run secret scanning
- [ ] Review auth/logic boundaries
- [ ] Security score > 80

## Phase 5: Bug Fixing 🐛
- [ ] Run type checker
- [ ] Run linter
- [ ] Fix all critical/high issues
- [ ] Clear all TODO/FIXME items (or document them)
- [ ] Dead code removed

## Phase 6: Recording 📊
- [ ] Document test results
- [ ] Document security results
- [ ] Document bug scan results
- [ ] Update eval scores
- [ ] Final consolidated report generated

---

## Notes

- Phase 2 UI complete: 18 pages/components built (2026-06-21)
- All pages support dark + light mode via CSS custom properties
- Supabase integration complete for: Courses, Content Library, Live Sessions (2026-06-22)
- AI powered by Gemini 2.5 Flash (replaced OpenRouter free tier)
- Live Presentation system: PDF upload → AI analysis → student feedback loop
- Terminal prompts ready in `tasks/terminal.md`
- DB schema: `supabase/migrations/20260622_full_schema.sql`
