# 📋 Product Requirements Document — Uni-Grover

> **Created**: 2026-06-20
> **Status**: Draft
> **Author**: Dishank

---

## 1. Problem Statement

_What problem does this project solve? Why does it matter?_

> **The Problem:** Modern education often focuses on producing students who can remember information rather than students who can think, create, solve problems, and act ethically. Simultaneously, professors are overworked with lesson preparation and often lack formal training in modern, engaging teaching methodologies.
> 
> **The Solution (Uni-Grover):** A platform that serves two primary purposes:
> 1. **For the Professor:** An effortless content generation tool that takes raw topics (text, PDFs, images) and creates multi-format, presentation-ready content (PPTs, infographics, podcasts, gamified warm-ups).
> 2. **For the Education System:** A "Silent Coach." Through an embedded **Behavioral Nudge System**, the platform subtly guides professors to adopt better teaching habits (e.g., asking "Why?", using real-world examples, pausing for questions) directly within their workflow, naturally transforming them into mentors and catalysts for curiosity.

---

## 2. Target Users

_Who is this for?_

| User Type | Description | Primary Need |
|-----------|-------------|--------------|
| **Professors / Educators** | The content creators and classroom leaders. | To dramatically reduce lesson prep time while simultaneously improving their teaching delivery and student engagement, all without requiring formal pedagogical training. |
| **Students** | The consumers of the educational content. | To experience learning that is easy, natural, curiosity-driven, and clearly connected to real-world applications and their future careers. |

---

## 3. Features & Requirements

### Must Have (MVP)
- [x] **Topic Upload & Auto-Extraction:** Support for Text. (PDF in Live Session). Max limits enforced.
- [x] **Core Content Generation:** Auto-generate structured Lecture Documentation.
- [x] **Behavioral Nudge System (Professors):** Contextual tips during content creation (Basic version with 12 nudges).
- [ ] **Gamified Warm-Ups:** Auto-generated 2-5 minute interactive hooks to start lectures.
- [x] **"Why This Matters" & Real-World Examples:** AI automatically structures content to explain the *why* before the *how*.
- [ ] **QR Code Attendance:** Basic attendance tracking via QR scan for live presentations.

### Should Have (v1.1)
- [ ] **Multi-Format Output Expansion:** Generate Infographics, Podcasts/Audio Clips, and Video snippets.
- [ ] **Field News Feed (Professors):** Personalized dashboard feed with the latest industry developments to keep professors current.
- [ ] **Anonymous Question Box (Students):** A fear-free way for students to ask questions during or after a lecture.
- [ ] **"Anticipate Student Questions" (Professors):** AI predicts tough student questions and prepares answers.
- [x] **"Explain Differently" Button:** One-click alternative analogy generation for when students are confused.
- [x] **Interactive Quizzes:** Third-party quiz hub integration (Quizizz, Kahoot, OpExams) rather than built-in to save dev time.

### Nice to Have (Future)
- [ ] **Student Portfolio Showcase & Sandbox:** Environments for students to build projects and experiment.
- [ ] **Learning Pathway Visualization:** Visual map of a student's journey and recommended next topics.
- [ ] **Multi-Language Translation:** One-click translation of all generated materials.
- [ ] **Research Paper Aggregator:** Summarize recent papers for professors automatically to keep their deep domain expertise sharp.

---

## 4. Success Criteria

_How do we know this project is done and working?_

| Criteria | Metric | Target |
|----------|--------|--------|
| **Adoption & Usage** | Active Professors | 100+ active professors within the first 3 months. |
| **Time Savings** | Average Prep Time Reduction | Professors save at least 50% of the time usually spent creating PPTs and lesson plans. |
| **Cost Efficiency** | Average AI Cost per Lecture | Maintained under a specific target (e.g., <$0.50) via caching and strict limits. |
| **Student Engagement** | Participation Rate | 80%+ of students interacting with Gamified Warm-Ups and the Anonymous Question Box. |
| **Behavioral Impact** | Nudge Acceptance Rate | Professors adopt or enable suggestions from the Behavioral Nudge System 40%+ of the time. |

---

## 5. Out of Scope

_What are we explicitly NOT building?_

- A complete Learning Management System (LMS) replacement (e.g., complex grading rubrics, university billing, or enrollment).
- Fully automated grading of subjective essays.
- Real-time video conferencing platforms (like Zoom/Meet) – this platform is meant for live or hybrid presentation augmentation, not video calling.

---

## 6. Tech Stack & Architecture

| Layer | Technology | Reason |
|-------|------------|--------|
| **Frontend** | Next.js 16 (App Router), Vanilla CSS | Rapid UI development, optimal performance, custom design system. |
| **Backend** | Next.js API Routes | Seamless JavaScript ecosystem integration; handles async AI generation jobs efficiently. |
| **Database & Auth** | Supabase (PostgreSQL) | Chosen for robust relational data modeling. Implemented Auth with simple role-based routing. Student enrollments map to professor courses. |
| **AI / ML Services** | Gemini 2.5 Flash | Chosen for fast, high-quality, nuanced content generation and formatting. |
| **Hosting** | Vercel (Frontend), Supabase (DB/Auth) | Scalable, zero-config deployments optimized for MVP speed. |

---

## 7. Cost Optimization & API Guidelines

_Crucial rules to ensure the platform remains financially sustainable and API resources are not wasted:_

- **Strict Input Limits:** The system must strictly enforce the 3-5 topic limit per upload to prevent massive, expensive token usage from single unstructured document dumps.
- **On-Demand Generation:** Heavy AI features (like "Explain Differently" or "Anticipate Student Questions") must be triggered manually by the professor clicking a button, rather than auto-generating in the background for every topic.
- **Caching & Reusability:** If a professor (or someone in their institution) uploads an identical or highly similar topic, the system should cache and serve the previously generated documentation/PPT structures where possible instead of hitting the AI API again.
- **Model Routing:** Use smaller, cheaper LLMs for simple classification or topic extraction, and reserve the most capable (and expensive) models strictly for the core documentation and complex content generation.

---

## 8. Timeline

| Phase | Target Date | Status |
|-------|-------------|--------|
| PRD Complete | Today | ✅ |
| Architecture & Design | TBD | ⬜ |
| MVP Ready | TBD | ⬜ |
| Testing Done | TBD | ⬜ |
| Production | TBD | ⬜ |

---

## 9. Notes & References

- **Core Philosophy:** "Education should not focus on producing students who can remember information. It should focus on producing students who can think, create, solve problems, act ethically, and continue learning throughout life."
- **Professor's Role:** A catalyst for curiosity and a mentor, guided silently by the platform's embedded nudge architecture.
- **Reference Docs:** See `student_features_discussion.md` and `professor_features_discussion.md` for deep-dive feature breakdowns.
