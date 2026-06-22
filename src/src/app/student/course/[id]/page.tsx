import { BookOpen, CheckCircle, Hammer, Puzzle, Rocket, FlaskConical, Target, ChevronLeft } from "lucide-react";

const MOCK_COURSE = {
  title: "CS-201: Data Structures",
  professor: "Prof. Sharma",
  description: "Fundamental data structures and algorithms for second-year students.",
  topics: [
    { id: "t1", title: "Arrays & Strings", audience: "Beginner", completed: true },
    { id: "t2", title: "Linked Lists", audience: "Intermediate", completed: true },
    { id: "t3", title: "Stacks & Queues", audience: "Beginner", completed: true },
    { id: "t4", title: "Binary Search Trees", audience: "Intermediate", completed: false },
    { id: "t5", title: "Graph Traversal (BFS/DFS)", audience: "Advanced", completed: false },
    { id: "t6", title: "Sorting Algorithms", audience: "Beginner", completed: false },
  ],
  exploreChallenges: [
    { icon: <Hammer className="w-8 h-8 text-orange-500" />, title: "Build a Stack-based Calculator", difficulty: "Easy", time: "15 min" },
    { icon: <Puzzle className="w-8 h-8 text-blue-500" />, title: "Implement LRU Cache using a Linked List", difficulty: "Medium", time: "45 min" },
    { icon: <Rocket className="w-8 h-8 text-purple-500" />, title: "Build a Social Network Graph Analyzer", difficulty: "Hard", time: "2 hours" },
  ],
  careers: [
    { title: "Software Engineer", companies: "Google, Microsoft, Amazon" },
    { title: "Data Scientist", companies: "Meta, Netflix, Uber" },
    { title: "Game Developer", companies: "Unity, Epic Games, EA" },
  ],
};

export default function StudentCoursePage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <a href="/student" className="flex items-center gap-1" style={{ color: "var(--accent)", textDecoration: "none" }}><ChevronLeft className="w-4 h-4" /> Dashboard</a>
        <span style={{ color: "var(--text-muted)" }}>/</span>
        <span style={{ color: "var(--text-secondary)" }}>{MOCK_COURSE.title}</span>
      </div>

      {/* Course Header */}
      <div className="card">
        <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          {MOCK_COURSE.title}
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          {MOCK_COURSE.professor} · {MOCK_COURSE.description}
        </p>
        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 h-2 rounded-full" style={{ background: "var(--bg-input)", maxWidth: 300 }}>
            <div className="h-2 rounded-full" style={{ width: "50%", background: "var(--success)" }} />
          </div>
          <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
            3 of 6 topics completed
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topics */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <BookOpen className="w-5 h-5 text-[var(--accent)]" /> Topics
            </h3>
            <div className="flex flex-col gap-2">
              {MOCK_COURSE.topics.map((t) => (
                <a
                  key={t.id}
                  href={`/student/topic/${t.id}`}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{
                    background: "var(--bg-secondary)",
                    textDecoration: "none",
                    transition: "background var(--transition-fast)",
                    opacity: t.completed ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-input)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)"; }}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center text-lg">{t.completed ? <CheckCircle className="w-5 h-5 text-[var(--success)]" /> : <BookOpen className="w-5 h-5 text-[var(--accent)]" />}</span>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)", textDecoration: t.completed ? "line-through" : "none" }}>
                      {t.title}
                    </p>
                  </div>
                  <span
                    className="text-xs font-medium px-2 py-1 rounded-full"
                    style={{
                      background: t.audience === "Beginner" ? "var(--success)" : t.audience === "Advanced" ? "var(--error)" : "var(--accent)",
                      color: "white", opacity: 0.9,
                    }}
                  >
                    {t.audience}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Explore Mode */}
          <div className="card mt-4">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <FlaskConical className="w-5 h-5 text-[var(--accent)]" /> Explore Mode — Build Something!
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {MOCK_COURSE.exploreChallenges.map((c, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg cursor-pointer"
                  style={{
                    border: "1px solid var(--border)",
                    transition: "all var(--transition-fast)",
                    textAlign: "center",
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
                  <span className="flex items-center justify-center mb-4">{c.icon}</span>
                  <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{c.title}</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{c.difficulty}</span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>·</span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{c.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Career Paths */}
        <div className="card" style={{ alignSelf: "start" }}>
          <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <Target className="w-5 h-5 text-[var(--accent)]" /> Career Paths
          </h3>
          <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
            Where this knowledge takes you:
          </p>
          <div className="flex flex-col gap-3">
            {MOCK_COURSE.careers.map((c, i) => (
              <div key={i} className="p-3 rounded-lg" style={{ background: "var(--bg-secondary)" }}>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{c.title}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{c.companies}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
