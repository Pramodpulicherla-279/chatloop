"use client";

import { useEffect, useRef } from "react";
import { useChatContext } from "@/src/components/context/ChatContext";
import MessageBubble from "./MessageBubble";

function TypingBubble() {
  return (
    <div className="flex items-end gap-2">
      <div className="rounded-2xl rounded-bl-sm bg-card border border-border px-4 py-3 flex items-center gap-1.5 shadow-sm">
        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}

export default function MessageList() {
  const { messages, status, isTyping, nextStranger } = useChatContext();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (status === "searching") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center p-6">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl">💬</span>
          </div>
        </div>
        <div>
          <p className="text-foreground font-bold text-xl">Finding a stranger</p>
          <p className="text-muted-foreground text-sm mt-2">Connecting you with someone new...</p>
        </div>
      </div>
    );
  }

  if (status === "idle") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center p-6">
        <div className="h-20 w-20 rounded-3xl gradient-brand flex items-center justify-center shadow-2xl shadow-violet-500/30 text-4xl">
          💬
        </div>
        <div>
          <p className="text-foreground font-bold text-2xl">Welcome to ChatLoop</p>
          <p className="text-muted-foreground text-sm mt-2 max-w-xs">
            Chat anonymously with strangers from around the world. Press{" "}
            <strong className="text-foreground">Next →</strong> to start.
          </p>
        </div>
        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
          <span>🔒 Anonymous</span>
          <span>⚡ Instant</span>
          <span>🌍 Global</span>
        </div>
      </div>
    );
  }

  if (status === "stranger_left") {
    return (
      <div className="flex flex-1 flex-col overflow-y-auto p-5">
        {messages.length > 0 && (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div className="border-t border-border my-4" />
          </>
        )}
        <div className="flex flex-col items-center justify-center gap-4 text-center py-8">
          <div className="text-5xl">👋</div>
          <div>
            <p className="text-foreground font-bold text-lg">Stranger has left</p>
            <p className="text-muted-foreground text-sm mt-1">Hope you had a good chat!</p>
          </div>
          <button
            onClick={nextStranger}
            className="rounded-xl gradient-brand px-6 py-2.5 text-sm text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20 mt-2"
          >
            Find Next Stranger →
          </button>
        </div>
      </div>
    );
  }

  // connected — with or without messages
  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <div className="text-5xl animate-bounce">👋</div>
          <div>
            <p className="text-foreground font-bold text-lg">You&apos;re connected!</p>
            <p className="text-muted-foreground text-sm mt-1">Say hello to your new stranger</p>
          </div>
        </div>
      ) : (
        messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))
      )}

      {isTyping && <TypingBubble />}
      <div ref={bottomRef} />
    </div>
  );
}
