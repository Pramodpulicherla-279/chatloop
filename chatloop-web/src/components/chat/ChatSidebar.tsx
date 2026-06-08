"use client";

import { useState } from "react";
import { useChatContext } from "@/src/components/context/ChatContext";
import { useTheme } from "@/src/components/theme/ThemeProvider";
import ProfileModal from "@/src/components/profile/ProfileModal";

const genderConfig = {
  male:   { label: "Male",   color: "text-blue-400",  bg: "bg-blue-500/10 border-blue-500/30",  icon: "♂" },
  female: { label: "Female", color: "text-pink-400",  bg: "bg-pink-500/10 border-pink-500/30",  icon: "♀" },
  other:  { label: "Other",  color: "text-violet-400",bg: "bg-violet-500/10 border-violet-500/30", icon: "⚧" },
  "":     { label: "Not set",color: "text-muted-foreground", bg: "bg-muted border-border", icon: "?" },
};

const rules = [
  { icon: "✓", text: "Be respectful to everyone" },
  { icon: "✓", text: "No harassment or hate speech" },
  { icon: "✓", text: "No spam or self-promotion" },
  { icon: "✓", text: "Report violations immediately" },
  { icon: "✓", text: "Have fun and be kind!" },
];

export default function ChatSidebar() {
  const { profile, updateProfile, onlineCount, maleCount, femaleCount } = useChatContext();
  const { theme, toggleTheme } = useTheme();
  const [showProfile, setShowProfile] = useState(false);

  const avatarLetter = profile.username ? profile.username.charAt(0).toUpperCase() : "?";
  const gender = (profile.gender || "") as keyof typeof genderConfig;
  const gCfg = genderConfig[gender] ?? genderConfig[""];

  const genderGradient =
    gender === "male"
      ? "from-blue-600 to-blue-400"
      : gender === "female"
      ? "from-pink-600 to-pink-400"
      : "from-violet-600 to-indigo-400";

  const femaleCount_ = femaleCount;
  const otherCount = onlineCount - maleCount - femaleCount_;

  return (
    <>
      <aside className="hidden w-72 border-r border-border bg-sidebar flex-col gap-5 p-5 lg:flex overflow-y-auto">

        {/* Profile card */}
        <div className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${genderGradient} flex items-center justify-center text-white font-black text-lg shadow-lg flex-shrink-0`}
            >
              {avatarLetter}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-foreground truncate">{profile.username || "Anonymous"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {profile.country || "Location not set"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1 rounded-full border text-xs font-medium px-2.5 py-1 ${gCfg.bg} ${gCfg.color}`}>
              <span>{gCfg.icon}</span> {gCfg.label}
            </span>
            {profile.age && (
              <span className="inline-flex items-center rounded-full border border-border bg-muted text-xs font-medium px-2.5 py-1 text-muted-foreground">
                {profile.age} yrs
              </span>
            )}
          </div>

          <button
            onClick={() => setShowProfile(true)}
            className="w-full rounded-xl border border-border py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            Edit Profile
          </button>
        </div>

        {/* Live stats */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Live Stats
          </p>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-center">
              <p className="text-lg font-black text-emerald-400">{onlineCount}</p>
              <p className="text-[10px] text-emerald-600 font-medium">Online</p>
            </div>
            <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-2.5 text-center">
              <p className="text-lg font-black text-blue-400">{maleCount}</p>
              <p className="text-[10px] text-blue-600 font-medium">Male</p>
            </div>
            <div className="rounded-xl bg-pink-500/10 border border-pink-500/20 p-2.5 text-center">
              <p className="text-lg font-black text-pink-400">{femaleCount_}</p>
              <p className="text-[10px] text-pink-600 font-medium">Female</p>
            </div>
          </div>
          {otherCount > 0 && (
            <p className="text-center text-xs text-muted-foreground mt-2">
              +{otherCount} others online
            </p>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 hover:bg-muted transition-all group"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">{theme === "dark" ? "🌙" : "☀️"}</span>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">
                {theme === "dark" ? "Dark Mode" : "Light Mode"}
              </p>
              <p className="text-xs text-muted-foreground">Click to toggle</p>
            </div>
          </div>
          <div className={`relative h-6 w-11 rounded-full transition-colors ${theme === "dark" ? "bg-violet-600" : "bg-muted border border-border"}`}>
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${theme === "dark" ? "translate-x-5" : "translate-x-0.5"}`}
            />
          </div>
        </button>

        {/* Rules */}
        <div className="rounded-2xl border border-border bg-card p-4 flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Community Rules
          </p>
          <ul className="space-y-2">
            {rules.map((rule, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-violet-400 font-bold shrink-0 mt-0.5">{rule.icon}</span>
                {rule.text}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-center text-[11px] text-muted-foreground pb-1">
          © 2025 ChatLoop · Free & Anonymous
        </p>
      </aside>

      {showProfile && (
        <ProfileModal
          profile={profile}
          onSave={updateProfile}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  );
}
