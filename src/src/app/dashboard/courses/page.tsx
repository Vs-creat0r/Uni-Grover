"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  BookOpen,
  Check,
  Copy,
  Sparkles,
  Users,
  X,
  Loader,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth-provider";

type Course = {
  id: string;
  title: string;
  description: string;
  students: number;
  join_code: string;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchCourses();
  }, [user]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      if (data) setCourses(data as Course[]);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyJoinCode = async (course: Course) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/join/${course.join_code}`);
      setCopiedCode(course.id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      setCopiedCode(course.id);
    }
  };

  const createCourse = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsCreating(true);
    
    const newCourse = {
      id: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: newTitle,
      description: newDescription,
      students: 0,
      join_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      professor_id: user?.id,
    };
    
    try {
      const { error } = await supabase.from("courses").insert([newCourse]);
      if (error) throw error;
      
      setCourses([newCourse as Course, ...courses]);
      setIsModalOpen(false);
      setNewTitle("");
      setNewDescription("");
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Courses
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            Manage your Uni-Grover courses, share join codes, and start generating lesson content.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <Sparkles className="h-4 w-4" />
          Create New Course
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {courses.map((course, index) => (
          <article
            key={course.id}
            className="card flex flex-col"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-lg"
                style={{ background: "var(--accent-light)" }}
              >
                <BookOpen className="h-5 w-5" style={{ color: "var(--accent)" }} />
              </div>
              <span
                className="rounded-full px-2 py-1 text-xs font-medium"
                style={{ background: "var(--accent-light)", color: "var(--accent)" }}
              >
                Active
              </span>
            </div>

            <h2 className="mb-2 text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              {course.title}
            </h2>
            <p className="mb-4 text-sm" style={{ color: "var(--text-secondary)", flexGrow: 1 }}>
              {course.description}
            </p>

            <div className="mb-4 flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              <Users className="h-4 w-4" />
              <span style={{ color: "var(--text-primary)" }}>{course.students}</span>
              students enrolled
            </div>

            <div
              className="mb-4 rounded-lg p-3"
              style={{ background: "var(--bg-secondary)" }}
            >
              <div className="mb-1 text-xs" style={{ color: "var(--text-muted)" }}>
                Join code
              </div>
              <div className="flex items-center justify-between gap-2">
                <code className="font-semibold" style={{ color: "var(--accent)" }}>
                  {course.join_code}
                </code>
                <button
                  type="button"
                  className="btn-ghost inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs"
                  onClick={() => void copyJoinCode(course)}
                >
                  {copiedCode === course.id ? (
                    <>
                      <Check className="h-3 w-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            <Link
              href={`/dashboard/courses/${course.id}`}
              className="btn btn-secondary w-full"
            >
              Open Course Detail
            </Link>
          </article>
        ))}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "var(--bg-primary)", opacity: 0.96 }}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsModalOpen(false);
            }
          }}
        >
          <div
            className="card w-full max-w-lg animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-course-title"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="create-course-title"
                  className="text-xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Create New Course
                </h2>
                <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                  Add a mock course to your Uni-Grover dashboard.
                </p>
              </div>
              <button
                type="button"
                className="btn-ghost rounded-md p-2"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close create course form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form className="flex flex-col gap-4" onSubmit={createCourse}>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  Course title
                </span>
                <input
                  className="input"
                  value={newTitle}
                  onChange={(event) => setNewTitle(event.target.value)}
                  placeholder="Example: BIO-101: Cell Biology"
                  required
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  Description
                </span>
                <textarea
                  className="input"
                  value={newDescription}
                  onChange={(event) => setNewDescription(event.target.value)}
                  placeholder="What will students learn in this course?"
                  rows={4}
                  required
                />
              </label>

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isCreating}>
                  {isCreating ? <><Loader className="w-4 h-4 mr-2 animate-spin inline" /> Creating...</> : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
