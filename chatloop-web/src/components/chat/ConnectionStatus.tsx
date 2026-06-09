"use client";

import { useChatContext } from "@/src/components/context/ChatContext";

const genderBadge = (gender: string) => {
  if (gender === "male")
    return <span className="rounded-full border border-blue-500/40 bg-blue-500/15 px-2 py-0.5 text-xs font-semibold text-blue-400">♂ Male</span>;
  if (gender === "female")
    return <span className="rounded-full border border-pink-500/40 bg-pink-500/15 px-2 py-0.5 text-xs font-semibold text-pink-400">♀ Female</span>;
  if (gender === "other")
    return <span className="rounded-full border border-violet-500/40 bg-violet-500/15 px-2 py-0.5 text-xs font-semibold text-violet-400">⚧ Other</span>;
  return null;
};

const avatarGradient = (gender: string) =>
  gender === "male"
    ? "from-blue-600 to-blue-400"
    : gender === "female"
    ? "from-pink-600 to-pink-400"
    : "from-violet-600 to-indigo-400";

export default function ConnectionStatus() {
  const { status, isTyping, nextStranger, strangerProfile } = useChatContext();

  if (status === "connected" && isTyping) {
    return (
      <div className="border-b border-border bg-card/60 glass px-4 py-2">
        <p className="text-sm text-violet-400 flex items-center gap-2">
          <span className="flex gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0ms]" />
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:150ms]" />
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:300ms]" />
          </span>
          <span className="font-semibold text-violet-300">
            {strangerProfile?.username ?? "Stranger"}
          </span>
          &nbsp;is typing...
        </p>
      </div>
    );
  }

  if (status === "connected") {
    const name    = strangerProfile?.username || "Stranger";
    const age     = strangerProfile?.age     || null;
    const gender  = strangerProfile?.gender  || "";
    const country = strangerProfile?.country || null;

    return (
      <div className="border-b border-border bg-card/60 glass px-4 py-2">
        <div className="flex items-center gap-3">
          <div
            className={`h-8 w-8 rounded-xl bg-gradient-to-br ${avatarGradient(gender)} flex items-center justify-center text-white text-xs font-black shadow-md shrink-0`}
          >
            {name.charAt(0).toUpperCase()}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-foreground">{name}</span>

            {genderBadge(gender)}

            {age && (
              <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {age} yrs
              </span>
            )}

            {country && (
              <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                📍 {country}
              </span>
            )}

            <span className="text-xs text-emerald-500 flex items-center gap-1 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (status === "stranger_left") {
    return (
      <div className="border-b border-border bg-card/60 glass px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange-400" />
            <p className="text-sm text-orange-400 font-medium">Stranger has left the chat.</p>
          </div>
          <button
            onClick={nextStranger}
            className="text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors"
          >
            Find new stranger →
          </button>
        </div>
      </div>
    );
  }

  if (status === "searching") {
    return (
      <div className="border-b border-border bg-card/60 glass px-4 py-2">
        <p className="text-sm text-yellow-400 flex items-center gap-2 font-medium">
          <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
          Searching for a stranger...
        </p>
      </div>
    );
  }

  if (status === "disconnected") {
    return (
      <div className="border-b border-border bg-card/60 glass px-4 py-2">
        <p className="text-sm text-red-400 flex items-center gap-2 font-medium">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          Connection lost. Reconnecting...
        </p>
      </div>
    );
  }

  return (
    <div className="border-b border-border bg-card/60 glass px-4 py-2">
      <p className="text-sm text-muted-foreground">
        Press <strong className="text-foreground font-semibold">Next →</strong> to find a stranger
      </p>
    </div>
  );
}
