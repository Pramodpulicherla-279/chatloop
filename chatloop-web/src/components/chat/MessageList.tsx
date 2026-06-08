"use client";

import { useEffect, useRef } from "react";
import { useChatContext } from "@/src/components/context/ChatContext";
import MessageBubble from "./MessageBubble";

export default function MessageList() {
  const { messages, status } = useChatContext();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (status === "searching") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center p-6">
        <div className="h-12 w-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
        <div>
          <p className="text-white font-semibold text-lg">Finding a stranger</p>
          <p className="text-zinc-500 text-sm mt-1">Connecting you with someone new...</p>
        </div>
      </div>
    );
  }

  if (status === "idle") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center p-6">
        <div className="text-5xl">💬</div>
        <p className="text-white font-semibold text-lg">Ready to chat?</p>
        <p className="text-zinc-500 text-sm">
          Click <strong className="text-zinc-300">Next</strong> to find a stranger
        </p>
      </div>
    );
  }

  if (messages.length === 0 && status === "connected") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center p-6">
        <div className="text-5xl">👋</div>
        <p className="text-white font-semibold">You&apos;re connected!</p>
        <p className="text-zinc-500 text-sm">Say hello to your new stranger</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-6">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}