"use client";

import { useState, KeyboardEvent } from "react";
import { useChatContext } from "@/src/components/context/ChatContext";

const SendIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
  </svg>
);

export default function MessageInput() {
  const { sendMessage, nextStranger, status, sendTyping } = useChatContext();
  const [text, setText] = useState("");

  const isConnected = status === "connected";

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || !isConnected) return;
    sendMessage(trimmed);
    setText("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    sendTyping();
  };

  return (
    <div className="border-t border-border bg-background/80 glass p-4">
      <div className="flex gap-3 items-center max-w-screen-xl mx-auto">
        <input
          type="text"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={!isConnected}
          placeholder={
            isConnected
              ? "Type a message... (Enter to send)"
              : status === "searching"
              ? "Connecting to a stranger..."
              : "Not connected"
          }
          className="flex-1 rounded-2xl border border-border bg-card px-5 py-3 text-foreground text-sm outline-none placeholder:text-muted-foreground focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        />

        <button
          onClick={handleSend}
          disabled={!isConnected || !text.trim()}
          className="rounded-2xl gradient-brand p-3 text-white hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
          title="Send"
        >
          <SendIcon />
        </button>

        <button
          onClick={nextStranger}
          className="rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground font-medium hover:text-foreground hover:bg-muted transition-all hidden sm:block"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
