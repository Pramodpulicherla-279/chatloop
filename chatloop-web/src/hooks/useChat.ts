"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { socket } from "@/lib/socket";
import { Profile } from "@/src/hooks/useProfile";

export type MessageType = {
  id: string;
  text: string;
  sender: "me" | "stranger";
  timestamp: Date;
};

export type ChatStatus =
  | "idle"
  | "searching"
  | "connected"
  | "disconnected"
  | "stranger_left";

export type StrangerProfile = {
  username: string;
  age: string;
  country: string;
};

export function useChat(profile: Profile) {
  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [isTyping, setIsTyping] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [strangerProfile, setStrangerProfile] = useState<StrangerProfile | null>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const profileRef = useRef(profile);

  // Keep ref always up to date
  useEffect(() => {
    profileRef.current = profile;
    if (socket.connected && profile.username) {
      socket.emit("set-profile", profile);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.username, profile.age, profile.country]);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      setStatus("searching");
      // Emit profile first, then find-match on next tick
      // (no callback needed — both go in same event loop flush, profile arrives first)
      socket.emit("set-profile", profileRef.current);
      socket.emit("find-match");
    });

    socket.on("online-count", (data: { count: number }) => {
      setOnlineCount(data.count);
    });

    socket.on("match-found", (data: { roomId: string; strangerProfile: StrangerProfile }) => {
      console.log("Matched! Stranger:", data.strangerProfile);
      setRoomId(data.roomId);
      setStrangerProfile(data.strangerProfile);
      setStatus("connected");
      setMessages([]);
    });

    socket.on("receive-message", (data: { message: string }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: data.message,
          sender: "stranger",
          timestamp: new Date(),
        },
      ]);
    });

    socket.on("typing", () => {
      setIsTyping(true);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => setIsTyping(false), 2000);
    });

    socket.on("searching", () => {
      setStatus("searching");
      setRoomId("");
      setStrangerProfile(null);
    });

    socket.on("stranger-disconnected", () => {
      setStatus("stranger_left");
    });

    socket.on("disconnect", () => {
      setStatus("disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("online-count");
      socket.off("match-found");
      socket.off("receive-message");
      socket.off("typing");
      socket.off("searching");
      socket.off("stranger-disconnected");
      socket.off("disconnect");
      socket.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || !roomId) return;
      socket.emit("send-message", { roomId, message: text });
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text,
          sender: "me",
          timestamp: new Date(),
        },
      ]);
    },
    [roomId]
  );

  const nextStranger = useCallback(() => {
    if (roomId) socket.emit("next-stranger", { roomId });
    setMessages([]);
    setStatus("searching");
    setRoomId("");
    setStrangerProfile(null);
    socket.emit("set-profile", profileRef.current);
    socket.emit("find-match");
  }, [roomId]);

  const startChat = useCallback(() => {
    setStatus("searching");
    socket.emit("set-profile", profileRef.current);
    socket.emit("find-match");
  }, []);

  const sendTyping = useCallback(() => {
    if (roomId) socket.emit("typing", { roomId });
  }, [roomId]);

  const reportUser = useCallback(
    (reason: string) => {
      if (roomId) socket.emit("report-user", { roomId, reason });
    },
    [roomId]
  );

  return {
    roomId,
    messages,
    status,
    isTyping,
    onlineCount,
    strangerProfile,
    sendMessage,
    nextStranger,
    startChat,
    sendTyping,
    reportUser,
  };
}