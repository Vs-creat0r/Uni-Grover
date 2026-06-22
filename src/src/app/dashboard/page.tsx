"use client";

import { useEffect, useState } from "react";
import { BookOpen, Sparkles, BarChart, Lightbulb, Mic, Folder, Newspaper, X, Hand } from "lucide-react";

interface Nudge {
  id: string;
  content: string;
  category: string;
}

export default function DashboardPage() {
  const [nudge, setNudge] = useState<Nudge | null>(null);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/nudges?context=dashboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.nudge) setNudge(data.nudge);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Page Title */}
      <div>
        <h2
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Welcome back, Professor <Hand className="inline w-6 h-6 ml-1 mb-1 text-yellow-500" />
        </h2>
        <p style={{ color: "var(--text-secondary)", marginTop: 4 }}>
          Here&apos;s your teaching dashboard for today.
        </p>
      </div>

      {/* Nudge Card */}
      {nudge && !nudgeDismissed && (
        <div className="nudge-card animate-nudge" style={{ position: "relative" }}>
          <div style={{ flex: 1 }}>{nudge.content}</div>
          <button
            onClick={() => setNudgeDismissed(true)}
            className="btn-ghost"
            style={{
              padding: "4px 8px",
              fontSize: 12,
              position: "absolute",
              top: 8,
              right: 8,
              color: "var(--nudge-text)",
              opacity: 0.6,
            }}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Courses" value="3" subtitle="Active courses" icon={<BookOpen className="w-5 h-5" />} />
        <StatCard title="Topics Generated" value="24" subtitle="This month" icon={<Sparkles className="w-5 h-5" />} />
        <StatCard title="Student Engagement" value="87%" subtitle="+12% from last month" icon={<BarChart className="w-5 h-5" />} />
        <StatCard title="Nudges Applied" value="8" subtitle="Teaching tips used" icon={<Lightbulb className="w-5 h-5" />} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="card lg:col-span-2">
          <h3
            className="text-base font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <QuickAction
              href="/dashboard/generate"
              icon={<Sparkles className="w-5 h-5" />}
              title="Generate Content"
              description="Create AI-powered lesson materials"
            />
            <QuickAction
              href="/dashboard/live"
              icon={<Mic className="w-5 h-5" />}
              title="Start Live Session"
              description="Launch presentation with QR attendance"
            />
            <QuickAction
              href="/dashboard/courses"
              icon={<BookOpen className="w-5 h-5" />}
              title="Manage Courses"
              description="View enrolled students and topics"
            />
            <QuickAction
              href="/dashboard/library"
              icon={<Folder className="w-5 h-5" />}
              title="Content Library"
              description="Browse all generated materials"
            />
          </div>
        </div>

        {/* Field News Feed */}
        <div className="card">
          <h3
            className="text-base font-semibold mb-4 flex items-center gap-2"
            style={{ color: "var(--text-primary)" }}
          >
            <Newspaper className="w-5 h-5" /> Field News Feed
          </h3>
          <div className="flex flex-col gap-3">
            <NewsItem
              title="GPT-5 Released: What It Means for CS Education"
              source="TechCrunch"
              time="2h ago"
            />
            <NewsItem
              title="New Study: Active Learning Increases Retention by 50%"
              source="Nature Education"
              time="5h ago"
            />
            <NewsItem
              title="React 20 Announced with Server Components v2"
              source="Vercel Blog"
              time="1d ago"
            />
          </div>
          <button
            className="btn btn-ghost w-full mt-3"
            style={{ fontSize: 13 }}
          >
            View All News →
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3
          className="text-base font-semibold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Recent Activity
        </h3>
        <div className="flex flex-col gap-2">
          <ActivityItem
            action="Generated content for"
            target="Data Structures — Linked Lists"
            time="Today, 10:30 AM"
          />
          <ActivityItem
            action="Created course"
            target="CS-301: Advanced Algorithms"
            time="Yesterday, 3:15 PM"
          />
          <ActivityItem
            action="Live session completed"
            target="Database Normalization (42 students)"
            time="Jun 19, 11:00 AM"
          />
        </div>
      </div>
    </div>
  );
}

/* ===== Sub-components ===== */

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="card flex items-start gap-3">
      <div
        className="flex items-center justify-center text-xl"
        style={{
          width: 44,
          height: 44,
          background: "var(--accent-light)",
          borderRadius: "var(--radius-sm)",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>{title}</p>
        <p
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          {value}
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: 12 }}>{subtitle}</p>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 p-3 rounded-lg"
      style={{
        border: "1px solid var(--border)",
        transition: "all var(--transition-fast)",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
        (e.currentTarget as HTMLElement).style.background = "var(--accent-light)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--bg-secondary)]">{icon}</span>
      <div>
        <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
          {title}
        </p>
        <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>{description}</p>
      </div>
    </a>
  );
}

function NewsItem({
  title,
  source,
  time,
}: {
  title: string;
  source: string;
  time: string;
}) {
  return (
    <div
      className="p-3 rounded-lg cursor-pointer"
      style={{
        background: "var(--bg-secondary)",
        transition: "background var(--transition-fast)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "var(--bg-input)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)";
      }}
    >
      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
        {title}
      </p>
      <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 2 }}>
        {source} · {time}
      </p>
    </div>
  );
}

function ActivityItem({
  action,
  target,
  time,
}: {
  action: string;
  target: string;
  time: string;
}) {
  return (
    <div
      className="flex items-center justify-between p-3 rounded-lg"
      style={{ background: "var(--bg-secondary)" }}
    >
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        {action}{" "}
        <span className="font-medium" style={{ color: "var(--text-primary)" }}>
          {target}
        </span>
      </p>
      <p style={{ color: "var(--text-muted)", fontSize: 12, whiteSpace: "nowrap", marginLeft: 16 }}>
        {time}
      </p>
    </div>
  );
}
