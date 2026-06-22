"use client";

import { useEffect, useState } from "react";
import { History, Search, FileText, ArrowRight, Loader, Users, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth-provider";
import Link from "next/link";

type Session = {
  id: string;
  title: string;
  course_id: string;
  status: string;
  created_at: string;
  ended_at: string;
  total_slides: number;
  courses: {
    title: string;
    professor_id: string;
  } | null;
  // We'll compute these
  feedbackCount?: number;
};

export default function SessionHistoryPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user) return;
    
    const fetchSessions = async () => {
      try {
        // Fetch all ended sessions. 
        // Note: course_id is optional so some sessions might not have a course.
        const { data: sessionData, error: sessionError } = await supabase
          .from("live_sessions")
          .select(`
            id, title, course_id, status, created_at, ended_at, total_slides,
            courses ( title, professor_id )
          `)
          .eq("status", "ended")
          .order("ended_at", { ascending: false });

        if (sessionError) throw sessionError;

        // Filter for sessions that belong to this professor 
        // (either linked to their course, or created by them if we add professor_id to sessions later)
        const mySessions = (sessionData as any[] || []).filter(s => 
          s.courses?.professor_id === user.id || !s.courses // If no course, we'll show it for now
        );

        // Fetch feedback counts for these sessions
        const sessionIds = mySessions.map(s => s.id);
        
        let feedbackCounts: Record<string, number> = {};
        if (sessionIds.length > 0) {
          const { data: feedbackData } = await supabase
            .from("slide_feedback")
            .select("session_id");
            
          if (feedbackData) {
            feedbackData.forEach(f => {
              feedbackCounts[f.session_id] = (feedbackCounts[f.session_id] || 0) + 1;
            });
          }
        }

        const finalSessions = mySessions.map(s => ({
          ...s,
          feedbackCount: feedbackCounts[s.id] || 0
        }));

        setSessions(finalSessions);
      } catch (err) {
        console.error("Error fetching sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user]);

  const filteredSessions = sessions.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.courses?.title && s.courses.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <History className="w-6 h-6 text-[var(--accent)]" /> Session History
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            Review past live presentations and student feedback.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-9 w-full"
            style={{ height: 44 }}
          />
        </div>
      </div>

      {loading ? (
        <div className="card flex justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-[var(--accent)]" />
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--bg-secondary)" }}>
            <History className="w-8 h-8 text-[var(--text-muted)]" />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>No past sessions found</h3>
          <p className="text-sm max-w-sm mb-6" style={{ color: "var(--text-secondary)" }}>
            When you end a live presentation, it will appear here along with all the student feedback.
          </p>
          <Link href="/dashboard/live" className="btn btn-primary">
            Start a Live Session
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSessions.map((session) => {
            const date = session.ended_at ? new Date(session.ended_at) : new Date(session.created_at);
            const formattedDate = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
            
            return (
              <div key={session.id} className="card flex flex-col hover-scale" style={{ cursor: "default" }}>
                <div className="flex justify-between items-start mb-3">
                  <div className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {formattedDate}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                    Code: <span className="uppercase font-mono font-bold" style={{ color: "var(--text-primary)" }}>{session.id}</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-1 truncate" style={{ color: "var(--text-primary)" }}>
                  {session.title}
                </h3>
                <p className="text-sm mb-4 truncate" style={{ color: "var(--text-secondary)" }}>
                  {session.courses?.title || "No course attached"}
                </p>
                
                <div className="grid grid-cols-2 gap-2 mb-6 mt-auto">
                  <div className="flex flex-col p-2 rounded-lg" style={{ background: "var(--bg-secondary)" }}>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>Slides</span>
                    <span className="font-semibold flex items-center gap-1 mt-1" style={{ color: "var(--text-primary)" }}>
                      <FileText className="w-3 h-3 text-[var(--accent)]" /> {session.total_slides}
                    </span>
                  </div>
                  <div className="flex flex-col p-2 rounded-lg" style={{ background: "var(--bg-secondary)" }}>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>Feedback</span>
                    <span className="font-semibold flex items-center gap-1 mt-1" style={{ color: "var(--text-primary)" }}>
                      <MessageSquare className="w-3 h-3 text-blue-500" /> {session.feedbackCount}
                    </span>
                  </div>
                </div>
                
                <Link 
                  href={`/dashboard/live?session=${session.id}`}
                  className="btn btn-secondary w-full flex items-center justify-center gap-2"
                >
                  View Details <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
