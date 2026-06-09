"use client";

import React, { createContext, useContext } from "react";
import { useChat, MessageType, ChatStatus, StrangerProfile } from "@/src/hooks/useChat";
import { useProfile, Profile } from "@/src/hooks/useProfile";

type ChatContextType = {
  profile: Profile;
  updateProfile: (updates: Partial<Profile>) => void;
  roomId: string;
  messages: MessageType[];
  status: ChatStatus;
  isTyping: boolean;
  onlineCount: number;
  maleCount: number;
  femaleCount: number;
  strangerProfile: StrangerProfile | null;
  sendMessage: (text: string) => void;
  nextStranger: () => void;
  startChat: () => void;
  sendTyping: () => void;
  reportUser: (reason: string) => void;
  reconnect: () => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { profile, updateProfile, loaded } = useProfile();
  const chat = useChat(profile);

  if (!loaded) return null;

  return (
    <ChatContext.Provider value={{ profile, updateProfile, ...chat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used inside ChatProvider");
  return ctx;
}
