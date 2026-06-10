"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const VERIFIED_KEY           = "chatloop-human-verified";
const PROFILE_KEY            = "chatloop-profile";
const PROFILE_CONFIGURED_KEY = "chatloop-profile-configured";
const THRESHOLD              = 0.88; // 88 % drag triggers verify

type Step = "verify" | "profile" | "done";
type Gender = "male" | "female" | "other" | "";

/* ─── helpers ────────────────────────────────────────────── */
function generateUsername(): string {
  return `User${Math.floor(1000 + Math.random() * 9000)}`;
}

function readStoredUsername(): string {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw).username || generateUsername();
  } catch {}
  return generateUsername();
}

/* ─── Countries list ─────────────────────────────────────── */
const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Argentina","Australia","Austria",
  "Bangladesh","Belgium","Brazil","Canada","Chile","China","Colombia",
  "Czech Republic","Denmark","Egypt","Ethiopia","Finland","France",
  "Germany","Ghana","Greece","Hungary","India","Indonesia","Iran",
  "Iraq","Ireland","Israel","Italy","Japan","Jordan","Kenya",
  "Malaysia","Mexico","Morocco","Netherlands","New Zealand","Nigeria",
  "Norway","Pakistan","Peru","Philippines","Poland","Portugal",
  "Romania","Russia","Saudi Arabia","South Africa","South Korea",
  "Spain","Sri Lanka","Sweden","Switzerland","Thailand","Turkey",
  "Ukraine","United Arab Emirates","United Kingdom","United States",
  "Vietnam","Other",
];

/* ─── Drag-to-verify slider ──────────────────────────────── */
function SliderVerify({ onVerified }: { onVerified: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone]         = useState(false);
  const dragging                = useRef(false);
  const startX                  = useRef(0);
  const trackRef                = useRef<HTMLDivElement>(null);

  const clamp = (v: number) => Math.min(1, Math.max(0, v));

  const finish = useCallback(() => {
    if (done) return;
    setDone(true);
    setProgress(1);
    dragging.current = false;
    setTimeout(onVerified, 700);
  }, [done, onVerified]);

  const move = useCallback(
    (clientX: number) => {
      if (!dragging.current || done) return;
      const width = trackRef.current?.offsetWidth ?? 1;
      const raw   = (clientX - startX.current) / width;
      const value = clamp(raw);
      setProgress(value);
      if (value >= THRESHOLD) finish();
    },
    [done, finish]
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (done) return;
    dragging.current = true;
    startX.current   = e.clientX - progress * (trackRef.current?.offsetWidth ?? 0);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => move(e.clientX);
  const onPointerUp   = () => { dragging.current = false; };

  useEffect(() => {
    if (!done && !dragging.current && progress > 0 && progress < THRESHOLD) {
      const t = setTimeout(() => setProgress(0), 300);
      return () => clearTimeout(t);
    }
  }, [done, progress]);

  const pct = Math.round(progress * 100);

  return (
    <div className="w-full">
      <div
        ref={trackRef}
        className={`relative h-14 rounded-2xl border select-none overflow-hidden cursor-grab active:cursor-grabbing transition-colors ${
          done ? "border-emerald-500/50 bg-emerald-500/10" : "border-border bg-muted"
        }`}
      >
        <div
          className={`absolute inset-y-0 left-0 rounded-2xl transition-colors ${
            done ? "bg-emerald-500/30" : "bg-violet-500/20"
          }`}
          style={{ width: `${pct}%` }}
        />
        <span
          className="absolute inset-0 flex items-center justify-center text-sm font-semibold pointer-events-none select-none transition-opacity"
          style={{ opacity: done ? 0 : Math.max(0, 1 - progress * 3) }}
        >
          <span className="text-muted-foreground">Slide to verify →</span>
        </span>
        {done && (
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-emerald-400 pointer-events-none">
            ✓ Verified
          </span>
        )}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className={`absolute top-1 bottom-1 w-12 rounded-xl flex items-center justify-center shadow-lg transition-colors touch-none ${
            done
              ? "bg-emerald-500 cursor-default"
              : "bg-gradient-to-br from-violet-600 to-indigo-500 cursor-grab active:cursor-grabbing hover:from-violet-500 hover:to-indigo-400"
          }`}
          style={{ left: `calc(${pct}% * (100% - 3rem) / 100)` }}
        >
          {done ? (
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Verification screen ────────────────────────────────── */
function VerificationScreen({ onVerified }: { onVerified: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tight">
            <span className="gradient-text">Chat</span>
            <span className="text-foreground">Loop</span>
          </h1>
          <p className="mt-2 text-muted-foreground text-sm">Anonymous · Instant · Global</p>
        </div>

        <div className="w-full rounded-3xl border border-border bg-card p-7 shadow-2xl flex flex-col gap-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="h-16 w-16 rounded-2xl gradient-brand flex items-center justify-center shadow-lg shadow-violet-500/30">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <p className="text-foreground font-bold text-lg">Human Verification</p>
              <p className="text-muted-foreground text-sm mt-1">Drag the slider to confirm you&apos;re not a bot</p>
            </div>
          </div>

          <SliderVerify onVerified={onVerified} />

          <div className="grid grid-cols-3 gap-2 pt-1">
            {[
              { icon: "🔒", label: "Anonymous" },
              { icon: "⚡", label: "Instant" },
              { icon: "🌍", label: "Global" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 rounded-xl bg-muted/50 py-2.5">
                <span className="text-xl">{icon}</span>
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground max-w-xs">
          By continuing you agree to our community guidelines. No sign-up required.
        </p>
      </div>
    </div>
  );
}

/* ─── Profile setup screen ───────────────────────────────── */
const GENDER_OPTIONS: { value: Gender; label: string; icon: string; color: string; bg: string }[] = [
  { value: "male",   label: "Male",   icon: "♂", color: "text-blue-400",   bg: "border-blue-500/50 bg-blue-500/10" },
  { value: "female", label: "Female", icon: "♀", color: "text-pink-400",   bg: "border-pink-500/50 bg-pink-500/10" },
  { value: "other",  label: "Other",  icon: "⚧", color: "text-violet-400", bg: "border-violet-500/50 bg-violet-500/10" },
];

function ProfileSetupScreen({ onDone }: { onDone: () => void }) {
  const [username, setUsername] = useState(readStoredUsername);
  const [age,      setAge]      = useState("");
  const [gender,   setGender]   = useState<Gender>("");
  const [country,  setCountry]  = useState("");
  const [error,    setError]    = useState("");

  const avatarGradient =
    gender === "male"   ? "from-blue-600 to-blue-400"   :
    gender === "female" ? "from-pink-600 to-pink-400"   :
                          "from-violet-600 to-indigo-400";

  const save = (skipProfile = false) => {
    if (!skipProfile) {
      const trimmed = username.trim();
      if (!trimmed) { setError("Username cannot be empty"); return; }
      if (trimmed.length < 3 || trimmed.length > 20) { setError("Username must be 3–20 characters"); return; }
      if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) { setError("Only letters, numbers and underscores"); return; }
      if (age && (Number(age) < 13 || Number(age) > 99)) { setError("Age must be between 13 and 99"); return; }

      const profile = { username: trimmed, age, gender, country };
      try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch {}
    }
    try { localStorage.setItem(PROFILE_CONFIGURED_KEY, "true"); } catch {}
    onDone();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-6 overflow-y-auto">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm flex flex-col items-center gap-6 py-8">

        {/* Logo */}
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tight">
            <span className="gradient-text">Chat</span>
            <span className="text-foreground">Loop</span>
          </h1>
          <p className="mt-2 text-muted-foreground text-sm">Anonymous · Instant · Global</p>
        </div>

        {/* Card */}
        <div className="w-full rounded-3xl border border-border bg-card shadow-2xl overflow-hidden">

          {/* Card header */}
          <div className="px-6 pt-6 pb-4 border-b border-border flex items-center gap-4">
            <div
              className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-black text-lg shadow-lg flex-shrink-0`}
            >
              {username ? username.charAt(0).toUpperCase() : "?"}
            </div>
            <div>
              <p className="text-foreground font-bold text-base">Set Up Your Profile</p>
              <p className="text-muted-foreground text-xs">Shown to strangers you chat with</p>
            </div>
          </div>

          {/* Form */}
          <div className="px-6 py-5 flex flex-col gap-5">

            {/* Name */}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
                maxLength={20}
                placeholder="e.g. CoolStranger"
                autoFocus
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
                        : "border-border text-muted-foreground hover:bg-muted"
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
                <option value="">Select country…</option>
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

          {/* Footer buttons */}
          <div className="px-6 pb-6 flex gap-3">
            <button
              type="button"
              onClick={() => save(true)}
              className="flex-1 rounded-xl border border-border py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={() => save(false)}
              className="flex-1 rounded-xl gradient-brand py-2.5 text-sm text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20"
            >
              Start Chatting →
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground max-w-xs">
          You can update your profile anytime from the sidebar.
        </p>
      </div>
    </div>
  );
}

/* ─── Gate wrapper ───────────────────────────────────────── */
export default function VerificationGate({ children }: { children: React.ReactNode }) {
  const [step,   setStep]   = useState<Step>("verify");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const verified   = sessionStorage.getItem(VERIFIED_KEY)           === "true";
    const profiled   = localStorage.getItem(PROFILE_CONFIGURED_KEY)   === "true";

    if (verified && profiled) setStep("done");
    else if (verified)        setStep("profile");
    else                      setStep("verify");

    setLoaded(true);
  }, []);

  if (!loaded) return null;

  if (step === "verify") {
    return (
      <VerificationScreen
        onVerified={() => {
          sessionStorage.setItem(VERIFIED_KEY, "true");
          setStep("profile");
        }}
      />
    );
  }

  if (step === "profile") {
    return (
      <ProfileSetupScreen
        onDone={() => setStep("done")}
      />
    );
  }

  return <>{children}</>;
}
