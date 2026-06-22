"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookOpen, GraduationCap, PartyPopper, ArrowRight, Loader, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth-provider";

type CourseInfo = {
  id: string;
  title: string;
  description: string;
};

export default function JoinCoursePage() {
  const params = useParams();
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const joinCode = params.code as string;

  const [course, setCourse] = useState<CourseInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState("");
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);

  // Fetch course by join code
  useEffect(() => {
    const fetchCourse = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title, description")
        .eq("join_code", joinCode.toUpperCase())
        .single();

      if (error || !data) {
        setError("Invalid join code. This course does not exist.");
      } else {
        setCourse(data as CourseInfo);

        // Check if already enrolled
        if (user) {
          const { data: existing } = await supabase
            .from("enrollments")
            .select("id")
            .eq("student_id", user.id)
            .eq("course_id", data.id)
            .single();
          if (existing) setAlreadyEnrolled(true);
        }
      }
      setLoading(false);
    };

    if (!authLoading) {
      fetchCourse();
    }
  }, [joinCode, authLoading, user]);

  const handleJoin = async () => {
    if (!user) {
      router.push(`/auth/signup?redirect=/join/${joinCode}`);
      return;
    }

    if (!course) return;
    setJoining(true);

    try {
      // Insert enrollment
      const { error: enrollError } = await supabase
        .from("enrollments")
        .insert([{ student_id: user.id, course_id: course.id }]);

      if (enrollError) {
        if (enrollError.code === "23505") {
          // Unique violation — already enrolled
          setAlreadyEnrolled(true);
          setJoined(true);
        } else {
          throw enrollError;
        }
      } else {
        // Increment student count on the course
        try {
          const { data: courseData } = await supabase
            .from("courses")
            .select("students")
            .eq("id", course.id)
            .single();
          if (courseData) {
            await supabase
              .from("courses")
              .update({ students: (courseData.students || 0) + 1 })
              .eq("id", course.id);
          }
        } catch {
          // Non-critical — student count update failure is OK
        }
        setJoined(true);
      }
    } catch (err) {
      console.error("Join error:", err);
      setError("Failed to join course. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-secondary)" }}>
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: "var(--accent)" }} />
          <p style={{ color: "var(--text-muted)" }}>Loading course...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="card animate-fade-in w-full text-center" style={{ maxWidth: 420, padding: 40 }}>
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div
            className="flex items-center justify-center rounded-lg font-bold text-white text-xl"
            style={{ width: 44, height: 44, background: "var(--accent)", borderRadius: "var(--radius-sm)" }}
          >
            U
          </div>
          <span className="font-semibold text-xl" style={{ color: "var(--text-primary)" }}>
            Uni-Grover
          </span>
        </div>

        {error ? (
          <>
            <span className="flex items-center justify-center mb-4" style={{ color: "var(--error)" }}>
              <AlertCircle className="w-12 h-12" />
            </span>
            <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--error)" }}>
              Invalid Link
            </h1>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>{error}</p>
            <a
              href="/"
              className="btn btn-secondary w-full"
              style={{ height: 48, fontSize: 15, textDecoration: "none" }}
            >
              Go to Home
            </a>
          </>
        ) : !joined ? (
          <>
            <span className="flex items-center justify-center mb-4 text-[var(--accent)]">
              <BookOpen className="w-12 h-12" />
            </span>
            <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              You&apos;ve been invited!
            </h1>
            <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
              Join <strong style={{ color: "var(--text-primary)" }}>{course?.title}</strong>
            </p>
            {course?.description && (
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                {course.description}
              </p>
            )}

            {alreadyEnrolled ? (
              <>
                <div className="p-3 rounded-lg mb-4" style={{ background: "rgba(34,197,94,0.1)", color: "var(--success)" }}>
                  ✅ You&apos;re already enrolled in this course!
                </div>
                <a
                  href="/student"
                  className="btn btn-primary w-full"
                  style={{ height: 48, fontSize: 15, textDecoration: "none" }}
                >
                  Go to My Dashboard <ArrowRight className="w-4 h-4 ml-2 inline" />
                </a>
              </>
            ) : (
              <>
                <button
                  className="btn btn-primary w-full"
                  style={{ height: 48, fontSize: 15, opacity: joining ? 0.6 : 1 }}
                  onClick={handleJoin}
                  disabled={joining}
                >
                  {joining ? (
                    <><Loader className="w-4 h-4 mr-2 inline animate-spin" /> Joining...</>
                  ) : (
                    <><GraduationCap className="w-4 h-4 mr-2 inline" /> Join This Course</>
                  )}
                </button>
                {!user && (
                  <p className="text-xs mt-4" style={{ color: "var(--text-muted)" }}>
                    You&apos;ll need a Uni-Grover account to join.{" "}
                    <a href={`/auth/signup?redirect=/join/${joinCode}`} style={{ color: "var(--accent)" }}>
                      Sign up free
                    </a>
                  </p>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <span className="flex items-center justify-center mb-4 text-[var(--success)]">
              <PartyPopper className="w-12 h-12" />
            </span>
            <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--success)" }}>
              You&apos;re in!
            </h1>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              You&apos;ve successfully joined <strong>{course?.title}</strong>.
            </p>
            <a
              href="/student"
              className="btn btn-primary w-full"
              style={{ height: 48, fontSize: 15, textDecoration: "none" }}
            >
              Go to My Dashboard <ArrowRight className="w-4 h-4 ml-2 inline" />
            </a>
          </>
        )}
      </div>
    </div>
  );
}
