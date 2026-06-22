"use client";

import { useState, useEffect, useCallback, use } from "react";
import {
  ThumbsUp, ThumbsDown, HelpCircle, Check, Loader,
  Send, AlertCircle, Radio
} from "lucide-react";

interface SlideData {
  page: number;
  bullets: string[];
  question: string;
  options: string[];
}

interface SessionInfo {
  id: string;
  title: string;
  status: string;
  current_slide: number;
  total_slides: number;
  slide_data: { slides: SlideData[] } | null;
}

interface SubmittedFeedback {
  slideNumber: number;
  type: string;
  text?: string;
}

export default function StudentLiveSession({ params }: { params: Promise<{ sessionId: string }> }) {
  const resolvedParams = use(params);
  const sessionIdFromUrl = resolvedParams.sessionId;

  // Login state
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [sessionIdInput, setSessionIdInput] = useState(sessionIdFromUrl || "");
  const [isJoined, setIsJoined] = useState(false);
  const [joinError, setJoinError] = useState("");

  // Session state
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [loading, setLoading] = useState(false);

  // Feedback state
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [customText, setCustomText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<SubmittedFeedback[]>([]);

  // Restore enrollment from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("uni-grover-enrollment");
    if (saved) setEnrollmentNumber(saved);
  }, []);

  // Join session
  const joinSession = async () => {
    if (!enrollmentNumber.trim() || !sessionIdInput.trim()) return;
    setJoinError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/live/session?id=${sessionIdInput.toUpperCase()}`);
      if (!res.ok) {
        setJoinError("Session not found. Please check the Session ID.");
        return;
      }

      const data = await res.json();
      if (data.status === "ended") {
        setJoinError("This session has already ended.");
        return;
      }

      setSession(data as SessionInfo);
      setCurrentSlide(data.current_slide);
      setIsJoined(true);
      localStorage.setItem("uni-grover-enrollment", enrollmentNumber);
    } catch {
      setJoinError("Failed to connect. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  // Poll for slide changes (Supabase Realtime would be better but polling is simpler for v1)
  const pollSession = useCallback(async () => {
    if (!session) return;
    try {
      const res = await fetch(`/api/live/session?id=${session.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.status === "ended") {
          setSession({ ...session, status: "ended" });
          return;
        }
        if (data.current_slide !== currentSlide) {
          setCurrentSlide(data.current_slide);
          setSelectedOption(null); // Reset selection for new slide
          setCustomText("");
        }
      }
    } catch (err) {
      console.error("Poll error:", err);
    }
  }, [session, currentSlide]);

  useEffect(() => {
    if (!isJoined || !session) return;
    const interval = setInterval(pollSession, 2000);
    return () => clearInterval(interval);
  }, [isJoined, session, pollSession]);

  // Get current slide AI data
  const currentSlideData = session?.slide_data?.slides?.find((s) => s.page === currentSlide);

  // Check if already submitted for this slide
  const alreadySubmitted = submitted.some((s) => s.slideNumber === currentSlide);

  // Submit feedback
  const submitFeedback = async (type: "like" | "dislike" | "question") => {
    if (!session || submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/live/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          slideNumber: currentSlide,
          studentId: enrollmentNumber,
          responseType: type,
          responseText: type === "question" ? customText : (selectedOption || null),
        }),
      });

      if (res.ok) {
        setSubmitted((prev) => [...prev, { slideNumber: currentSlide, type, text: customText || selectedOption || undefined }]);
        setCustomText("");
      }
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // ====== LOGIN VIEW ======
  if (!isJoined) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg-primary)" }}>
        <div className="card w-full max-w-md animate-fade-in">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Radio className="w-6 h-6 text-[var(--accent)]" />
              <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Join Live Session</h1>
            </div>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Enter your enrollment number and session ID to join.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Enrollment Number</label>
              <input
                className="input w-full"
                placeholder="e.g., 2024CSE001"
                value={enrollmentNumber}
                onChange={(e) => setEnrollmentNumber(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Session ID</label>
              <input
                className="input w-full"
                placeholder="e.g., A3B5K7"
                value={sessionIdInput}
                onChange={(e) => setSessionIdInput(e.target.value.toUpperCase())}
                maxLength={6}
                style={{ textTransform: "uppercase", letterSpacing: 4, fontFamily: "monospace", fontSize: 18, textAlign: "center" }}
              />
            </div>

            {joinError && (
              <div className="flex items-center gap-2 p-3 rounded-lg text-sm" style={{ background: "rgba(239,68,68,0.1)", color: "var(--error)" }}>
                <AlertCircle className="w-4 h-4" /> {joinError}
              </div>
            )}

            <button
              className="btn btn-primary w-full flex items-center justify-center gap-2"
              onClick={joinSession}
              disabled={loading || !enrollmentNumber.trim() || !sessionIdInput.trim()}
              style={{ height: 48, fontSize: 15, opacity: loading || !enrollmentNumber.trim() || !sessionIdInput.trim() ? 0.6 : 1 }}
            >
              {loading ? <><Loader className="w-4 h-4 animate-spin" /> Joining...</> : <><Radio className="w-4 h-4" /> Join Session</>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ====== SESSION ENDED VIEW ======
  if (session?.status === "ended") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg-primary)" }}>
        <div className="card w-full max-w-md text-center animate-fade-in">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)]" />
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Session Ended</h2>
          <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>The professor has ended this session. Thank you for participating!</p>
          <div className="text-sm" style={{ color: "var(--text-muted)" }}>
            You submitted feedback on {submitted.length} slide(s).
          </div>
        </div>
      </div>
    );
  }

  // ====== ACTIVE SESSION VIEW ======
  return (
    <div className="min-h-screen p-4" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-lg mx-auto flex flex-col gap-4 animate-fade-in">
        {/* Session Header */}
        <div className="card text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full animate-pulse" style={{ background: "var(--success)", display: "inline-block" }} />
            <span className="text-sm font-semibold" style={{ color: "var(--success)" }}>LIVE</span>
          </div>
          <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{session?.title}</h2>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Slide {currentSlide} of {session?.total_slides} · {enrollmentNumber}
          </p>
        </div>

        {/* AI-Generated Content for Current Slide */}
        {currentSlideData ? (
          <div className="card">
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <HelpCircle className="w-5 h-5 text-[var(--accent)]" /> Slide {currentSlide} — Key Points
            </h3>

            {/* Bullet Points */}
            <ul className="flex flex-col gap-2 mb-4">
              {currentSlideData.bullets.map((b, i) => (
                <li key={i} className="text-sm p-2 rounded-lg" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}>
                  • {b}
                </li>
              ))}
            </ul>

            {/* Engagement Question */}
            <p className="text-sm font-medium mb-3" style={{ color: "var(--accent)" }}>
              {currentSlideData.question}
            </p>

            {/* Option Buttons */}
            {!alreadySubmitted ? (
              <>
                <div className="flex flex-col gap-2 mb-4">
                  {currentSlideData.options.map((opt, i) => (
                    <button
                      key={i}
                      className="p-3 rounded-lg text-sm text-left"
                      style={{
                        border: `2px solid ${selectedOption === opt ? "var(--accent)" : "var(--border)"}`,
                        background: selectedOption === opt ? "var(--accent-light)" : "transparent",
                        color: "var(--text-primary)",
                        cursor: "pointer",
                        fontWeight: selectedOption === opt ? 600 : 400,
                        transition: "all 0.15s ease",
                      }}
                      onClick={() => setSelectedOption(opt)}
                    >
                      {selectedOption === opt && <Check className="w-4 h-4 inline mr-2" />}
                      {opt}
                    </button>
                  ))}
                </div>

                {/* Quick feedback buttons */}
                <div className="flex gap-2 mb-3">
                  <button
                    className="btn btn-secondary flex-1 flex items-center justify-center gap-2 text-sm"
                    onClick={() => submitFeedback("like")}
                    disabled={submitting || !selectedOption}
                    style={{ opacity: submitting || !selectedOption ? 0.5 : 1 }}
                  >
                    <ThumbsUp className="w-4 h-4" /> I understood
                  </button>
                  <button
                    className="btn btn-secondary flex-1 flex items-center justify-center gap-2 text-sm"
                    onClick={() => submitFeedback("dislike")}
                    disabled={submitting || !selectedOption}
                    style={{ opacity: submitting || !selectedOption ? 0.5 : 1 }}
                  >
                    <ThumbsDown className="w-4 h-4" /> Need clarification
                  </button>
                </div>

                {/* Custom query */}
                <div className="flex gap-2">
                  <input
                    className="input flex-1"
                    placeholder="Ask a question or add a comment..."
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && customText.trim() && submitFeedback("question")}
                  />
                  <button
                    className="btn btn-primary flex items-center gap-1"
                    onClick={() => submitFeedback("question")}
                    disabled={submitting || !customText.trim()}
                    style={{ opacity: submitting || !customText.trim() ? 0.5 : 1 }}
                  >
                    {submitting ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 p-4 rounded-lg" style={{ background: "var(--bg-secondary)" }}>
                <Check className="w-5 h-5" style={{ color: "var(--success)" }} />
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                  Response submitted for this slide. Waiting for next slide...
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="card text-center py-8">
            <Loader className="w-8 h-8 mx-auto mb-3 animate-spin text-[var(--accent)]" />
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Waiting for the professor to advance to the next slide...
            </p>
          </div>
        )}

        {/* Submission History */}
        {submitted.length > 0 && (
          <div className="card">
            <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Your Submissions</h4>
            <div className="flex flex-col gap-2">
              {submitted.map((s, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: "var(--bg-secondary)" }}>
                  {s.type === "like" ? <ThumbsUp className="w-3 h-3" style={{ color: "var(--success)" }} /> :
                    s.type === "dislike" ? <ThumbsDown className="w-3 h-3" style={{ color: "var(--error)" }} /> :
                      <HelpCircle className="w-3 h-3" style={{ color: "var(--accent)" }} />}
                  <span className="text-xs" style={{ color: "var(--text-primary)" }}>
                    Slide {s.slideNumber}: {s.text || (s.type === "like" ? "Understood" : "Needs clarification")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
