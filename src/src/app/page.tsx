"use client";

import { useTheme } from "@/components/theme-provider";
import { Sparkles, Lightbulb, Mic, Brain, Moon, Sun, ArrowRight, Heart } from "lucide-react";

const FEATURES = [
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "AI Content Generation",
    description: "Enter a topic and get structured lesson plans, presentations, quizzes, and real-world examples — in seconds.",
  },
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: "Behavioral Nudge Engine",
    description: "Contextual teaching tips that subtly improve your teaching style without formal training. Become a better educator naturally.",
  },
  {
    icon: <Mic className="w-8 h-8" />,
    title: "Live Interactive Sessions",
    description: "QR-based attendance, anonymous student questions, live polls, and real-time engagement analytics during your lectures.",
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Student-Centered Learning",
    description: "Gamified warm-ups, curiosity hooks, 'Explain Differently' tools, and career-connected content that inspires students.",
  },
];

const STATS = [
  { value: "50%", label: "Less prep time" },
  { value: "40%", label: "More engagement" },
  { value: "3x", label: "Better retention" },
  { value: "∞", label: "Teaching improvement" },
];

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-6 sm:px-12"
        style={{ height: "var(--header-height)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-lg font-bold text-white text-lg"
            style={{ width: 36, height: 36, background: "var(--accent)", borderRadius: "var(--radius-sm)" }}
          >
            U
          </div>
          <span className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>
            Uni-Grover
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="btn btn-ghost flex items-center justify-center" style={{ fontSize: 18 }}>
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <a href="/auth/login" className="btn btn-ghost" style={{ textDecoration: "none" }}>
            Log In
          </a>
          <a href="/auth/signup" className="btn btn-primary" style={{ textDecoration: "none" }}>
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-20 pb-16">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6"
          style={{ background: "var(--accent-light)", color: "var(--accent)" }}
        >
          <Sparkles className="w-4 h-4" /> AI-Powered Education Platform
        </div>
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          style={{ color: "var(--text-primary)", maxWidth: 800 }}
        >
          Transform How You{" "}
          <span style={{ color: "var(--accent)" }}>Teach</span> and{" "}
          <span style={{ color: "var(--accent)" }}>Learn</span>
        </h1>
        <p
          className="text-lg mb-10"
          style={{ color: "var(--text-secondary)", maxWidth: 600, lineHeight: 1.7 }}
        >
          Generate AI-powered lesson content, nudge better teaching habits, and engage
          students with interactive live sessions — all from one platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="/auth/signup"
            className="btn btn-primary flex items-center justify-center gap-2"
            style={{ height: 52, fontSize: 16, padding: "0 32px", textDecoration: "none" }}
          >
            Get Started as Professor <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="/auth/signup"
            className="btn btn-secondary"
            style={{ height: 52, fontSize: 16, padding: "0 32px", textDecoration: "none" }}
          >
            Join as Student
          </a>
        </div>
      </section>

      {/* Stats */}
      <section
        className="flex flex-wrap justify-center gap-8 sm:gap-16 py-12 px-6"
        style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
      >
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-3xl font-bold" style={{ color: "var(--accent)" }}>{s.value}</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{s.label}</p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Everything you need to teach better
          </h2>
          <p
            className="text-center mb-12"
            style={{ color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto 48px" }}
          >
            Built for professors who care about their students and want to make a lasting impact.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="card" style={{ padding: 28 }}>
                <span className="mb-4 block flex items-center text-[var(--accent)]">{f.icon}</span>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 px-6 text-center"
        style={{ background: "var(--bg-secondary)" }}
      >
        <h2
          className="text-3xl font-bold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Ready to transform your classroom?
        </h2>
        <p className="text-base mb-8" style={{ color: "var(--text-secondary)", maxWidth: 480, margin: "0 auto 32px" }}>
          Join professors who are already using Uni-Grover to save time, teach better, and inspire their students.
        </p>
        <a
          href="/auth/signup"
          className="btn btn-primary inline-flex items-center justify-center gap-2"
          style={{ height: 52, fontSize: 16, padding: "0 40px", textDecoration: "none" }}
        >
          Start Free Today <ArrowRight className="w-4 h-4" />
        </a>
      </section>

      {/* Footer */}
      <footer
        className="py-8 px-6 text-center"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <p className="text-sm flex items-center justify-center gap-1" style={{ color: "var(--text-muted)" }}>
          © 2026 Uni-Grover. Built with <Heart className="w-4 h-4 fill-current text-red-500" /> for educators who believe in curiosity-driven learning.
        </p>
      </footer>
    </div>
  );
}
