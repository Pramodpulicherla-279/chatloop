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
  gender: string;
  country: string;
};

const MESSAGES_KEY = "chatloop-last-messages";
const STRANGER_KEY = "chatloop-last-stranger";

function saveMessages(messages: MessageType[]) {
  try {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  } catch {}
}

function loadMessages(): MessageType[] {
  try {
    const raw = localStorage.getItem(MESSAGES_KEY);
    if (!raw) return [];
    const parsed: MessageType[] = JSON.parse(raw);
    return parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return [];
  }
}

function saveStranger(profile: StrangerProfile | null) {
  try {
    if (profile) localStorage.setItem(STRANGER_KEY, JSON.stringify(profile));
    else localStorage.removeItem(STRANGER_KEY);
  } catch {}
}

function loadStranger(): StrangerProfile | null {
  try {
    const raw = localStorage.getItem(STRANGER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function clearChat() {
  try {
    localStorage.removeItem(MESSAGES_KEY);
    localStorage.removeItem(STRANGER_KEY);
  } catch {}
}

export function useChat(profile: Profile) {
  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [isTyping, setIsTyping] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const [strangerProfile, setStrangerProfile] = useState<StrangerProfile | null>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const profileRef = useRef(profile);
  const isRepairReconnect = useRef(false);

  // Restore last chat from localStorage on first render
  useEffect(() => {
    const savedMessages = loadMessages();
    const savedStranger = loadStranger();
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
      setStrangerProfile(savedStranger);
      // Show as stranger_left so user sees old chat but knows session ended
      setStatus("stranger_left");
    }
  }, []);

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    profileRef.current = profile;
    if (socket.connected && profile.username) {
      socket.emit("set-profile", profile);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.username, profile.age, profile.gender, profile.country]);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      if (isRepairReconnect.current) {
        // Just re-register the profile — don't search for a new stranger
        isRepairReconnect.current = false;
        socket.emit("set-profile", profileRef.current);
        return;
      }
      setStatus("searching");
      socket.emit("set-profile", profileRef.current);
      socket.emit("find-match");
    });

    socket.on(
      "online-count",
      (data: { count: number; maleCount: number; femaleCount: number }) => {
        setOnlineCount(data.count);
        setMaleCount(data.maleCount ?? 0);
        setFemaleCount(data.femaleCount ?? 0);
      }
    );

    socket.on(
      "match-found",
      (data: { roomId: string; strangerProfile: StrangerProfile }) => {
        // New stranger found — clear previous chat
        clearChat();
        setRoomId(data.roomId);
        setStrangerProfile(data.strangerProfile);
        saveStranger(data.strangerProfile);
        setStatus("connected");
        setMessages([]);
      }
    );

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
    // Clear stored chat before searching for a new one
    clearChat();
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

  const reconnect = useCallback(() => {
    // Repair-only reconnect — restores socket without searching for a new stranger
    isRepairReconnect.current = true;
    socket.disconnect();
    setTimeout(() => socket.connect(), 400);
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
    maleCount,
    femaleCount,
    strangerProfile,
    sendMessage,
    nextStranger,
    startChat,
    sendTyping,
    reportUser,
    reconnect,
  };
}
