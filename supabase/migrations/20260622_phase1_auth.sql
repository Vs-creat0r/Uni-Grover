    -- ============================================================
    -- Uni-Grover — Phase 1 Schema Additions
    -- Run this in your Supabase SQL Editor AFTER the v2 schema.
    -- Adds: profiles, enrollments tables for auth & real data.
    -- ============================================================

    -- 1. PROFILES (linked to Supabase Auth users)
    CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        full_name TEXT,
        role TEXT NOT NULL CHECK (role IN ('professor', 'student')),
        created_at TIMESTAMPTZ DEFAULT NOW()
    );

    ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

    -- Auto-create profile on signup via trigger
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
        INSERT INTO public.profiles (id, full_name, role)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
            COALESCE(NEW.raw_user_meta_data->>'role', 'student')
        );
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Drop trigger if exists, then create
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

    -- 2. ENROLLMENTS (student joins a course)
    CREATE TABLE IF NOT EXISTS enrollments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        enrolled_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(student_id, course_id)
    );

    ALTER TABLE enrollments DISABLE ROW LEVEL SECURITY;

    -- 3. Add professor_id to courses (so each professor owns their courses)
    ALTER TABLE courses ADD COLUMN IF NOT EXISTS professor_id UUID REFERENCES profiles(id);

    -- 4. Indexes
    CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
    CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
    CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
    CREATE INDEX IF NOT EXISTS idx_courses_professor ON courses(professor_id);
