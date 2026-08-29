"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, FileText, Lock, RefreshCw, AlertCircle, ArrowLeft } from "lucide-react";

export default function TermsPage() {
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

        {/* Header Header */}
        <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold mb-3 border border-indigo-100 dark:border-indigo-800/60">
            <FileText size={14} /> Legal & Compliance
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Last updated: August 2026 • Effective for all ReSell Hub users across Bangladesh
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
          {/* Section 1 */}
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-black">
                01
              </span>
              Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or using the <strong>ReSell Hub</strong> marketplace platform (via web or mobile), you acknowledge that you have read, understood, and agreed to be legally bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-black">
                02
              </span>
              User Accounts & Verification
            </h2>
            <p>
              To buy or sell second-hand goods on ReSell Hub, you must register a verified account. You agree to provide accurate, up-to-date information. Accounts engaging in misleading product listings, impersonation, or duplicate spam accounts are subject to immediate suspension under our safety protocols.
            </p>
          </section>

          {/* Section 3 */}
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-black">
                03
              </span>
              The Escrow Protection & 48-Hour Inspection Protocol
            </h2>
            <p>
              All online transactions conducted via our checkout system are protected by the <strong>ReSell Hub Escrow Vault</strong>. Funds are locked securely upon payment and only transferred to the seller after the buyer completes the 48-hour inspection window following courier delivery.
            </p>
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white block mb-0.5">Scam-Free Protection</strong>
                If an item is counterfeit, defective, or fails to match listing specifications, the buyer can file a dispute within 48 hours for a 100% full refund.
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-black">
                04
              </span>
              Prohibited Items & Marketplace Conduct
            </h2>
            <p>
              Users are strictly prohibited from listing illegal items, hazardous substances, stolen property, unverified pharmaceuticals, or pirated media. Violations will result in permanent blacklisting and forwarding to legal authorities.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-black">
                05
              </span>
              Dispute Resolution & Contact
            </h2>
            <p>
              For dispute mediation or queries concerning terms, contact our support team at{" "}
              <a href="mailto:support@resellhub.com" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                support@resellhub.com
              </a>{" "}
              or visit our <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Help & Contact Center</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
