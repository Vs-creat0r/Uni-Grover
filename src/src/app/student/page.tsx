"use client";

import { GraduationCap, Flame, BookOpen, CheckCircle, Award, HelpCircle, Hammer, Star, Check, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { supabase } from "@/lib/supabase";

type EnrolledCourse = {
  id: string;
  course_id: string;
  courses: {
    id: string;
    title: string;
    description: string;
    professor_id: string;
  };
};

const BADGES = [
  { icon: <Flame className="w-5 h-5 text-orange-500 fill-current" />, label: "5-Day Streak", earned: true },
  { icon: <HelpCircle className="w-5 h-5 text-blue-500" />, label: "Curious Mind", earned: true, desc: "Asked 10 questions" },
  { icon: <Hammer className="w-5 h-5 text-gray-500" />, label: "Builder", earned: true, desc: "Completed 3 projects" },
  { icon: <Star className="w-5 h-5 text-yellow-500 fill-current" />, label: "Explorer", earned: false, desc: "Study 5 topics beyond syllabus" },
];

const DID_YOU_KNOW = "The first computer programmer was Ada Lovelace, who wrote the first algorithm intended for processing on a machine in 1843 — nearly 100 years before the first digital computer was built!";

export default function StudentDashboard() {
  const { user, profile } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchEnrollments = async () => {
      try {
        const { data, error } = await supabase
          .from("enrollments")
          .select(`
            id,
            course_id,
            courses (
              id,
              title,
              description,
              professor_id
            )
          `)
          .eq("student_id", user.id)
          .order("enrolled_at", { ascending: false });

        if (error) throw error;
        setEnrolledCourses((data as any) || []);
      } catch (err) {
        console.error("Error fetching enrollments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 animate-spin text-[var(--success)]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          Welcome back, {profile?.full_name?.split(" ")[0] || "Student"} <GraduationCap className="w-6 h-6 text-[var(--accent)]" />
        </h2>
        <p style={{ color: "var(--text-secondary)", marginTop: 4 }}>
          Keep the streak alive! Here&apos;s what&apos;s waiting for you today.
        </p>
      </div>

      {/* Streak + Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card flex items-center gap-3">
          <Flame className="w-8 h-8 text-orange-500 fill-current" />
          <div>
            <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>5</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Day Streak</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-[var(--accent)]" />
          <div>
            <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{enrolledCourses.length}</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Courses Enrolled</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <CheckCircle className="w-8 h-8 text-[var(--success)]" />
          <div>
            <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>14</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Topics Completed</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enrolled Courses */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="text-base font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <BookOpen className="w-5 h-5 text-[var(--accent)]" /> My Courses
          </h3>
          
          {enrolledCourses.length === 0 ? (
            <div className="card text-center p-8">
              <BookOpen className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                You haven&apos;t enrolled in any courses yet.
              </p>
              <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                Ask your professor for a course join link!
              </p>
            </div>
          ) : (
            enrolledCourses.map((e) => (
              <a
                key={e.id}
                href={`/student/course/${e.courses.id}`}
                className="card flex items-center gap-4"
                style={{ textDecoration: "none", cursor: "pointer" }}
              >
                <div
                  className="flex items-center justify-center text-xl"
                  style={{ width: 48, height: 48, background: "var(--accent-light)", borderRadius: "var(--radius-sm)", flexShrink: 0 }}
                >
                  <BookOpen className="w-6 h-6 text-[var(--accent)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{e.courses.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-2 rounded-full" style={{ background: "var(--bg-input)" }}>
                      <div
                        className="h-2 rounded-full"
                        style={{ width: "0%", background: "var(--success)", transition: "width 500ms ease" }}
                      />
                    </div>
                    <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>0%</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Next up</p>
                  <p className="text-xs font-medium" style={{ color: "var(--accent)" }}>Start learning</p>
                </div>
              </a>
            ))
          )}
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Did You Know */}
          <div className="nudge-card">
            <div style={{ flex: 1 }}>
              <p className="font-semibold text-xs mb-1">Did You Know?</p>
              {DID_YOU_KNOW}
            </div>
          </div>

          {/* Badges */}
          <div className="card">
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Award className="w-5 h-5 text-yellow-500" /> Achievements
            </h3>
            <div className="flex flex-col gap-2">
              {BADGES.map((b, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 rounded-lg"
                  style={{ background: "var(--bg-secondary)", opacity: b.earned ? 1 : 0.4 }}
                >
                  <span className="flex items-center justify-center w-8 h-8">{b.icon}</span>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{b.label}</p>
                    {b.desc && <p className="text-xs" style={{ color: "var(--text-muted)" }}>{b.desc}</p>}
                  </div>
                  {b.earned && <span className="ml-auto text-xs flex items-center gap-1" style={{ color: "var(--success)" }}><Check className="w-3 h-3" /> Earned</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
