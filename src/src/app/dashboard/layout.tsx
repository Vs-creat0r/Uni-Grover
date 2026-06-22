"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/components/auth-provider";

import { Home, Sparkles, BookOpen, Folder, Mic, Settings, Moon, Sun, ChevronRight, ChevronLeft, LogOut, History } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
  { href: "/dashboard/generate", label: "Generate Content", icon: <Sparkles className="w-5 h-5" /> },
  { href: "/dashboard/courses", label: "Courses", icon: <BookOpen className="w-5 h-5" /> },
  { href: "/dashboard/library", label: "Content Library", icon: <Folder className="w-5 h-5" /> },
  { href: "/dashboard/live", label: "Live Presentation", icon: <Mic className="w-5 h-5" /> },
  { href: "/dashboard/sessions", label: "Session History", icon: <History className="w-5 h-5" /> },
  { href: "/dashboard/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user, profile, loading, signOut } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Redirect if not logged in or not a professor
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/login");
  };

  // Show nothing while loading auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-secondary)" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: "var(--accent)" }}></div>
          <p style={{ color: "var(--text-muted)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}
        style={{
          width: sidebarCollapsed ? "var(--sidebar-collapsed-width)" : "var(--sidebar-width)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-6">
          <div
            className="flex items-center justify-center rounded-lg font-bold text-white text-lg"
            style={{
              width: 36,
              height: 36,
              background: "var(--accent)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            U
          </div>
          {!sidebarCollapsed && (
            <span
              className="font-semibold text-lg"
              style={{ color: "var(--text-primary)" }}
            >
              Uni-Grover
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-nav-item ${
                pathname === item.href ? "active" : ""
              }`}
            >
              <span className="text-lg flex items-center justify-center">{item.icon}</span>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="flex flex-col gap-2 mt-auto pt-4 border-t" style={{ borderColor: "var(--border)" }}>
          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="sidebar-nav-item"
            title="Sign out"
          >
            <span className="text-lg flex items-center justify-center"><LogOut className="w-5 h-5" /></span>
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="sidebar-nav-item"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            <span className="text-lg flex items-center justify-center">{theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}</span>
            {!sidebarCollapsed && (
              <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
            )}
          </button>

          {/* Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="sidebar-nav-item"
          >
            <span className="text-lg flex items-center justify-center">{sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}</span>
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className="main-content flex-1 flex flex-col"
        style={{
          marginLeft: sidebarCollapsed
            ? "var(--sidebar-collapsed-width)"
            : "var(--sidebar-width)",
        }}
      >
        {/* Header */}
        <header className="header">
          <div>
            <h1
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {navItems.find((i) => i.href === pathname)?.label || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 32,
                  height: 32,
                  background: "var(--accent)",
                  color: "white",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {profile?.full_name?.charAt(0)?.toUpperCase() || "P"}
              </div>
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {profile?.full_name || "Professor"}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6" style={{ background: "var(--bg-secondary)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
