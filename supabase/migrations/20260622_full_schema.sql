-- ============================================================
-- Uni-Grover — Full Database Schema (v2)
-- Run this ENTIRE script in your Supabase SQL Editor.
-- It safely drops conflicting tables first, then recreates everything.
-- ============================================================

-- 1. Drop existing tables in dependency order
DROP TABLE IF EXISTS slide_feedback CASCADE;
DROP TABLE IF EXISTS live_sessions CASCADE;
DROP TABLE IF EXISTS generated_content CASCADE;
DROP TABLE IF EXISTS courses CASCADE;

-- ============================================================
-- 2. COURSES
-- ============================================================
CREATE TABLE courses (
    id TEXT PRIMARY KEY,                            -- slug e.g. "cyber-security"
    title TEXT NOT NULL,
    description TEXT,
    students INTEGER DEFAULT 0,
    join_code TEXT UNIQUE NOT NULL,                  -- 6-char code for students
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE courses DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. GENERATED CONTENT  (linked to a course)
-- ============================================================
CREATE TABLE generated_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    audience TEXT NOT NULL DEFAULT 'intermediate',
    hook TEXT,
    why_this_matters TEXT,
    real_world_examples JSONB,
    core_explanation TEXT,
    analogy TEXT,
    common_misconception TEXT,
    curiosity_question TEXT,
    ethics_impact TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE generated_content DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. LIVE SESSIONS  (professor starts one per presentation)
-- ============================================================
CREATE TABLE live_sessions (
    id TEXT PRIMARY KEY,                            -- 6-char alphanumeric session code
    course_id TEXT REFERENCES courses(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'ended')),
    current_slide INTEGER DEFAULT 1,
    total_slides INTEGER DEFAULT 0,
    slide_data JSONB,                               -- AI-generated bullets/questions per slide
    pdf_text JSONB,                                 -- extracted text per slide [{page:1,text:"..."},...]
    created_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);

ALTER TABLE live_sessions DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- 5. SLIDE FEEDBACK  (student responses per slide)
-- ============================================================
CREATE TABLE slide_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT REFERENCES live_sessions(id) ON DELETE CASCADE,
    slide_number INTEGER NOT NULL,
    student_id TEXT NOT NULL,                        -- enrollment number entered by student
    response_type TEXT NOT NULL
        CHECK (response_type IN ('like', 'dislike', 'question')),
    response_text TEXT,                              -- custom text when type = question/dislike
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE slide_feedback DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6. Indexes for performance
-- ============================================================
CREATE INDEX idx_generated_content_course ON generated_content(course_id);
CREATE INDEX idx_live_sessions_status ON live_sessions(status);
CREATE INDEX idx_slide_feedback_session ON slide_feedback(session_id);
CREATE INDEX idx_slide_feedback_slide ON slide_feedback(session_id, slide_number);
