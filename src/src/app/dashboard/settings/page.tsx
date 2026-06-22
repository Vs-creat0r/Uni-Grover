"use client";

import { useTheme } from "@/components/theme-provider";
import { Settings, Moon, Sun } from "lucide-react";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <Settings className="w-6 h-6 text-[var(--accent)]" /> Settings
        </h2>
        <p style={{ color: "var(--text-secondary)", marginTop: 4 }}>
          Manage your profile, preferences, and integrations.
        </p>
      </div>

      {/* Profile Section */}
      <div className="card">
        <h3 className="text-base font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Profile
        </h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Full Name
            </label>
            <input className="input" defaultValue="Professor Dishank" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Email
            </label>
            <input className="input" defaultValue="dishank@university.edu" readOnly
              style={{ opacity: 0.7, cursor: "not-allowed" }}
            />
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Email is managed by your authentication provider.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Department / Subject
            </label>
            <input className="input" placeholder="e.g., Computer Science" />
          </div>
          <button className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
            Save Changes
          </button>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="card">
        <h3 className="text-base font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Appearance
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              Dark Mode
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Switch between light and dark themes for comfortable day and night usage.
            </p>
          </div>
          <div
            className={`toggle-switch ${theme === "dark" ? "active" : ""}`}
            onClick={toggleTheme}
          />
        </div>
        <div
          className="flex gap-3 mt-4 p-3 rounded-lg"
          style={{ background: "var(--bg-secondary)" }}
        >
          <span className="flex items-center justify-center text-xl">{theme === "dark" ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}</span>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Currently using <strong style={{ color: "var(--text-primary)" }}>{theme === "dark" ? "Dark" : "Light"} Mode</strong>.
            Your preference is saved automatically.
          </p>
        </div>
      </div>

      {/* API & Integrations */}
      <div className="card">
        <h3 className="text-base font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          API & Integrations
        </h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              OpenRouter API Key
            </label>
            <div className="flex gap-2">
              <input className="input" value="sk-or-v1-••••••••••••c83c1" readOnly
                style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}
              />
              <button className="btn btn-secondary" style={{ whiteSpace: "nowrap" }}>
                Update Key
              </button>
            </div>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Used for AI content generation. Free tier models are selected by default.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Supabase Project
            </label>
            <input className="input" value="rrmigwilieogcwyikujh.supabase.co" readOnly
              style={{ fontFamily: "var(--font-mono)", fontSize: 13, opacity: 0.7, cursor: "not-allowed" }}
            />
          </div>
        </div>
      </div>

      {/* Nudge Preferences */}
      <div className="card">
        <h3 className="text-base font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Teaching Nudges
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
          Control how and when you receive teaching improvement tips.
        </p>
        <div className="flex flex-col gap-3">
          <ToggleRow label="Show nudges on Dashboard" description="Daily teaching tip on your home page" defaultOn />
          <ToggleRow label="Show nudges during Content Generation" description="Tips while creating lesson materials" defaultOn />
          <ToggleRow label="Show nudges during Live Sessions" description="Real-time classroom behavior suggestions" defaultOn={false} />
          <ToggleRow label="Weekly email digest" description="Summary of tips and your teaching progress" defaultOn={false} />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card" style={{ borderColor: "var(--error)" }}>
        <h3 className="text-base font-semibold mb-2" style={{ color: "var(--error)" }}>
          Danger Zone
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
          Irreversible actions. Proceed with caution.
        </p>
        <div className="flex gap-3">
          <button className="btn" style={{ background: "var(--error)", color: "white" }}>
            Delete All Content
          </button>
          <button className="btn" style={{ background: "var(--error)", color: "white" }}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  defaultOn,
}: {
  label: string;
  description: string;
  defaultOn?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: "var(--bg-secondary)" }}>
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{description}</p>
      </div>
      <div className={`toggle-switch ${defaultOn ? "active" : ""}`} style={{ cursor: "pointer", flexShrink: 0 }} />
    </div>
  );
}
