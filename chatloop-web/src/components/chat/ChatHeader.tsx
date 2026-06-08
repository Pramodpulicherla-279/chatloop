"use client";

import Link from "next/link";
import { useState } from "react";
import { useChatContext } from "@/src/components/context/ChatContext";
import { useTheme } from "@/src/components/theme/ThemeProvider";
import ReportModal from "./ReportModal";
import ProfileModal from "@/src/components/profile/ProfileModal";

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

const SunIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="5" />
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

export default function ChatHeader() {
  const { status, nextStranger, onlineCount, maleCount, femaleCount, profile, updateProfile } =
    useChatContext();
  const { theme, toggleTheme } = useTheme();
  const [showReport, setShowReport] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const avatarLetter = profile.username ? profile.username.charAt(0).toUpperCase() : "?";
  const displayName = profile.username || "Set username";

  const genderGradient =
    profile.gender === "male"
      ? "from-blue-600 to-blue-400"
      : profile.gender === "female"
      ? "from-pink-600 to-pink-400"
      : "from-violet-600 to-indigo-400";

  return (
    <>
      <header className="border-b border-border dark:bg-zinc-950/80 bg-white/80 glass sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 py-3 gap-3">

          {/* Logo */}
          <Link href="/" className="text-xl font-black tracking-tight shrink-0">
            <span className="gradient-text">Chat</span>
            <span className="text-foreground">Loop</span>
          </Link>

          {/* Stats pills */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Online */}
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400">{formatCount(onlineCount)}</span>
              <span className="text-xs text-emerald-600 hidden sm:inline">online</span>
            </div>
            {/* Male */}
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1.5">
              <span className="text-xs">♂</span>
              <span className="text-xs font-bold text-blue-400">{formatCount(maleCount)}</span>
            </div>
            {/* Female */}
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1.5">
              <span className="text-xs">♀</span>
              <span className="text-xs font-bold text-pink-400">{formatCount(femaleCount)}</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="rounded-xl border border-border p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>

            {status === "connected" && (
              <button
                onClick={() => setShowReport(true)}
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400 hover:bg-red-500/20 transition-colors font-medium hidden sm:block"
              >
                Report
              </button>
            )}

            <button
              onClick={nextStranger}
              className="rounded-xl gradient-brand px-4 py-2 text-sm text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20"
            >
              Next →
            </button>

            {/* Profile avatar */}
            <button
              onClick={() => setShowProfile(true)}
              title={displayName}
              className="group flex items-center gap-2 rounded-full border border-border hover:border-violet-500/50 hover:bg-muted transition-all pl-1 pr-3 py-1 shrink-0"
            >
              <div
                className={`h-7 w-7 rounded-full bg-gradient-to-br ${genderGradient} flex items-center justify-center text-white font-bold text-xs shadow`}
              >
                {avatarLetter}
              </div>
              <span className="text-sm text-foreground max-w-[80px] truncate hidden sm:block font-medium">
                {displayName}
              </span>
              <svg
                className="h-3 w-3 text-muted-foreground hidden sm:block"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {showReport && <ReportModal onClose={() => setShowReport(false)} />}
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
