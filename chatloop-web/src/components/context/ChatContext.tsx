"use client";

import React, { createContext, useContext } from "react";
import { useChat, MessageType, ChatStatus, StrangerProfile } from "@/src/hooks/useChat";
import { useProfile, Profile } from "@/src/hooks/useProfile";

type ChatContextType = {
  // profile
  profile: Profile;
  updateProfile: (updates: Partial<Profile>) => void;
  // chat
  roomId: string;
  messages: MessageType[];
  status: ChatStatus;
  isTyping: boolean;
  onlineCount: number;
  strangerProfile: StrangerProfile | null;
  sendMessage: (text: string) => void;
  nextStranger: () => void;
  startChat: () => void;
  sendTyping: () => void;
  reportUser: (reason: string) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { profile, updateProfile, loaded } = useProfile();
  const chat = useChat(profile);

  if (!loaded) return null; // wait for localStorage to hydrate

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