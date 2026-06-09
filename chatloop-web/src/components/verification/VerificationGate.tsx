"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const VERIFIED_KEY = "chatloop-human-verified";
const THRESHOLD = 0.88; // 88 % drag triggers verify

/* ── Drag-to-verify slider ─────────────────────────────── */
function SliderVerify({ onVerified }: { onVerified: () => void }) {
  const [progress, setProgress] = useState(0);   // 0–1
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

  /* pointer events — handles both mouse and touch */
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (done) return;
    dragging.current = true;
    startX.current   = e.clientX - progress * (trackRef.current?.offsetWidth ?? 0);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => move(e.clientX);
  const onPointerUp   = () => { dragging.current = false; };

  /* reset if released before threshold */
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
          done
            ? "border-emerald-500/50 bg-emerald-500/10"
            : "border-border bg-muted"
        }`}
      >
        {/* fill */}
        <div
          className={`absolute inset-y-0 left-0 rounded-2xl transition-colors ${
            done ? "bg-emerald-500/30" : "bg-violet-500/20"
          }`}
          style={{ width: `${pct}%` }}
        />

        {/* track label */}
        <span
          className="absolute inset-0 flex items-center justify-center text-sm font-semibold pointer-events-none select-none transition-opacity"
          style={{ opacity: done ? 0 : Math.max(0, 1 - progress * 3) }}
        >
          <span className="text-muted-foreground">Slide to verify →</span>
        </span>

        {/* success label */}
        {done && (
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-emerald-400 pointer-events-none">
            ✓ Verified
          </span>
        )}

        {/* thumb */}
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

/* ── Verification screen ────────────────────────────────── */
function VerificationScreen({ onVerified }: { onVerified: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-6">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm flex flex-col items-center gap-8">

        {/* Logo */}
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tight">
            <span className="gradient-text">Chat</span>
            <span className="text-foreground">Loop</span>
          </h1>
          <p className="mt-2 text-muted-foreground text-sm">
            Anonymous · Instant · Global
          </p>
        </div>

        {/* Card */}
        <div className="w-full rounded-3xl border border-border bg-card p-7 shadow-2xl flex flex-col gap-6">

          {/* Shield icon */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="h-16 w-16 rounded-2xl gradient-brand flex items-center justify-center shadow-lg shadow-violet-500/30">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <p className="text-foreground font-bold text-lg">Human Verification</p>
              <p className="text-muted-foreground text-sm mt-1">
                Drag the slider to confirm you&apos;re not a bot
              </p>
            </div>
          </div>

          {/* Slider */}
          <SliderVerify onVerified={onVerified} />

          {/* Features */}
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

        {/* Fine print */}
        <p className="text-center text-xs text-muted-foreground max-w-xs">
          By continuing you agree to our community guidelines. No sign-up required.
        </p>
      </div>
    </div>
  );
}

/* ── Gate wrapper ───────────────────────────────────────── */
export default function VerificationGate({ children }: { children: React.ReactNode }) {
  const [verified, setVerified] = useState(false);
  const [loaded,   setLoaded]   = useState(false);

  useEffect(() => {
    const ok = sessionStorage.getItem(VERIFIED_KEY) === "true";
    setVerified(ok);
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  if (!verified) {
    return (
      <VerificationScreen
        onVerified={() => {
          sessionStorage.setItem(VERIFIED_KEY, "true");
          setVerified(true);
        }}
      />
    );
  }

  return <>{children}</>;
}
