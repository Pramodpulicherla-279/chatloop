"use client";

import { useChatContext } from "@/src/components/context/ChatContext";

export default function ConnectionStatus() {
  const { status, isTyping, nextStranger, strangerProfile } = useChatContext();

  // Typing indicator (highest priority)
  if (status === "connected" && isTyping) {
    return (
      <div className="border-b border-zinc-800 bg-zinc-900/60 px-6 py-2.5">
        <p className="text-sm text-indigo-400 flex items-center gap-2">
          <span className="flex gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0ms]" />
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:150ms]" />
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:300ms]" />
          </span>
          <span className="font-medium text-indigo-300">
            {strangerProfile?.username ?? "Stranger"}
          </span>
          &nbsp;is typing...
        </p>
      </div>
    );
  }

  // Connected — always show stranger bar (with fallback if profile missing)
  if (status === "connected") {
    const name    = strangerProfile?.username || "Stranger";
    const age     = strangerProfile?.age || null;
    const country = strangerProfile?.country || null;

    return (
      <div className="border-b border-zinc-800 bg-zinc-900/60 px-6 py-2.5">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="h-7 w-7 rounded-full bg-indigo-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {name.charAt(0).toUpperCase()}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-white">{name}</span>

            {age && (
              <span className="text-xs text-zinc-400 bg-zinc-800 rounded-full px-2 py-0.5">
                {age} yrs
              </span>
            )}

            {country && (
              <span className="text-xs text-zinc-400 bg-zinc-800 rounded-full px-2 py-0.5">
                📍 {country}
              </span>
            )}

            <span className="text-xs text-green-500 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              connected
            </span>
          </div>
        </div>
      </div>
    );
  }

  // All other states
  if (status === "stranger_left") {
    return (
      <div className="border-b border-zinc-800 bg-zinc-900/60 px-6 py-2.5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-orange-400">Stranger has disconnected.</p>
          <button
            onClick={nextStranger}
            className="text-sm text-indigo-400 hover:text-indigo-300 underline"
          >
            Find new stranger →
          </button>
        </div>
      </div>
    );
  }

  if (status === "searching") {
    return (
      <div className="border-b border-zinc-800 bg-zinc-900/60 px-6 py-2.5">
        <p className="text-sm text-yellow-400 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
          Looking for a stranger...
        </p>
      </div>
    );
  }

  if (status === "disconnected") {
    return (
      <div className="border-b border-zinc-800 bg-zinc-900/60 px-6 py-2.5">
        <p className="text-sm text-red-400 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          Connection lost. Reconnecting...
        </p>
      </div>
    );
  }

  // idle
  return (
    <div className="border-b border-zinc-800 bg-zinc-900/60 px-6 py-2.5">
      <p className="text-sm text-zinc-500">
        Press <strong className="text-zinc-300">Next</strong> to find a stranger
      </p>
    </div>
  );
}