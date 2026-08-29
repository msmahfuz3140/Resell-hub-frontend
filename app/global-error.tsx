"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-950/60 text-rose-400 mx-auto flex items-center justify-center border border-rose-800/60">
            <AlertCircle size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Application Error</h1>
            <p className="text-xs text-slate-400 mt-2">
              A critical error occurred. Please refresh or return to safety.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <RefreshCw size={14} />
              <span>Reload App</span>
            </button>
            <a
              href="/"
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center border border-slate-700 transition-colors"
            >
              Return Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
