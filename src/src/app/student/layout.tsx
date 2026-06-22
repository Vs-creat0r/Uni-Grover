"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/components/auth-provider";
import { Home, BookOpen, Mic, Folder, Settings, GraduationCap, Moon, Sun, ChevronRight, ChevronLeft, Flame, LogOut } from "lucide-react";

const studentNavItems = [
  { href: "/student", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
  { href: "/student/courses", label: "My Courses", icon: <BookOpen className="w-5 h-5" /> },
  { href: "/student/live", label: "Live Sessions", icon: <Mic className="w-5 h-5" /> },
  { href: "/student/portfolio", label: "Portfolio", icon: <Folder className="w-5 h-5" /> },
  { href: "/student/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user, profile, loading, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Redirect if not logged in or not a student
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/login");
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-secondary)" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: "var(--success)" }}></div>
          <p style={{ color: "var(--text-muted)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen">
      {/* Student Sidebar — green accent variant */}
      <aside
        className="sidebar"
        style={{
          width: collapsed ? "var(--sidebar-collapsed-width)" : "var(--sidebar-width)",
        }}
      >
        <div className="flex items-center gap-3 px-2 mb-6">
          <div
            className="flex items-center justify-center rounded-lg font-bold text-white text-lg"
            style={{ width: 36, height: 36, background: "var(--success)", borderRadius: "var(--radius-sm)" }}
          >
            U
          </div>
          {!collapsed && (
            <span className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>
              Uni-Grover
            </span>
          )}
        </div>

        {/* Student badge */}
        {!collapsed && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4"
            style={{ background: "var(--bg-input)" }}
          >
            <GraduationCap className="w-4 h-4 text-[var(--success)]" />
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Student Portal</span>
          </div>
        )}

        <nav className="flex flex-col gap-1 flex-1">
          {studentNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-nav-item ${pathname === item.href ? "active" : ""}`}
              style={pathname === item.href ? { background: "#dcfce7", color: "#16a34a" } : {}}
            >
              <span className="flex items-center justify-center text-lg">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2 mt-auto pt-4 border-t" style={{ borderColor: "var(--border)" }}>
          {/* Sign Out */}
          <button onClick={handleSignOut} className="sidebar-nav-item" title="Sign out">
            <span className="flex items-center justify-center text-lg"><LogOut className="w-5 h-5" /></span>
            {!collapsed && <span>Sign Out</span>}
          </button>
          <button onClick={toggleTheme} className="sidebar-nav-item" title="Toggle theme">
            <span className="flex items-center justify-center text-lg">{theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}</span>
            {!collapsed && <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>}
          </button>
          <button onClick={() => setCollapsed(!collapsed)} className="sidebar-nav-item">
            <span className="flex items-center justify-center text-lg">{collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}</span>
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      <div
        className="flex-1 flex flex-col"
        style={{ marginLeft: collapsed ? "var(--sidebar-collapsed-width)" : "var(--sidebar-width)", transition: "margin-left var(--transition-normal)" }}
      >
        <header className="header">
          <h1 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            {studentNavItems.find((i) => i.href === pathname)?.label || "Student Portal"}
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: "var(--bg-input)" }}>
              <Flame className="w-4 h-4 text-orange-500 fill-current" />
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>5 day streak</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="flex items-center justify-center rounded-full"
                style={{ width: 32, height: 32, background: "var(--success)", color: "white", fontSize: 14, fontWeight: 600 }}
              >
                {profile?.full_name?.charAt(0)?.toUpperCase() || "S"}
              </div>
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {profile?.full_name || "Student"}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6" style={{ background: "var(--bg-secondary)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
