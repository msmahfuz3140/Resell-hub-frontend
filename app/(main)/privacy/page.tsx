"use client";

import React from "react";
import Link from "next/link";
import { Lock, Shield, Eye, Database, ArrowLeft, CheckCircle } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 sm:py-16 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Marketplace
        </Link>

        {/* Header */}
        <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold mb-3 border border-emerald-100 dark:border-emerald-800/60">
            <Lock size={14} /> Privacy & Data Security
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Your privacy and security are paramount. Learn how we safeguard your information.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
          {/* Section 1 */}
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-black">
                01
              </span>
              Information We Collect
            </h2>
            <p>
              We collect information you provide directly during account registration, profile setup, and listing creation (such as name, verified phone number, email address, and general district location). We do not store sensitive payment card details directly; all transactions are encrypted through our certified payment gateways.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-black">
                02
              </span>
              How We Use Your Data
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                Facilitate verified peer-to-peer marketplace transactions and escrow payouts.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                Dispatch courier pickups across Bangladesh with real-time GPS tracking.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                Prevent fraud, counterfeit listings, and abusive activity via automated risk scanners.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-black">
                03
              </span>
              Data Protection & 256-bit Encryption
            </h2>
            <p>
              We implement industry-standard 256-bit SSL encryption for all network requests, session tokens, and communications. Your private contact information is masked in listings until an official order or chat is accepted by both parties.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-black">
                04
              </span>
              Your Data Rights & Deletion
            </h2>
            <p>
              You maintain full ownership of your data. You may request account deletion, data export, or marketing preference adjustments at any time via your <Link href="/settings" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Account Settings</Link> or by contacting <a href="mailto:privacy@resellhub.com" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">privacy@resellhub.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
