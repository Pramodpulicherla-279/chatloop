"use client";

import { useState } from "react";
import { Profile } from "@/src/hooks/useProfile";

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

interface ProfileModalProps {
  profile: Profile;
  onSave: (updates: Partial<Profile>) => void;
  onClose: () => void;
}

export default function ProfileModal({ profile, onSave, onClose }: ProfileModalProps) {
  const [username, setUsername] = useState(profile.username);
  const [age, setAge] = useState(profile.age);
  const [country, setCountry] = useState(profile.country);
  const [error, setError] = useState("");

  const handleSave = () => {
    const trimmed = username.trim();
    if (!trimmed) {
      setError("Username cannot be empty");
      return;
    }
    if (trimmed.length < 3 || trimmed.length > 20) {
      setError("Username must be 3–20 characters");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      setError("Only letters, numbers and underscores");
      return;
    }
    if (age && (Number(age) < 18 || Number(age) > 99)) {
      setError("Age must be between 18 and 99");
      return;
    }
    onSave({ username: trimmed, age, country });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              {profile.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Edit Profile</p>
              <p className="text-zinc-500 text-xs">Visible to strangers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Username */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1.5 block">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              maxLength={20}
              placeholder="e.g. CoolStranger"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-600"
            />
          </div>

          {/* Age */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1.5 block">
              Age <span className="text-zinc-600 font-normal normal-case">(optional)</span>
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => {
                setAge(e.target.value);
                setError("");
              }}
              min={18}
              max={99}
              placeholder="e.g. 24"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-600"
            />
          </div>

          {/* Country */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1.5 block">
              Country <span className="text-zinc-600 font-normal normal-case">(optional)</span>
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white text-sm outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="">Select country...</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-zinc-700 py-2.5 text-sm text-zinc-400 hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm text-white hover:bg-indigo-500 transition-colors font-medium"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}