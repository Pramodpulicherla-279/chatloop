"use client";

import { useState, useEffect } from "react";

export type Profile = {
  username: string;
  age: string;
  country: string;
};

function generateUsername(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `User${num}`;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile>({
    username: "",
    age: "",
    country: "",
  });
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage ONCE on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("chatloop-profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Make sure username exists (in case old save had empty string)
        if (!parsed.username) parsed.username = generateUsername();
        setProfile(parsed);
      } else {
        // First ever visit — generate and save
        const fresh: Profile = {
          username: generateUsername(),
          age: "",
          country: "",
        };
        localStorage.setItem("chatloop-profile", JSON.stringify(fresh));
        setProfile(fresh);
      }
    } catch {
      setProfile({ username: generateUsername(), age: "", country: "" });
    }
    setLoaded(true);
  }, []);

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem("chatloop-profile", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  return { profile, updateProfile, loaded };
}