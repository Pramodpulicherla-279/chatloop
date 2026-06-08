"use client";

import { useState } from "react";
import { Profile, Gender } from "@/src/hooks/useProfile";

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria",
  "Bangladesh", "Belgium", "Brazil", "Canada", "Chile", "China", "Colombia",
  "Czech Republic", "Denmark", "Egypt", "Ethiopia", "Finland", "France",
  "Germany", "Ghana", "Greece", "Hungary", "India", "Indonesia", "Iran",
  "Iraq", "Ireland", "Israel", "Italy", "Japan", "Jordan", "Kenya",
  "Malaysia", "Mexico", "Morocco", "Netherlands", "New Zealand", "Nigeria",
  "Norway", "Pakistan", "Peru", "Philippines", "Poland", "Portugal",
  "Romania", "Russia", "Saudi Arabia", "South Africa", "South Korea",
  "Spain", "Sri Lanka", "Sweden", "Switzerland", "Thailand", "Turkey",
  "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
  "Vietnam", "Other",
];

const GENDER_OPTIONS: { value: Gender; label: string; icon: string; color: string; bg: string }[] = [
  { value: "male",   label: "Male",   icon: "♂", color: "text-blue-400",   bg: "border-blue-500/50 bg-blue-500/10" },
  { value: "female", label: "Female", icon: "♀", color: "text-pink-400",   bg: "border-pink-500/50 bg-pink-500/10" },
  { value: "other",  label: "Other",  icon: "⚧", color: "text-violet-400", bg: "border-violet-500/50 bg-violet-500/10" },
];

interface ProfileModalProps {
  profile: Profile;
  onSave: (updates: Partial<Profile>) => void;
  onClose: () => void;
}

export default function ProfileModal({ profile, onSave, onClose }: ProfileModalProps) {
  const [username, setUsername] = useState(profile.username);
  const [age, setAge]         = useState(profile.age);
  const [gender, setGender]   = useState<Gender>(profile.gender || "");
  const [country, setCountry] = useState(profile.country);
  const [error, setError]     = useState("");

  const handleSave = () => {
    const trimmed = username.trim();
    if (!trimmed) { setError("Username cannot be empty"); return; }
    if (trimmed.length < 3 || trimmed.length > 20) {
      setError("Username must be 3–20 characters"); return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      setError("Only letters, numbers and underscores"); return;
    }
    if (age && (Number(age) < 13 || Number(age) > 99)) {
      setError("Age must be between 13 and 99"); return;
    }
    onSave({ username: trimmed, age, gender, country });
    onClose();
  };

  const avatarGradient =
    gender === "male"
      ? "from-blue-600 to-blue-400"
      : gender === "female"
      ? "from-pink-600 to-pink-400"
      : "from-violet-600 to-indigo-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-black text-sm shadow`}
            >
              {username ? username.charAt(0).toUpperCase() : "?"}
            </div>
            <div>
              <p className="text-foreground font-bold text-sm">Edit Profile</p>
              <p className="text-muted-foreground text-xs">Visible to strangers</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors text-2xl leading-none">&times;</button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 flex flex-col gap-5">

          {/* Username */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              maxLength={20}
              placeholder="e.g. CoolStranger"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-foreground text-sm outline-none focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder:text-muted-foreground"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
              Gender <span className="text-muted-foreground font-normal normal-case">(optional)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {GENDER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setGender(gender === opt.value ? "" : opt.value)}
                  className={`rounded-xl border py-2.5 text-sm font-semibold transition-all flex flex-col items-center gap-1 ${
                    gender === opt.value
                      ? `${opt.bg} ${opt.color}`
                      : "border-border text-muted-foreground hover:border-border hover:bg-muted"
                  }`}
                >
                  <span className="text-base">{opt.icon}</span>
                  <span className="text-xs">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
              Age <span className="text-muted-foreground font-normal normal-case">(optional)</span>
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => { setAge(e.target.value); setError(""); }}
              min={13} max={99}
              placeholder="e.g. 24"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-foreground text-sm outline-none focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder:text-muted-foreground"
            />
          </div>

          {/* Country */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
              Country <span className="text-muted-foreground font-normal normal-case">(optional)</span>
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-foreground text-sm outline-none focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20 transition-all appearance-none cursor-pointer"
            >
              <option value="">Select country...</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-border py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 rounded-xl gradient-brand py-2.5 text-sm text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}
