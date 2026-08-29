"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, HelpCircle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service if needed
    console.error("Caught in ErrorBoundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="max-w-md w-full text-center p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-32 bg-rose-500/15 dark:bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Warning Icon Pill */}
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-800/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center shadow-xs mb-6">
          <AlertTriangle size={32} />
        </div>

        {/* Heading & Subtitle */}
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          Something went wrong
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          We encountered an unexpected glitch while rendering this page. Our team has been notified.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="btn-shiny-primary w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <Home size={14} />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Support Link */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <HelpCircle size={14} />
          <span>Need help?</span>
          <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
