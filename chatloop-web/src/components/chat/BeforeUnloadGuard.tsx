"use client";

import { useEffect } from "react";
import { useChatContext } from "@/src/components/context/ChatContext";

export default function BeforeUnloadGuard() {
  const { status } = useChatContext();

  useEffect(() => {
    if (status !== "connected") return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Chrome requires returnValue to be set
      e.returnValue = "You are in an active chat. Are you sure you want to leave?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [status]);

  return null;
}
