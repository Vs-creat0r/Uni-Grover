"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn, profile } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await signIn(email, password);

    if (authError) {
      setError(authError);
      setLoading(false);
      return;
    }

    // Wait a moment for profile to load, then redirect based on role
    setTimeout(async () => {
      // Fetch profile to determine role
      const { supabase } = await import("@/lib/supabase");
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        if (prof?.role === "student") {
          router.push("/student");
        } else {
          router.push("/dashboard");
        }
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="card animate-fade-in w-full" style={{ maxWidth: 420, padding: 32 }}>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="flex items-center justify-center rounded-lg font-bold text-white text-lg"
            style={{ width: 40, height: 40, background: "var(--accent)", borderRadius: "var(--radius-sm)" }}
          >
            U
          </div>
          <span className="font-semibold text-xl" style={{ color: "var(--text-primary)" }}>
            Uni-Grover
          </span>
        </div>

        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
          Welcome back
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          Sign in to your account to continue.
        </p>

        {error && (
          <div
            className="mb-4 p-3 rounded-lg text-sm"
            style={{ background: "rgba(239,68,68,0.1)", color: "var(--error)", border: "1px solid rgba(239,68,68,0.3)" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
              Email
            </label>
            <input
              className="input"
              type="email"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
              Password
            </label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
            style={{ height: 44, opacity: loading ? 0.6 : 1 }}
          >
          {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-center mt-3">
          <a href="/auth/forgot-password" style={{ color: "var(--text-muted)", textDecoration: "none", fontWeight: 500 }}>
            Forgot password?
          </a>
        </p>

        <p className="text-sm text-center mt-6" style={{ color: "var(--text-secondary)" }}>
          Don&apos;t have an account?{" "}
          <a href="/auth/signup" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}
