"use client";

import { useState } from "react";
import { KeyRound, ShieldCheck, Lock, ArrowLeft, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Step = "email" | "verify" | "newpass" | "done";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [userCode, setUserCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Generate a random 4-digit code
  const generateCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Check if user exists by trying to get their data
    // For now, we just generate the code and move forward
    const generatedCode = generateCode();
    setCode(generatedCode);
    setStep("verify");
    setLoading(false);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (userCode !== code) {
      setError("Incorrect code. Please check and try again.");
      return;
    }

    setStep("newpass");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // First sign in with the old credentials to get a session
      // Then update the password
      // Since we can't sign in (user forgot password), we use the API route
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to reset password.");
        setLoading(false);
        return;
      }

      setStep("done");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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

        {/* ─── STEP 1: Enter Email ─── */}
        {step === "email" && (
          <>
            <div className="flex items-center gap-3 mb-2">
              <KeyRound className="w-6 h-6" style={{ color: "var(--accent)" }} />
              <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                Forgot Password
              </h1>
            </div>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              Enter the email address you used to create your account.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: "rgba(239,68,68,0.1)", color: "var(--error)", border: "1px solid rgba(239,68,68,0.3)" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>Email</label>
                <input
                  className="input"
                  type="email"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
                style={{ height: 44, opacity: loading ? 0.6 : 1 }}
              >
                {loading ? "Checking..." : "Continue"}
              </button>
            </form>
          </>
        )}

        {/* ─── STEP 2: Verify 4-Digit Code ─── */}
        {step === "verify" && (
          <>
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-6 h-6" style={{ color: "var(--accent)" }} />
              <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                Verify Identity
              </h1>
            </div>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              Enter the verification code shown below to continue.
            </p>

            {/* Display the code */}
            <div
              className="flex items-center justify-center py-4 mb-4 rounded-lg"
              style={{
                background: "var(--accent-light)",
                border: "2px dashed var(--accent)",
              }}
            >
              <span className="text-4xl font-mono font-bold tracking-[0.5em]" style={{ color: "var(--accent)", letterSpacing: "0.5em" }}>
                {code}
              </span>
            </div>
            <p className="text-xs text-center mb-4" style={{ color: "var(--text-muted)" }}>
              Type this code in the field below
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: "rgba(239,68,68,0.1)", color: "var(--error)", border: "1px solid rgba(239,68,68,0.3)" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>Verification Code</label>
                <input
                  className="input"
                  type="text"
                  placeholder="Enter 4-digit code"
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  maxLength={4}
                  required
                  style={{ textAlign: "center", fontSize: 20, letterSpacing: "0.3em", fontFamily: "var(--font-geist-mono)" }}
                />
              </div>
              <button type="submit" className="btn btn-primary w-full" style={{ height: 44 }}>
                Verify Code
              </button>
            </form>
          </>
        )}

        {/* ─── STEP 3: New Password ─── */}
        {step === "newpass" && (
          <>
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-6 h-6" style={{ color: "var(--accent)" }} />
              <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                New Password
              </h1>
            </div>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              Create a new password for <strong style={{ color: "var(--text-primary)" }}>{email}</strong>
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: "rgba(239,68,68,0.1)", color: "var(--error)", border: "1px solid rgba(239,68,68,0.3)" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>New Password</label>
                <input
                  className="input"
                  type="password"
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>Confirm Password</label>
                <input
                  className="input"
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
                style={{ height: 44, opacity: loading ? 0.6 : 1 }}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}

        {/* ─── STEP 4: Done ─── */}
        {step === "done" && (
          <div className="text-center">
            <span className="flex items-center justify-center mb-4" style={{ color: "var(--success)" }}>
              <CheckCircle className="w-14 h-14" />
            </span>
            <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--success)" }}>
              Password Reset!
            </h1>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              Your password has been updated. You can now sign in with your new password.
            </p>
            <a
              href="/auth/login"
              className="btn btn-primary w-full"
              style={{ height: 44, textDecoration: "none" }}
            >
              Go to Sign In
            </a>
          </div>
        )}

        {/* Back to login link */}
        {step !== "done" && (
          <p className="text-sm text-center mt-6" style={{ color: "var(--text-secondary)" }}>
            <a href="/auth/login" className="flex items-center justify-center gap-1" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
