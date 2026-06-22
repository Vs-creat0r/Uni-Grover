"use client";

import Link from "next/link";
import { useState, use, useEffect } from "react";
import {
  Target, Globe, BookOpen, Lightbulb, AlertTriangle, HelpCircle, Scale,
  Crosshair, Loader, ArrowLeft, ChevronDown, ChevronUp, RefreshCw, BarChart, Printer
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ContentDetail {
  id: string;
  topic: string;
  audience: string;
  hook: string;
  why_this_matters: string;
  real_world_examples: string[];
  core_explanation: string;
  analogy: string;
  common_misconception: string;
  curiosity_question: string;
  ethics_impact: string | Record<string, string> | null;
  created_at: string;
  courses: { id: string; title: string } | null;
}

interface RelatedContent {
  id: string;
  topic: string;
  audience: string;
}

const SECTIONS = [
  { id: "hook", label: "Hook", icon: "🎯" },
  { id: "why", label: "Why It Matters", icon: "🎯" },
  { id: "analogy", label: "Analogy", icon: "💡" },
  { id: "misconception", label: "Misconception", icon: "⚠️" },
  { id: "core", label: "Core Explanation", icon: "📖" },
  { id: "examples", label: "Examples", icon: "🌍" },
  { id: "curiosity", label: "Debate", icon: "❓" },
  { id: "ethics", label: "Ethics", icon: "⚖️" },
];

export default function LibraryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [content, setContent] = useState<ContentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [coreExpanded, setCoreExpanded] = useState(false);
  const [ethicsExpanded, setEthicsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState("hook");
  const [related, setRelated] = useState<RelatedContent[]>([]);

  useEffect(() => {
    fetchContent();
  }, [resolvedParams.id]);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from("generated_content")
        .select(`*, courses (id, title)`)
        .eq("id", resolvedParams.id)
        .single();

      if (error) throw error;
      if (data) {
        setContent(data as unknown as ContentDetail);
        // Fetch related content from the same course
        if (data.course_id) {
          const { data: relatedData } = await supabase
            .from("generated_content")
            .select("id, topic, audience")
            .eq("course_id", data.course_id)
            .neq("id", resolvedParams.id)
            .limit(4);
          if (relatedData) setRelated(relatedData as RelatedContent[]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch content:", err);
    } finally {
      setLoading(false);
    }
  };

  // Scroll spy for section nav
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id.replace("section-", ""));
          }
        });
      },
      { rootMargin: "-100px 0px -60% 0px" }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(`section-${s.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [content]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <Link href="/dashboard/library" className="text-sm hover:underline" style={{ color: "var(--accent)" }}>
          ← Back to Library
        </Link>
        <div className="card">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Content Not Found</h1>
          <p style={{ color: "var(--text-secondary)" }}>This content may have been deleted.</p>
        </div>
      </div>
    );
  }

  const ethicsText = content.ethics_impact
    ? typeof content.ethics_impact === "string"
      ? content.ethics_impact
      : Object.entries(content.ethics_impact).map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`).join("\n\n")
    : null;

  // TL;DR: Hook + first sentence of core explanation
  const firstSentence = content.core_explanation?.split(/\.\s/)?.[0] + ".";
  const tldr = `${content.hook?.split(/\.\s/)?.[0]}. ${firstSentence}`;

  return (
    <div className="flex flex-col gap-0 animate-fade-in max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-4">
        <Link href="/dashboard/library" className="hover:underline flex items-center gap-1" style={{ color: "var(--accent)" }}>
          <ArrowLeft className="w-4 h-4" /> Content Library
        </Link>
        <span style={{ color: "var(--text-muted)" }}>/</span>
        <span style={{ color: "var(--text-secondary)" }}>{content.topic}</span>
      </div>

      {/* Header Card */}
      <div className="card mb-4">
        <h1 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>{content.topic}</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full capitalize"
            style={{
              background: content.audience === "beginner" ? "var(--success)" : content.audience === "advanced" ? "var(--error)" : "var(--accent)",
              color: "white",
            }}
          >
            {content.audience}
          </span>
          {content.courses && (
            <Link href={`/dashboard/courses/${content.courses.id}`} className="text-sm hover:underline" style={{ color: "var(--accent)" }}>
              {content.courses.title}
            </Link>
          )}
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {new Date(content.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <Link href={`/dashboard/generate?courseId=${content.courses?.id || ""}`} className="btn btn-secondary flex items-center gap-2 text-xs">
            <RefreshCw className="w-3 h-3" /> Explain Differently
          </Link>
          <Link href={`/dashboard/generate?courseId=${content.courses?.id || ""}`} className="btn btn-secondary flex items-center gap-2 text-xs">
            <BarChart className="w-3 h-3" /> Generate Quiz
          </Link>
          <button className="btn btn-ghost flex items-center gap-2 text-xs" onClick={() => window.print()}>
            <Printer className="w-3 h-3" /> Print
          </button>
        </div>
      </div>

      {/* TL;DR Banner */}
      <div className="tldr-banner mb-4">
        <span style={{ fontSize: 16 }}>⚡</span>
        <div>
          <p className="text-xs font-semibold mb-1" style={{ color: "var(--accent)" }}>TL;DR</p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>{tldr}</p>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="section-nav">
        {SECTIONS.filter((s) => s.id !== "ethics" || ethicsText).map((s) => (
          <a
            key={s.id}
            href={`#section-${s.id}`}
            className={`section-nav-pill ${activeSection === s.id ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            {s.icon} {s.label}
          </a>
        ))}
      </div>

      {/* === 2-Column Grid: Short sections === */}
      <div className="content-grid" style={{ marginTop: 12 }}>
        {/* Hook */}
        <div id="section-hook" className="content-card content-card--hook">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4" style={{ color: "var(--accent)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--accent)" }}>Hook</h3>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>{content.hook}</p>
        </div>

        {/* Why This Matters */}
        <div id="section-why" className="content-card content-card--why">
          <div className="flex items-center gap-2 mb-2">
            <Crosshair className="w-4 h-4" style={{ color: "var(--success)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--success)" }}>Why This Matters</h3>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>{content.why_this_matters}</p>
        </div>

        {/* Analogy (ELI5) */}
        <div id="section-analogy" className="content-card content-card--analogy">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4" style={{ color: "var(--warning)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--warning)" }}>Explain Like I&apos;m 5</h3>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>{content.analogy}</p>
        </div>

        {/* Common Misconception */}
        <div id="section-misconception" className="content-card content-card--misconception">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" style={{ color: "var(--error)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--error)" }}>Common Misconception</h3>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>{content.common_misconception}</p>
        </div>
      </div>

      {/* === Full Width: Core Explanation (Collapsible) === */}
      <div id="section-core" className="content-card content-card--core" style={{ marginTop: 16 }}>
        <button className="collapsible-trigger" onClick={() => setCoreExpanded(!coreExpanded)}>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" style={{ color: "var(--accent)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--accent)" }}>Core Explanation</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {coreExpanded ? "Collapse" : "Read full explanation"}
            </span>
            {coreExpanded ? <ChevronUp className="w-4 h-4" style={{ color: "var(--text-muted)" }} /> : <ChevronDown className="w-4 h-4" style={{ color: "var(--text-muted)" }} />}
          </div>
        </button>

        {/* Preview (2 lines) */}
        <p
          className={`collapsible-preview text-sm mt-3 ${coreExpanded ? "hidden" : ""}`}
          style={{ color: "var(--text-primary)" }}
        >
          {content.core_explanation}
        </p>

        {/* Full content */}
        <div className={`collapsible-content ${coreExpanded ? "expanded" : ""}`}>
          <p className="text-sm leading-relaxed mt-3" style={{ color: "var(--text-primary)", whiteSpace: "pre-line" }}>
            {content.core_explanation}
          </p>
        </div>
      </div>

      {/* === Full Width: Real-World Examples (Pill Chips) === */}
      {content.real_world_examples && Array.isArray(content.real_world_examples) && content.real_world_examples.length > 0 && (
        <div id="section-examples" className="content-card content-card--examples" style={{ marginTop: 16 }}>
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4" style={{ color: "#14b8a6" }} />
            <h3 className="text-sm font-semibold" style={{ color: "#14b8a6" }}>Real-World Examples</h3>
          </div>
          <div className="flex flex-col gap-2">
            {content.real_world_examples.map((ex, i) => (
              <div key={i} className="pill-chip">
                <span className="pill-chip-number">{i + 1}</span>
                <span>{ex}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === Full Width: Curiosity Question (Quote Block) === */}
      <div id="section-curiosity" className="quote-block" style={{ marginTop: 16 }}>
        <div className="flex items-center gap-2 mb-2" style={{ fontStyle: "normal" }}>
          <HelpCircle className="w-4 h-4" style={{ color: "#3b82f6" }} />
          <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#3b82f6" }}>Curiosity Question — For Class Debate</h3>
        </div>
        <p style={{ paddingLeft: 12 }}>{content.curiosity_question}</p>
      </div>

      {/* === Full Width: Ethics (Collapsible) === */}
      {ethicsText && (
        <div id="section-ethics" className="content-card content-card--ethics" style={{ marginTop: 16 }}>
          <button className="collapsible-trigger" onClick={() => setEthicsExpanded(!ethicsExpanded)}>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4" style={{ color: "#a855f7" }} />
              <h3 className="text-sm font-semibold" style={{ color: "#a855f7" }}>Ethics & Societal Impact</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {ethicsExpanded ? "Collapse" : "Read more"}
              </span>
              {ethicsExpanded ? <ChevronUp className="w-4 h-4" style={{ color: "var(--text-muted)" }} /> : <ChevronDown className="w-4 h-4" style={{ color: "var(--text-muted)" }} />}
            </div>
          </button>

          <p className={`collapsible-preview text-sm mt-3 ${ethicsExpanded ? "hidden" : ""}`} style={{ color: "var(--text-primary)" }}>
            {ethicsText}
          </p>

          <div className={`collapsible-content ${ethicsExpanded ? "expanded" : ""}`}>
            <p className="text-sm leading-relaxed mt-3" style={{ color: "var(--text-primary)", whiteSpace: "pre-line" }}>
              {ethicsText}
            </p>
          </div>
        </div>
      )}

      {/* === Related Content === */}
      {related.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
            Other topics in this course
          </h3>
          <div className="content-grid">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/dashboard/library/${r.id}`}
                className="content-card"
                style={{ textDecoration: "none" }}
              >
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{r.topic}</p>
                <span
                  className="text-xs mt-2 inline-block px-2 py-0.5 rounded-full capitalize"
                  style={{
                    background: r.audience === "beginner" ? "var(--success)" : r.audience === "advanced" ? "var(--error)" : "var(--accent)",
                    color: "white",
                  }}
                >
                  {r.audience}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bottom spacing */}
      <div style={{ height: 40 }} />
    </div>
  );
}
