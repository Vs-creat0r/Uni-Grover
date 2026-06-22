"use client";

import Link from "next/link";
import { useState, use, useEffect } from "react";
import {
  BookOpen,
  Check,
  Copy,
  Sparkles,
  Users,
  Loader,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Topic = {
  id: string;
  topic: string;
  hook: string;
  created_at: string;
};

type CourseDetail = {
  id: string;
  title: string;
  description: string;
  join_code: string;
  students: number;
  topics: Topic[];
};

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [copied, setCopied] = useState(false);
  const resolvedParams = use(params);
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseDetails();
  }, [resolvedParams.id]);

  const fetchCourseDetails = async () => {
    try {
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", resolvedParams.id)
        .single();

      if (courseError) throw courseError;

      const { data: topicsData, error: topicsError } = await supabase
        .from("generated_content")
        .select("id, topic, hook, created_at")
        .eq("course_id", resolvedParams.id)
        .order("created_at", { ascending: false });

      if (topicsError) throw topicsError;

      if (courseData) {
        setCourse({
          ...courseData,
          topics: topicsData || [],
        } as CourseDetail);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyJoinCode = async () => {
    if (!course) return;
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/join/${course.join_code}`);
    } finally {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div className="text-sm" style={{ color: "var(--text-muted)" }}>
          <Link href="/dashboard/courses" className="hover:underline" style={{ color: "var(--accent)" }}>
            ← Courses
          </Link>
          <span className="mx-2">/</span>
          <span style={{ color: "var(--text-secondary)" }}>Not Found</span>
        </div>
        <section className="card">
          <h1 className="text-2xl font-bold mb-2">Course Not Found</h1>
          <p>The requested course could not be found. Return to your course list and choose another course.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="text-sm" style={{ color: "var(--text-muted)" }}>
        <Link href="/dashboard/courses" className="hover:underline" style={{ color: "var(--accent)" }}>
          ← Courses
        </Link>
        <span className="mx-2">/</span>
        <span style={{ color: "var(--text-secondary)" }}>{course.title}</span>
      </div>

      <section className="card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg" style={{ background: "var(--accent-light)" }}>
              <BookOpen className="h-6 w-6" style={{ color: "var(--accent)" }} />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              {course.title}
            </h1>
            <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              {course.description}
            </p>
          </div>

          <Link
            href={`/dashboard/generate?courseId=${course.id}`}
            className="btn btn-primary"
          >
            <Sparkles className="h-4 w-4" />
            Generate Content for This Course
          </Link>
        </div>

        <div
          className="mt-5 grid gap-4 rounded-lg p-4 md:grid-cols-3"
          style={{ background: "var(--bg-secondary)" }}
        >
          <div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              Join code
            </div>
            <div className="mt-1 flex items-center gap-2">
              <code className="font-semibold" style={{ color: "var(--accent)" }}>
                {course.join_code}
              </code>
              <button
                type="button"
                className="btn-ghost rounded-md px-2 py-1 text-xs"
                onClick={() => void copyJoinCode()}
              >
                {copied ? (
                  <span className="inline-flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Copied
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1">
                    <Copy className="h-3 w-3" />
                    Copy
                  </span>
                )}
              </button>
            </div>
          </div>

          <div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              Enrolled students
            </div>
            <div className="mt-1 flex items-center gap-2 text-lg font-bold" style={{ color: "var(--text-primary)" }}>
              <Users className="h-5 w-5" />
              {course.students}
            </div>
          </div>

          <div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              Generated topics
            </div>
            <div className="mt-1 text-lg font-bold" style={{ color: "var(--text-primary)" }}>
              {course.topics.length}
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5" style={{ color: "var(--accent)" }} />
          <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            Topics Generated for This Course
          </h2>
        </div>

        {course.topics.length === 0 ? (
          <div className="rounded-lg p-4 text-sm" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
            No topics have been generated yet. Use the course generation link to create the first topic.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {course.topics.map((topic) => (
              <article
                key={topic.id}
                className="rounded-lg p-4"
                style={{ background: "var(--bg-secondary)" }}
              >
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {topic.topic}
                </h3>
                <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                  {topic.hook}
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  {new Date(topic.created_at).toLocaleDateString()}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
