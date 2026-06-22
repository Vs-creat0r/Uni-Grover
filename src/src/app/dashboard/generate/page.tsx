"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Sparkles, Loader, XCircle, Target, Globe, BookOpen, Lightbulb,
  AlertTriangle, HelpCircle, Scale, CheckCircle, RefreshCw, BarChart,
  Crosshair, ChevronRight
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface GeneratedContent {
  hook: string;
  why_this_matters: string;
  real_world_examples: string[];
  core_explanation: string;
  analogy: string;
  common_misconception: string;
  curiosity_question: string;
  ethics_impact?: string | Record<string, string>;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

interface Course {
  id: string;
  title: string;
}

function GenerateForm() {
  const searchParams = useSearchParams();
  const initialCourseId = searchParams.get("courseId");

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourseId || "");
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("intermediate");
  const [includeEthics, setIncludeEthics] = useState(false);
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Quiz state
  const [quizLoading, setQuizLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title")
        .order("title");
      if (error) throw error;
      if (data) setCourses(data as Course[]);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  const handleGenerate = async (regenerate = false) => {
    if (!topic.trim() || !selectedCourseId) return;
    if (regenerate) setRegenerating(true);
    else setLoading(true);
    setError(null);
    if (!regenerate) { setResult(null); setQuiz(null); setShowAnswers(false); setSelectedAnswers({}); }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, audience, includeEthics, courseId: selectedCourseId, regenerate }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate content");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!result || !topic) return;
    setQuizLoading(true);
    setQuiz(null);
    setShowAnswers(false);
    setSelectedAnswers({});

    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, content: result }),
      });

      if (!res.ok) throw new Error("Failed to generate quiz");

      const data = await res.json();
      setQuiz(data.questions || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Quiz generation failed");
    } finally {
      setQuizLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-4xl">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <Sparkles className="w-6 h-6 text-[var(--accent)]" /> Generate Content
        </h2>
        <p style={{ color: "var(--text-secondary)", marginTop: 4 }}>
          Enter a topic and let AI create a structured, curiosity-driven lesson plan.
        </p>
      </div>

      {/* Input Form */}
      <div className="card">
        <div className="flex flex-col gap-4">
          {/* Course Selector */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>
              Select Course
            </label>
            <select className="input w-full" value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)}>
              <option value="" disabled>Select a course for this content</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
          </div>

          {/* Topic Input */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Topic</label>
            <input
              type="text"
              className="input w-full"
              placeholder="e.g., Linked Lists, Database Normalization, Neural Networks..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            />
          </div>

          {/* Audience Selector */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Target Audience</label>
            <div className="flex gap-2">
              {["beginner", "intermediate", "advanced"].map((level) => (
                <button
                  key={level}
                  onClick={() => setAudience(level)}
                  className={`btn ${audience === level ? "btn-primary" : "btn-secondary"}`}
                  style={{ textTransform: "capitalize" }}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Ethics Toggle */}
          <div className="flex items-center gap-3">
            <div className={`toggle-switch ${includeEthics ? "active" : ""}`} onClick={() => setIncludeEthics(!includeEthics)} />
            <label className="text-sm font-medium cursor-pointer" style={{ color: "var(--text-primary)" }} onClick={() => setIncludeEthics(!includeEthics)}>
              Include Ethics & Societal Impact Section
            </label>
          </div>

          {/* Generate Button */}
          <button
            onClick={() => handleGenerate(false)}
            disabled={loading || !topic.trim() || !selectedCourseId}
            className="btn btn-primary"
            style={{
              opacity: loading || !topic.trim() || !selectedCourseId ? 0.6 : 1,
              cursor: loading || !topic.trim() || !selectedCourseId ? "not-allowed" : "pointer",
              height: 48, fontSize: 15,
            }}
          >
            {loading ? <><Loader className="w-4 h-4 mr-2 inline animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4 mr-2 inline" /> Generate Lesson Content</>}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="card animate-fade-in" style={{ background: "var(--error)", color: "white", borderColor: "var(--error)" }}>
          <XCircle className="w-5 h-5 inline mr-2" /> {error}
        </div>
      )}

      {/* Generated Result */}
      {result && (
        <div className="flex flex-col gap-4 animate-fade-in">
          <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Generated Lesson: {topic}
          </h3>

          <ContentSection icon={<Target className="w-5 h-5" />} title="Hook" content={result.hook} accentBg />
          <ContentSection icon={<Crosshair className="w-5 h-5" />} title="Why This Matters" content={result.why_this_matters} />

          {/* Real World Examples */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5" />
              <h4 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Real-World Examples</h4>
            </div>
            <ul className="flex flex-col gap-2">
              {result.real_world_examples.map((ex, i) => (
                <li key={i} className="text-sm p-2 rounded" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}>• {ex}</li>
              ))}
            </ul>
          </div>

          <ContentSection icon={<BookOpen className="w-5 h-5" />} title="Core Explanation" content={result.core_explanation} />
          <ContentSection icon={<Lightbulb className="w-5 h-5" />} title="Explain Like I'm 5" content={result.analogy} accentBg />
          <ContentSection icon={<AlertTriangle className="w-5 h-5" />} title="Common Misconception" content={result.common_misconception} />
          <ContentSection icon={<HelpCircle className="w-5 h-5" />} title="Curiosity Question (For Class Debate)" content={result.curiosity_question} accentBg />

          {result.ethics_impact && (
            <ContentSection
              icon={<Scale className="w-5 h-5" />}
              title="Ethics & Societal Impact"
              content={typeof result.ethics_impact === "string" ? result.ethics_impact : Object.entries(result.ethics_impact).map(([k, v]) => `**${k.replace(/_/g, ' ')}**: ${v}`).join('\n\n')}
            />
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap">
            <a href="/dashboard/library" className="btn btn-primary flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Saved to Library <ChevronRight className="w-3 h-3" />
            </a>
            <button
              className="btn btn-secondary flex items-center gap-2"
              onClick={() => handleGenerate(true)}
              disabled={regenerating}
              style={{ opacity: regenerating ? 0.6 : 1 }}
            >
              {regenerating
                ? <><Loader className="w-4 h-4 animate-spin" /> Regenerating...</>
                : <><RefreshCw className="w-4 h-4" /> Explain Differently</>
              }
            </button>
            <button
              className="btn btn-secondary flex items-center gap-2"
              onClick={handleGenerateQuiz}
              disabled={quizLoading}
              style={{ opacity: quizLoading ? 0.6 : 1 }}
            >
              {quizLoading
                ? <><Loader className="w-4 h-4 animate-spin" /> Generating Quiz...</>
                : <><BarChart className="w-4 h-4" /> Generate Quiz</>
              }
            </button>
          </div>

          {/* Quiz Section */}
          {quiz && quiz.length > 0 && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <BarChart className="w-5 h-5 text-[var(--accent)]" /> Generated Quiz ({quiz.length} Questions)
              </h3>
              {quiz.map((q, qi) => (
                <div key={qi} className="card">
                  <p className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                    {qi + 1}. {q.question}
                  </p>
                  <div className="flex flex-col gap-2">
                    {q.options.map((opt, oi) => {
                      const isSelected = selectedAnswers[qi] === oi;
                      const isCorrect = showAnswers && oi === q.correct_index;
                      const isWrong = showAnswers && isSelected && oi !== q.correct_index;
                      return (
                        <button
                          key={oi}
                          className="p-3 rounded-lg text-sm text-left"
                          style={{
                            border: `2px solid ${isCorrect ? "var(--success)" : isWrong ? "var(--error)" : isSelected ? "var(--accent)" : "var(--border)"}`,
                            background: isCorrect ? "rgba(34,197,94,0.1)" : isWrong ? "rgba(239,68,68,0.1)" : isSelected ? "var(--accent-light)" : "transparent",
                            color: "var(--text-primary)",
                            cursor: showAnswers ? "default" : "pointer",
                            fontWeight: isSelected ? 600 : 400,
                          }}
                          onClick={() => { if (!showAnswers) setSelectedAnswers(prev => ({ ...prev, [qi]: oi })); }}
                        >
                          {String.fromCharCode(65 + oi)}. {opt}
                        </button>
                      );
                    })}
                  </div>
                  {showAnswers && (
                    <p className="text-xs mt-2 p-2 rounded" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
                      💡 {q.explanation}
                    </p>
                  )}
                </div>
              ))}
              {!showAnswers ? (
                <button
                  className="btn btn-primary"
                  onClick={() => setShowAnswers(true)}
                  disabled={Object.keys(selectedAnswers).length < quiz.length}
                  style={{ opacity: Object.keys(selectedAnswers).length < quiz.length ? 0.6 : 1 }}
                >
                  Submit Answers
                </button>
              ) : (
                <div className="card" style={{ background: "var(--accent-light)", borderColor: "var(--accent)" }}>
                  <p className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
                    Score: {quiz.filter((q, i) => selectedAnswers[i] === q.correct_index).length} / {quiz.length}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div className="flex h-64 items-center justify-center"><Loader className="animate-spin w-8 h-8 text-[var(--accent)]" /></div>}>
      <GenerateForm />
    </Suspense>
  );
}

function ContentSection({ icon, title, content, accentBg }: { icon: React.ReactNode; title: string; content: string; accentBg?: boolean; }) {
  return (
    <div className="card" style={accentBg ? { background: "var(--accent-light)", borderColor: "var(--accent)" } : {}}>
      <div className="flex items-center gap-2 mb-2">
        <span className="flex items-center justify-center text-lg">{icon}</span>
        <h4 className="font-semibold text-sm" style={{ color: accentBg ? "var(--accent)" : "var(--text-primary)" }}>{title}</h4>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>{content}</p>
    </div>
  );
}
