"use client";

import { useState } from "react";
import { useChatContext } from "@/src/components/context/ChatContext";

const REASONS = [
  "Spam or bot",
  "Harassment or bullying",
  "Hate speech",
  "Inappropriate content",
  "Other",
];

export default function ReportModal({ onClose }: { onClose: () => void }) {
  const { reportUser, nextStranger } = useChatContext();
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selected) return;
    reportUser(selected);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      nextStranger();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl">
        {submitted ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">✓</div>
            <p className="text-white font-semibold">Report submitted</p>
            <p className="text-zinc-400 text-sm mt-1">Finding a new stranger...</p>
          </div>
        ) : (
          <>
            <h2 className="text-white font-bold text-lg mb-1">Report User</h2>
            <p className="text-zinc-400 text-sm mb-5">
              Select a reason for reporting this stranger.
            </p>

            <div className="flex flex-col gap-2 mb-6">
              {REASONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setSelected(r)}
                  className={`rounded-xl px-4 py-3 text-left text-sm transition-colors border ${
                    selected === r
                      ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                      : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-zinc-700 py-2.5 text-sm text-zinc-400 hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selected}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm text-white hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
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