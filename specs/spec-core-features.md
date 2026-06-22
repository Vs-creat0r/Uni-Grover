# 🛠️ Specification: Core Features (Phase 2)

**Project:** Uni-Grover
**Status:** Planning
**Objective:** Build the Professor Dashboard, the Content Generation UI, and the Nudge Engine Backend.

---

## 1. Target Outcome
*   A fully functional Professor Dashboard displaying the "Field News Feed" and "Student Engagement Insights".
*   A Content Generation form where professors can input topics and receive AI-generated lesson plans.
*   The Nudge Engine backend API (`/api/nudges`) that intelligently queries Supabase for teaching tips based on context.

## 2. Boundaries (Out-of-Scope for this PR)
*   The Student UI (Live Presentation View, Topic Sandbox).
*   Real-time WebSocket integrations (Anonymous questions).
*   Complex analytics visualizations (graphs/charts).

## 3. Technical Decisions & UI/UX Direction
*   **Design Language:** Clean, high-density, "Notion-like" interface for content generation, and "Linear-like" dark/light mode for the dashboard.
*   **Components:** Leverage `shadcn/ui` heavily (Cards, Data Tables, Form elements).
*   **State Management:** React `useState` and Server Actions where appropriate.

## 4. Acceptance Criteria
- [x] Professor can log in and view a dashboard layout with Sidebar and Header.
- [x] The Content Generation page allows inputting a Topic, Audience Level, and toggling "Include Ethics".
- [x] Submitting the generation form calls `/api/generate` and displays the structured JSON response in a readable format.
- [x] The `/api/nudges` endpoint returns a random, unseen nudge from the database for a given category.

## 5. Task Breakdown

### Frontend (Assigned to Terminal Agents)
1.  **Layouts:** Create `src/src/app/(dashboard)/layout.tsx` (Sidebar + Header).
2.  **Dashboard Page:** Create `src/src/app/(dashboard)/page.tsx` with placeholder Widgets.
3.  **Content Gen UI:** Create `src/src/app/(dashboard)/generate/page.tsx` with a React Hook Form.

### Backend (Assigned to Gemini IDE)
1.  **Nudge API:** Implement `src/src/app/api/nudges/route.ts` to query Supabase.
2.  **Nudge Database Seed:** Write a script or SQL to insert 5 initial teaching tips into the `nudges` table.
