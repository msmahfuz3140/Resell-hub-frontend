"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Leaf,
  HeartHandshake,
  Zap,
  Users,
  Target,
  Sparkles,
  Award,
  ArrowRight,
  Globe2,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* ── HERO BANNER WITH AMBIENT DARK BACKDROP ── */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-[#090D16] text-white text-center">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/25 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-300 bg-white/10 px-4 py-1.5 rounded-full border border-white/15 backdrop-blur-xl">
            Our Mission & Impact
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black mt-6 mb-6 tracking-tight leading-[1.12]">
            Democratizing Circular Recommerce in{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
              Bangladesh
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            We are building a world where extending the life of gadgets, furniture, and vehicles is transparent, rewarding, and 100% scam-free.
          </p>
        </div>
      </section>

      {/* ── STATS COUNTER BAR ── */}
      <section className="bg-white py-10 border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-3xl sm:text-4xl font-black text-slate-900">2024</div>
              <div className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider mt-1">Founded in Dhaka</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-3xl sm:text-4xl font-black text-slate-900">25,000+</div>
              <div className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider mt-1">Verified Members</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-3xl sm:text-4xl font-black text-slate-900">64</div>
              <div className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider mt-1">Districts Connected</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-3xl sm:text-4xl font-black text-slate-900">120+ Tons</div>
              <div className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider mt-1">E-Waste Prevented</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE PILLARS ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
                The ReSell Hub Difference
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                Why thousands of smart traders choose our platform
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                Traditional classifieds in Bangladesh are rife with fake notes, stolen electronics, and sudden cancellations. We created ReSell Hub to introduce bank-grade escrow security, transparent hardware diagnostics, and community verification.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  "100% Escrow Protection on online payments",
                  "Identity verification with National ID & phone OTP",
                  "Standardized physical condition checklist (1-5 score)",
                  "Verified buyer & seller dispute resolution team",
                ].map((point) => (
                  <div key={point} className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={13} />
                    </span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4 Feature Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="font-black text-slate-900 text-base">Escrow Shield</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Money is protected until both parties verify product hardware in person.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                  <Leaf size={24} />
                </div>
                <h3 className="font-black text-slate-900 text-base">Sustainability</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Every second-hand trade extends product life and curtails toxic landfill waste.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                  <HeartHandshake size={24} />
                </div>
                <h3 className="font-black text-slate-900 text-base">Verified Trust</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Real feedback, verified transaction histories, and community ratings.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
                  <Zap size={24} />
                </div>
                <h3 className="font-black text-slate-900 text-base">Fast Liquidity</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Average listing sells within 48 hours to thousands of ready buyers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ENGINEERING & LEADERSHIP TEAM ── */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
              The Creators
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
              Meet the Core Team
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Engineered with world-class standard by developers from Bangladesh.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Mahfuzul Haque",
                role: "Founder & Full Stack Lead",
                img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
                bio: "Full stack engineer architecting scalable marketplace infrastructures with Next.js, Node, and MongoDB.",
              },
              {
                name: "Tanvir Ahmed",
                role: "Lead UI/UX Designer",
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
                bio: "Obsessed with micro-interactions, responsive design systems, and delightful customer journeys.",
              },
              {
                name: "Samira Karim",
                role: "Trust & Safety Operations",
                img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
                bio: "Dedicated to user identity verification, dispute resolution, and community protection.",
              },
            ].map((member) => (
              <div key={member.name} className="bg-slate-50 rounded-3xl p-7 border border-slate-200/90 text-center space-y-4 shadow-xs">
                <div className="w-24 h-24 rounded-2xl mx-auto overflow-hidden border-2 border-indigo-500 shadow-md">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-base">{member.name}</h4>
                  <span className="text-xs font-bold text-indigo-600">{member.role}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
