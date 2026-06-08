"use client";

import { useState, useEffect } from "react";

export type Gender = "male" | "female" | "other" | "";

export type Profile = {
  username: string;
  age: string;
  gender: Gender;
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
    gender: "",
    country: "",
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("chatloop-profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.username) parsed.username = generateUsername();
        setProfile(parsed);
      } else {
        const fresh: Profile = {
          username: generateUsername(),
          age: "",
          gender: "",
          country: "",
        };
        localStorage.setItem("chatloop-profile", JSON.stringify(fresh));
        setProfile(fresh);
      }
    } catch {
      setProfile({ username: generateUsername(), age: "", gender: "", country: "" });
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
