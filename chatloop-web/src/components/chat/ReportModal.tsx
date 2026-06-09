"use client";

import { useState } from "react";
import { useChatContext } from "@/src/components/context/ChatContext";

const REASONS = [
  "Spam or bot",
  "Harassment or bullying",
  "Hate speech",
  "Inappropriate content",
  "Underage user",
  "Other",
];

export default function ReportModal({ onClose }: { onClose: () => void }) {
  const { reportUser } = useChatContext();
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selected) return;
    reportUser(selected);
    setSubmitted(true);
    setTimeout(() => onClose(), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl">
        {submitted ? (
          <div className="text-center py-6 flex flex-col items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-2xl">
              ✓
            </div>
            <p className="text-foreground font-bold text-lg">Report submitted</p>
            <p className="text-muted-foreground text-sm">Thank you for keeping ChatLoop safe.</p>
          </div>
        ) : (
          <>
            <h2 className="text-foreground font-bold text-xl mb-1">Report User</h2>
            <p className="text-muted-foreground text-sm mb-5">
              Select a reason for reporting this stranger.
            </p>

            <div className="flex flex-col gap-2 mb-6">
              {REASONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setSelected(r)}
                  className={`rounded-xl px-4 py-3 text-left text-sm transition-all border font-medium ${
                    selected === r
                      ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                      : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selected}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm text-white hover:bg-red-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold"
              >
                Report
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
