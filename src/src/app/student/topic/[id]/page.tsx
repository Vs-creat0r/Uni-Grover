"use client";

import { useState } from "react";
import { Target, Crosshair, Globe, BookOpen, User, Loader, RefreshCw, Lightbulb, AlertTriangle, HelpCircle, Hammer } from "lucide-react";

const MOCK_TOPIC = {
  title: "Linked Lists",
  course: "CS-201: Data Structures",
  hook: "Did you know that Spotify uses a variant of linked lists to manage your music queue? Every time you add a song to 'Play Next', you're interacting with a linked list.",
  why_this_matters: "Linked Lists solve the fundamental problem of dynamic data storage. Unlike arrays, they can grow and shrink at runtime without wasting memory, making them essential for building queues, stacks, and hash tables in real applications.",
  real_world_examples: [
    "Spotify uses doubly-linked lists for music queue management",
    "Web browsers use them for forward/back navigation history",
    "Operating systems use them to manage running processes",
  ],
  core_explanation: "A Linked List is a linear data structure where each element (called a 'node') contains two things: the data itself, and a pointer (reference) to the next node in the sequence. Unlike arrays, the nodes are not stored in contiguous memory — they can be scattered anywhere in RAM, connected only by their pointers.\n\nThis gives linked lists a key advantage: inserting or removing an element at the beginning or middle takes O(1) time (if you already have a reference to the node), compared to O(n) for arrays which must shift all subsequent elements.\n\nHowever, this flexibility comes at a cost: you can't access the 5th element directly (no random access). You must traverse from the head node, following pointers one by one. This makes lookups O(n).",
  analogy: "Imagine a treasure hunt where each clue leads you to the next location. You can't jump directly to clue #5 — you must follow the chain from the beginning. Each clue (node) knows only where the next clue is (pointer). This is exactly how a linked list works in memory.",
  common_misconception: "Many students think linked lists are 'better' than arrays because they're more flexible. But that's like saying a bicycle is better than a car — it depends on the use case! Arrays have O(1) random access and better cache locality, making them faster for most read-heavy operations. It's very common to confuse when to use which — and that's perfectly okay.",
  curiosity_question: "If you were designing a new data structure from scratch that combined the best of arrays (fast random access) and linked lists (fast insertions), what would it look like? Hint: some real data structures like skip lists and unrolled linked lists attempt exactly this.",
};

export default function StudentTopicPage() {
  const [showSimple, setShowSimple] = useState(false);
  const [altExplanation, setAltExplanation] = useState<string | null>(null);
  const [loadingAlt, setLoadingAlt] = useState(false);

  const handleExplainDifferently = async () => {
    setLoadingAlt(true);
    // Simulate API call
    setTimeout(() => {
      setAltExplanation(
        "Think of a linked list like a conga line at a party. Each person holds onto the shoulders of the person in front of them. To add someone new at the front, they just grab onto the first person — no one else needs to move! But if you want to find the 10th person, you have to count from the front. An array, on the other hand, is like a row of numbered chairs — you can instantly find chair #10, but if someone wants to sit in the middle, everyone has to shuffle over."
      );
      setLoadingAlt(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <a href="/student" style={{ color: "var(--accent)", textDecoration: "none" }}>Dashboard</a>
        <span style={{ color: "var(--text-muted)" }}>/</span>
        <a href="/student/course/cs-201" style={{ color: "var(--accent)", textDecoration: "none" }}>{MOCK_TOPIC.course}</a>
        <span style={{ color: "var(--text-muted)" }}>/</span>
        <span style={{ color: "var(--text-secondary)" }}>{MOCK_TOPIC.title}</span>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
        {MOCK_TOPIC.title}
      </h2>

      {/* Hook */}
      <div className="card" style={{ background: "var(--accent-light)", borderColor: "var(--accent)" }}>
        <div className="flex items-start gap-2">
          <Target className="w-5 h-5 text-[var(--accent)]" />
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--accent)" }}>Hook</p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>{MOCK_TOPIC.hook}</p>
          </div>
        </div>
      </div>

      {/* Why This Matters */}
      <Section icon={<Crosshair className="w-5 h-5" />} title="Why This Matters" content={MOCK_TOPIC.why_this_matters} />

      {/* Real World Examples */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-5 h-5" />
          <h4 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Real-World Examples</h4>
        </div>
        <ul className="flex flex-col gap-2">
          {MOCK_TOPIC.real_world_examples.map((ex, i) => (
            <li key={i} className="text-sm p-2 rounded" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}>
              • {ex}
            </li>
          ))}
        </ul>
      </div>

      {/* Core Explanation */}
      <Section icon={<BookOpen className="w-5 h-5" />} title="Core Explanation" content={MOCK_TOPIC.core_explanation} />

      {/* Explain Differently + ELI5 Buttons */}
      <div className="flex gap-3">
        <button
          className="btn btn-secondary flex items-center justify-center gap-2"
          onClick={() => setShowSimple(!showSimple)}
        >
          {showSimple ? "Hide Simple Version" : <><User className="w-4 h-4" /> Explain Like I'm 5</>}
        </button>
        <button
          className="btn btn-secondary flex items-center justify-center gap-2"
          onClick={handleExplainDifferently}
          disabled={loadingAlt}
          style={{ opacity: loadingAlt ? 0.6 : 1 }}
        >
          {loadingAlt ? <><Loader className="w-4 h-4 animate-spin" /> Generating...</> : <><RefreshCw className="w-4 h-4" /> Explain Differently</>}
        </button>
      </div>

      {/* ELI5 */}
      {showSimple && (
        <div className="card animate-fade-in" style={{ background: "var(--accent-light)", borderColor: "var(--accent)" }}>
          <div className="flex items-start gap-2">
            <Lightbulb className="w-5 h-5 text-[var(--accent)]" />
            <div>
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--accent)" }}>Explain Like I&apos;m 5</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>{MOCK_TOPIC.analogy}</p>
            </div>
          </div>
        </div>
      )}

      {/* Alt Explanation */}
      {altExplanation && (
        <div className="card animate-fade-in" style={{ borderColor: "var(--success)" }}>
          <div className="flex items-start gap-2">
            <RefreshCw className="w-5 h-5 text-[var(--success)]" />
            <div>
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--success)" }}>Alternative Explanation</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>{altExplanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Common Misconception */}
      <Section icon={<AlertTriangle className="w-5 h-5" />} title="Common Misconception" content={MOCK_TOPIC.common_misconception} />

      {/* Curiosity Question */}
      <div className="card" style={{ background: "var(--accent-light)", borderColor: "var(--accent)" }}>
        <div className="flex items-start gap-2">
          <HelpCircle className="w-5 h-5 text-[var(--accent)]" />
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--accent)" }}>Curiosity Question — Debate This!</p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>{MOCK_TOPIC.curiosity_question}</p>
          </div>
        </div>
      </div>

      {/* Build This Challenge */}
      <div className="card" style={{ borderColor: "var(--success)" }}>
        <div className="flex items-start gap-2">
          <Hammer className="w-5 h-5 text-[var(--success)]" />
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--success)" }}>Build This!</p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
              <strong>Challenge:</strong> Build a music playlist manager using a doubly-linked list.
              You should be able to: add songs, remove songs, skip to next, and go back to previous.
              Bonus: implement a &quot;shuffle&quot; feature.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, content }: { icon: React.ReactNode; title: string; content: string }) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-2">
        <span className="flex items-center justify-center text-lg">{icon}</span>
        <h4 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{title}</h4>
      </div>
      <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--text-primary)" }}>
        {content}
      </p>
    </div>
  );
}
