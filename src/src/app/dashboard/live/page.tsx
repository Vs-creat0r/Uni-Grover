"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  Mic, Play, Square, Upload, Maximize, Minimize,
  ChevronLeft, ChevronRight, Loader, MessageSquare,
  ThumbsUp, ThumbsDown, HelpCircle, X, FileText
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SlideData {
  page: number;
  bullets: string[];
  question: string;
  options: string[];
}

interface Feedback {
  id: string;
  slide_number: number;
  student_id: string;
  response_type: "like" | "dislike" | "question";
  response_text: string | null;
  created_at: string;
}

interface Course {
  id: string;
  title: string;
}

interface Session {
  id: string;
  title: string;
  status: string;
  current_slide: number;
  total_slides: number;
  slide_data: { slides: SlideData[] } | null;
}

export default function LivePresentationPage() {
  // Pre-session state
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [sessionTitle, setSessionTitle] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPages, setPdfPages] = useState<string[]>([]); // base64 rendered pages
  const [pdfTexts, setPdfTexts] = useState<{ page: number; text: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  // Session state
  const [session, setSession] = useState<Session | null>(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const slideContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const feedbackInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch courses on mount
  useEffect(() => {
    supabase.from("courses").select("id, title").order("title")
      .then(({ data }) => { if (data) setCourses(data as Course[]); });
  }, []);

  // PDF Upload & Render
  const handleFileUpload = async (file: File) => {
    setPdfFile(file);
    setUploading(true);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pages: string[] = [];
      const texts: { page: number; text: string }[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);

        // Render to canvas
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport } as any).promise;
        pages.push(canvas.toDataURL("image/jpeg", 0.8));

        // Extract text
        const textContent = await page.getTextContent();
        const text = textContent.items.map((item: any) => item.str || "").join(" ");
        texts.push({ page: i, text });
      }

      setPdfPages(pages);
      setPdfTexts(texts);
      setSessionTitle(file.name.replace(/\.[^/.]+$/, ""));
    } catch (err) {
      console.error("PDF processing error:", err);
      alert("Failed to process PDF. Please try another file.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") handleFileUpload(file);
  };

  // Start Session
  const startSession = async () => {
    if (!pdfPages.length || !sessionTitle.trim()) return;
    setAnalyzing(true);

    try {
      // Step 1: AI analysis
      const analyzeRes = await fetch("/api/live/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slideTexts: pdfTexts }),
      });

      let slideData = null;
      if (analyzeRes.ok) {
        slideData = await analyzeRes.json();
      }

      // Step 2: Create session in DB
      const sessionRes = await fetch("/api/live/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourseId || null,
          title: sessionTitle,
          totalSlides: pdfPages.length,
          slideData,
          pdfText: pdfTexts,
        }),
      });

      if (!sessionRes.ok) throw new Error("Failed to create session");

      const sessionData = await sessionRes.json();
      setSession(sessionData as Session);
      setCurrentSlide(1);
    } catch (err) {
      console.error("Start session error:", err);
      alert("Failed to start session. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  // End Session
  const endSession = async () => {
    if (!session) return;
    await fetch("/api/live/session", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: session.id, status: "ended" }),
    });
    setSession(null);
    setPdfFile(null);
    setPdfPages([]);
    setPdfTexts([]);
    setFeedback([]);
    setShowFeedback(false);
    if (feedbackInterval.current) clearInterval(feedbackInterval.current);
  };

  // Navigate slides & sync to DB
  const goToSlide = useCallback(async (slide: number) => {
    if (!session) return;
    const clamped = Math.max(1, Math.min(pdfPages.length, slide));
    setCurrentSlide(clamped);
    await fetch("/api/live/session", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: session.id, currentSlide: clamped }),
    });
  }, [session, pdfPages.length]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!slideContainerRef.current) return;
    if (!isFullscreen) {
      slideContainerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!session) return;
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goToSlide(currentSlide + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goToSlide(currentSlide - 1); }
      if (e.key === "Escape" && isFullscreen) { document.exitFullscreen?.(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [session, currentSlide, isFullscreen, goToSlide]);

  // Poll feedback
  const fetchFeedback = useCallback(async () => {
    if (!session) return;
    setFeedbackLoading(true);
    try {
      const res = await fetch(`/api/live/feedback?sessionId=${session.id}`);
      if (res.ok) {
        const data = await res.json();
        setFeedback(data.feedback || []);
      }
    } catch (err) {
      console.error("Feedback fetch error:", err);
    } finally {
      setFeedbackLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (showFeedback && session) {
      fetchFeedback();
      feedbackInterval.current = setInterval(fetchFeedback, 3000);
      return () => { if (feedbackInterval.current) clearInterval(feedbackInterval.current); };
    }
  }, [showFeedback, session, fetchFeedback]);

  // Get current slide AI data
  const currentSlideData = session?.slide_data?.slides?.find((s: SlideData) => s.page === currentSlide);
  const currentSlideFeedback = feedback.filter((f) => f.slide_number === currentSlide);

  // ====== PRE-SESSION VIEW ======
  if (!session) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Mic className="w-6 h-6 text-[var(--accent)]" /> Live Presentation
            </h2>
            <p style={{ color: "var(--text-secondary)", marginTop: 4 }}>
              Upload a PDF, let AI analyze it, then start a live session with your students.
            </p>
          </div>
        </div>

        {/* Course Selector */}
        <div className="card">
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Course (Optional)</label>
          <select className="input w-full" value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)}>
            <option value="">No course linked</option>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>

        {/* PDF Upload Zone */}
        <div
          className="card flex flex-col items-center justify-center py-16"
          style={{ border: "2px dashed var(--border)", cursor: "pointer", textAlign: "center" }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => { const input = document.createElement("input"); input.type = "file"; input.accept = ".pdf"; input.onchange = (e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) handleFileUpload(f); }; input.click(); }}
        >
          {uploading ? (
            <><Loader className="w-12 h-12 mb-4 animate-spin text-[var(--accent)]" /><p className="text-sm" style={{ color: "var(--text-secondary)" }}>Processing PDF...</p></>
          ) : pdfFile ? (
            <><FileText className="w-12 h-12 mb-4 text-[var(--success)]" /><p className="font-semibold" style={{ color: "var(--text-primary)" }}>{pdfFile.name}</p><p className="text-sm" style={{ color: "var(--text-secondary)" }}>{pdfPages.length} slides loaded</p></>
          ) : (
            <><Upload className="w-12 h-12 mb-4 text-[var(--text-muted)]" /><p className="font-semibold" style={{ color: "var(--text-primary)" }}>Drag & drop a PDF here</p><p className="text-sm" style={{ color: "var(--text-muted)" }}>or click to browse</p></>
          )}
        </div>

        {/* Slide Preview */}
        {pdfPages.length > 0 && (
          <div className="card">
            <h3 className="text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Preview ({pdfPages.length} slides)</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {pdfPages.map((page, i) => (
                <div key={i} className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)", aspectRatio: "4/3" }}>
                  <img src={page} alt={`Slide ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <p className="text-center text-xs py-1" style={{ color: "var(--text-muted)", background: "var(--bg-secondary)" }}>{i + 1}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Session Title & Start */}
        {pdfPages.length > 0 && (
          <div className="card">
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Session Title</label>
            <input className="input w-full mb-4" value={sessionTitle} onChange={(e) => setSessionTitle(e.target.value)} placeholder="e.g., Lecture 5: Cyber Security" />
            <button
              className="btn btn-primary w-full flex items-center justify-center gap-2"
              onClick={startSession}
              disabled={analyzing || !sessionTitle.trim()}
              style={{ height: 48, fontSize: 15, opacity: analyzing || !sessionTitle.trim() ? 0.6 : 1 }}
            >
              {analyzing ? <><Loader className="w-4 h-4 animate-spin" /> AI is analyzing slides...</> : <><Play className="w-4 h-4 fill-current" /> Start Live Session</>}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ====== ACTIVE SESSION VIEW ======
  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <Mic className="w-6 h-6 text-[var(--accent)]" /> Live Presentation
          </h2>
          <p style={{ color: "var(--text-secondary)", marginTop: 4 }}>Session is live! Students can join and give feedback.</p>
        </div>
        <button className="btn flex items-center gap-2" style={{ background: "var(--error)", color: "white" }} onClick={endSession}>
          <Square className="w-4 h-4 fill-current" /> End Session
        </button>
      </div>

      {/* Session Info Bar */}
      <div className="card">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "var(--success)", color: "white" }}>
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" style={{ display: "inline-block" }} />
              <span className="text-sm font-semibold">LIVE</span>
            </div>
            <div>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>Session ID</span>
              <p className="text-sm font-mono font-bold" style={{ color: "var(--accent)" }}>{session.id}</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>Share this link with students</span>
              <p className="text-sm font-mono mb-2" style={{ color: "var(--text-primary)" }}>
                {typeof window !== "undefined" ? window.location.origin : ""}/student/live/{session.id}
              </p>
              {typeof window !== "undefined" && window.location.hostname === "localhost" && (
                <p className="text-xs" style={{ color: "var(--warning)", maxWidth: 300 }}>
                  ⚠️ To share with students on mobile, access this dashboard via your network IP (e.g. 192.168.x.x) instead of localhost.
                </p>
              )}
            </div>
            {typeof window !== "undefined" && (
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(window.location.origin + "/student/live/" + session.id)}&color=ffffff&bgcolor=1c1c1f`}
                alt="QR Code" 
                style={{ borderRadius: 8, border: "1px solid var(--border)" }}
                className="hidden md:block"
              />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Slide Area */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Slide Viewer */}
          <div
            ref={slideContainerRef}
            className="card relative"
            style={{ background: "#000", minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}
          >
            {pdfPages[currentSlide - 1] && (
              <img
                src={pdfPages[currentSlide - 1]}
                alt={`Slide ${currentSlide}`}
                style={{ maxWidth: "100%", maxHeight: isFullscreen ? "100vh" : "500px", objectFit: "contain" }}
              />
            )}
            {/* Fullscreen / Exit buttons */}
            <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 8 }}>
              <button
                className="btn-ghost"
                onClick={toggleFullscreen}
                style={{ background: "rgba(0,0,0,0.5)", color: "white", padding: "6px 10px", borderRadius: 8 }}
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
            {/* Slide counter overlay */}
            <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.6)", color: "white", padding: "4px 16px", borderRadius: 20, fontSize: 13 }}>
              {currentSlide} / {pdfPages.length}
            </div>
          </div>

          {/* Slide Navigation */}
          <div className="flex items-center justify-center gap-4">
            <button className="btn btn-secondary" onClick={() => goToSlide(currentSlide - 1)} disabled={currentSlide <= 1} style={{ opacity: currentSlide <= 1 ? 0.4 : 1 }}>
              <ChevronLeft className="w-4 h-4 mr-1 inline" /> Previous
            </button>
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)", minWidth: 80, textAlign: "center" }}>
              {currentSlide} / {pdfPages.length}
            </span>
            <button className="btn btn-primary" onClick={() => goToSlide(currentSlide + 1)} disabled={currentSlide >= pdfPages.length} style={{ opacity: currentSlide >= pdfPages.length ? 0.4 : 1 }}>
              Next <ChevronRight className="w-4 h-4 ml-1 inline" />
            </button>
          </div>

          {/* AI Insights for current slide */}
          {currentSlideData && (
            <div className="card" style={{ background: "var(--accent-light)", borderColor: "var(--accent)" }}>
              <h4 className="text-sm font-semibold mb-2" style={{ color: "var(--accent)" }}>🤖 AI Slide Summary</h4>
              <ul className="flex flex-col gap-1">
                {currentSlideData.bullets.map((b: string, i: number) => (
                  <li key={i} className="text-sm" style={{ color: "var(--text-primary)" }}>• {b}</li>
                ))}
              </ul>
              <p className="text-xs mt-2" style={{ color: "var(--text-secondary)" }}>
                Student question: &quot;{currentSlideData.question}&quot;
              </p>
            </div>
          )}
        </div>

        {/* Right Panel: Feedback */}
        <div className="flex flex-col gap-4">
          <div className="card" style={{ maxHeight: 600, display: "flex", flexDirection: "column" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <MessageSquare className="w-5 h-5 text-[var(--accent)]" /> Student Feedback
              </h3>
              <button
                className="btn-ghost text-xs px-2 py-1"
                onClick={() => { setShowFeedback(!showFeedback); if (!showFeedback) fetchFeedback(); }}
                style={{ color: "var(--accent)" }}
              >
                {showFeedback ? "Auto-refresh ON" : "Load Feedback"}
              </button>
            </div>

            {feedbackLoading && feedback.length === 0 ? (
              <div className="flex justify-center py-8"><Loader className="w-6 h-6 animate-spin text-[var(--accent)]" /></div>
            ) : feedback.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>No feedback yet. Students will submit responses as you present.</p>
            ) : (
              <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
                {/* Filter: show current slide feedback first */}
                {currentSlideFeedback.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-semibold mb-2" style={{ color: "var(--accent)" }}>Slide {currentSlide} ({currentSlideFeedback.length} responses)</p>
                    {currentSlideFeedback.map((f) => (
                      <FeedbackCard key={f.id} feedback={f} />
                    ))}
                  </div>
                )}
                {/* All feedback */}
                <p className="text-xs font-semibold mt-2" style={{ color: "var(--text-muted)" }}>All Feedback ({feedback.length} total)</p>
                {feedback.slice(0, 20).map((f) => (
                  <FeedbackCard key={f.id} feedback={f} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeedbackCard({ feedback }: { feedback: Feedback }) {
  const icon = feedback.response_type === "like" ? <ThumbsUp className="w-3 h-3" /> : feedback.response_type === "dislike" ? <ThumbsDown className="w-3 h-3" /> : <HelpCircle className="w-3 h-3" />;
  const color = feedback.response_type === "like" ? "var(--success)" : feedback.response_type === "dislike" ? "var(--error)" : "var(--accent)";

  return (
    <div className="p-2 rounded-lg text-sm" style={{ background: "var(--bg-secondary)" }}>
      <div className="flex items-center gap-2 mb-1">
        <span style={{ color }}>{icon}</span>
        <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{feedback.student_id}</span>
        <span className="text-xs ml-auto" style={{ color: "var(--text-muted)" }}>Slide {feedback.slide_number}</span>
      </div>
      {feedback.response_text && (
        <p className="text-xs" style={{ color: "var(--text-primary)" }}>{feedback.response_text}</p>
      )}
    </div>
  );
}
