-- Initial Supabase Schema for Uni-Grover
-- Covers core users, courses, content generation, and the Nudge Engine

-- 1. Custom Enums
CREATE TYPE user_role AS ENUM ('professor', 'student', 'admin');
CREATE TYPE nudge_category AS ENUM ('behavior', 'content_creation', 'live_session', 'general');

-- 2. Profiles Table (extends Supabase Auth)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Courses Table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professor_id UUID REFERENCES profiles(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    join_code TEXT UNIQUE, -- For students to join via QR/link
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Course Enrollments (Students -> Courses)
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES profiles(id) NOT NULL,
    course_id UUID REFERENCES courses(id) NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, course_id)
);

-- 5. Topics/Lessons Table (AI Generated Content)
CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) NOT NULL,
    title TEXT NOT NULL,
    content_json JSONB NOT NULL, -- The structured output from the LLM
    difficulty_level TEXT DEFAULT 'intermediate',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. The Nudge Library
CREATE TABLE nudges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    category nudge_category NOT NULL,
    trigger_context TEXT NOT NULL, -- e.g., 'dashboard', 'pre_generation'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Nudge History (Tracking what professors have seen to prevent spam)
CREATE TABLE nudge_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professor_id UUID REFERENCES profiles(id) NOT NULL,
    nudge_id UUID REFERENCES nudges(id) NOT NULL,
    shown_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    was_dismissed BOOLEAN DEFAULT FALSE,
    action_taken BOOLEAN DEFAULT FALSE -- Did they click/follow the nudge?
);

-- 8. Anonymous Questions (Student Feature)
CREATE TABLE live_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES topics(id) NOT NULL,
    question_text TEXT NOT NULL,
    is_answered BOOLEAN DEFAULT FALSE,
    upvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) policies should be added here later.
