"use client";

import { useState, KeyboardEvent } from "react";
import { useChatContext } from "@/src/components/context/ChatContext";

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
    <div className="border-t border-zinc-800 bg-zinc-950 p-4">
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
              ? "Connecting..."
              : "Not connected"
          }
          className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white text-sm outline-none placeholder:text-zinc-600 focus:border-indigo-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        />

        <button
          onClick={handleSend}
          disabled={!isConnected || !text.trim()}
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm text-white font-medium hover:bg-indigo-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Send
        </button>

        <button
          onClick={nextStranger}
          className="rounded-xl bg-zinc-800 border border-zinc-700 px-5 py-3 text-sm text-zinc-300 font-medium hover:bg-zinc-700 transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
}