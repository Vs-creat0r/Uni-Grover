"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Folder, Sparkles, ChevronRight, Search, Loader } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Course = {
  id: string;
  title: string;
};

type GeneratedContent = {
  id: string;
  topic: string;
  course_id: string;
  created_at: string;
  audience: string;
  courses: Course; // joined data
};

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState<GeneratedContent[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetchLibraryData();
  }, []);

  const fetchLibraryData = async () => {
    try {
      // Fetch all courses for the filter
      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select("id, title")
        .order("title");
      if (coursesError) throw coursesError;
      if (coursesData) setCourses(coursesData as Course[]);

      // Fetch all generated content with joined course title
      const { data: topicsData, error: topicsError } = await supabase
        .from("generated_content")
        .select(`
          id,
          topic,
          course_id,
          created_at,
          audience,
          courses (
            id,
            title
          )
        `)
        .order("created_at", { ascending: false });
      
      if (topicsError) throw topicsError;
      
      if (topicsData) {
        setTopics(topicsData as unknown as GeneratedContent[]);
      }
    } catch (err) {
      console.error("Failed to fetch library data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = topics.filter((t) => {
    const matchesSearch = t.topic.toLowerCase().includes(search.toLowerCase());
    const matchesCourse = courseFilter === "All Courses" || t.course_id === courseFilter;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <Folder className="w-6 h-6 text-[var(--accent)]" /> Content Library
        </h2>
        <p style={{ color: "var(--text-secondary)", marginTop: 4 }}>
          Browse, search, and re-use all your previously generated lesson materials.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          className="input flex-1 max-w-[400px]"
          placeholder="Search topics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input max-w-[280px]"
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          style={{ cursor: "pointer" }}
        >
          <option value="All Courses">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        <div style={{ flex: 1 }} />
        <a href="/dashboard/generate" className="btn btn-primary flex items-center gap-2" style={{ whiteSpace: "nowrap" }}>
          <Sparkles className="w-4 h-4" /> Generate New
        </a>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader className="w-8 h-8 animate-spin text-[var(--accent)]" />
        </div>
      ) : (
        <>
          {/* Results Count */}
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Showing {filtered.length} of {topics.length} topics
          </p>

          {/* Topic Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((topic, i) => (
                <Link
                  key={topic.id}
                  href={`/dashboard/library/${topic.id}`}
                  className="card cursor-pointer"
                  style={{ animationDelay: `${i * 50}ms`, textDecoration: "none" }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className="text-xs font-medium px-2 py-1 rounded-full capitalize"
                      style={{
                        background: topic.audience === "beginner"
                          ? "var(--success)"
                          : topic.audience === "advanced"
                          ? "var(--error)"
                          : "var(--accent)",
                        color: "white",
                        opacity: 0.9,
                      }}
                    >
                      {topic.audience}
                    </span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {new Date(topic.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                    {topic.topic}
                  </h4>
                  <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                    {topic.courses?.title || 'Unknown Course'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs px-2 py-1 rounded"
                      style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}
                    >
                      Documentation
                    </span>
                    <button className="btn-ghost flex items-center gap-1" style={{ fontSize: 12, padding: "4px 8px" }}>
                      View <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div
              className="card flex flex-col items-center justify-center py-12"
              style={{ textAlign: "center" }}
            >
              <Search className="w-10 h-10 mb-3 text-[var(--text-muted)]" />
              <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                No topics found
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Try adjusting your search or filter, or generate new content.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
