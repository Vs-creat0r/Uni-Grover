"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"professor" | "student">("professor");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await signUp(email, password, fullName, role);

    if (authError) {
      setError(authError);
      setLoading(false);
      return;
    }

    setSuccess(true);
    // Auto-redirect after signup
    setTimeout(() => {
      router.push(role === "professor" ? "/dashboard" : "/student");
    }, 1500);
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
          Create your account
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          Join Uni-Grover to transform how you teach or learn.
        </p>

        {error && (
          <div
            className="mb-4 p-3 rounded-lg text-sm"
            style={{ background: "rgba(239,68,68,0.1)", color: "var(--error)", border: "1px solid rgba(239,68,68,0.3)" }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="mb-4 p-3 rounded-lg text-sm"
            style={{ background: "rgba(34,197,94,0.1)", color: "var(--success)", border: "1px solid rgba(34,197,94,0.3)" }}
          >
            ✅ Account created successfully! Redirecting...
          </div>
        )}

        {/* Role Selector */}
        <div className="flex gap-2 mb-6">
          <button
            className={`btn flex-1 ${role === "professor" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setRole("professor")}
            type="button"
          >
            👨‍🏫 I&apos;m a Professor
          </button>
          <button
            className={`btn flex-1 ${role === "student" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setRole("student")}
            type="button"
          >
            🎓 I&apos;m a Student
          </button>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
              Full Name
            </label>
            <input
              className="input"
              type="text"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
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
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading || success}
            style={{ height: 44, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Creating account..." : success ? "Redirecting..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-center mt-6" style={{ color: "var(--text-secondary)" }}>
          Already have an account?{" "}
          <a href="/auth/login" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
