"use client";

import Link from "next/link";
import { useState } from "react";
import { useChatContext } from "@/src/components/context/ChatContext";
import ReportModal from "./ReportModal";
import ProfileModal from "@/src/components/profile/ProfileModal";

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

export default function ChatHeader() {
  const { status, nextStranger, onlineCount, profile, updateProfile } =
    useChatContext();
  const [showReport, setShowReport] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const statusConfig = {
    idle:          { color: "text-zinc-400",   dot: "bg-zinc-400",                 label: "Idle" },
    searching:     { color: "text-yellow-400", dot: "bg-yellow-400 animate-pulse", label: "Searching..." },
    connected:     { color: "text-green-400",  dot: "bg-green-400",                label: "Connected" },
    disconnected:  { color: "text-red-400",    dot: "bg-red-500",                  label: "Disconnected" },
    stranger_left: { color: "text-orange-400", dot: "bg-orange-400",               label: "Stranger left" },
  };

  const s = statusConfig[status];

  // Always derived from live profile — updates immediately after save
  const avatarLetter = profile.username ? profile.username.charAt(0).toUpperCase() : "?";
  const displayName  = profile.username || "Set username";

  return (
    <>
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-6 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto gap-3">

          {/* Logo */}
          <Link href="/" className="text-xl font-black text-white tracking-tight shrink-0">
            Chat<span className="text-indigo-400">Loop</span>
          </Link>

          {/* Online count */}
          <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 shrink-0">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-semibold text-green-400">
              {formatCount(onlineCount)}
            </span>
            <span className="text-xs text-green-600 hidden sm:inline">online</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Connection status */}
            <div className={`hidden sm:flex items-center gap-2 text-sm ${s.color}`}>
              <span className={`h-2 w-2 rounded-full ${s.dot}`} />
              {s.label}
            </div>

            {status === "connected" && (
              <button
                onClick={() => setShowReport(true)}
                className="rounded-lg border border-red-800 bg-red-950/60 px-3 py-2 text-sm text-red-400 hover:bg-red-900/60 transition-colors"
              >
                Report
              </button>
            )}

            <button
              onClick={nextStranger}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500 transition-colors font-medium"
            >
              Next →
            </button>

            {/* Profile avatar — always shows live username */}
            <button
              onClick={() => setShowProfile(true)}
              title={displayName}
              className="group relative flex items-center gap-2 rounded-full bg-zinc-800 border border-zinc-700 hover:border-indigo-500 hover:bg-zinc-700 transition-all pl-1 pr-3 py-1 shrink-0"
            >
              <div className="h-7 w-7 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                {avatarLetter}
              </div>
              <span className="text-sm text-zinc-300 max-w-[100px] truncate hidden sm:block">
                {displayName}
              </span>
              {/* Edit pencil icon */}
              <svg
                className="h-3 w-3 text-zinc-500 hidden sm:block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z"
                />
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