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
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-20 lg:py-24 text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
            Our Story & Mission
          </span>
          <h1 className="text-3xl sm:text-5xl font-black mt-4 mb-6 tracking-tight leading-tight">
            Building Bangladesh&apos;s Most Trusted{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">
              Recommerce Ecosystem
            </span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            ReSell Hub was founded with a singular purpose: to make buying and selling used goods safe, transparent, and effortlessly accessible to everyone across Bangladesh.
          </p>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="bg-white py-10 border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-indigo-600">2024</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Founded in Dhaka</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-indigo-600">25,000+</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Registered Members</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-indigo-600">64</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Districts Connected</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-indigo-600">120+ Tons</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">E-Waste Prevented</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Why We Exist
              </span>
              <h2 className="text-3xl font-black text-slate-900 leading-tight">
                Empowering circular commerce with verified trust & safety
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Traditional classified boards in Bangladesh are plagued by scammers, fake products, and high-risk meetups. ReSell Hub changes that by introducing identity verification, escrow payment protection, and structured product condition metrics.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Whether you&apos;re a student looking for an affordable laptop, a photographer upgrading camera bodies, or a family decluttering furniture, we provide a smooth, community-first marketplace.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Escrow Safety</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Money is protected until both buyer and seller verify the condition.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Leaf size={22} />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Eco Impact</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Giving electronics and gear a second life reduces carbon footprint.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <HeartHandshake size={22} />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Community Trust</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Transparent user feedback, ratings, and active trade history.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Zap size={22} />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Instant Deal Flow</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Instant messaging, smart search, and direct seller negotiation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Engineering Team */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              The Builders
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">
              Meet the Engineering Team
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Crafted by passionate engineers dedicated to exceptional user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: "Mahfuzul Haque",
                role: "Founder & Full Stack Lead",
                img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
                bio: "Full stack engineer specializing in Next.js, Node.js, and high-concurrency marketplace platforms.",
              },
              {
                name: "Tanvir Ahmed",
                role: "Lead Product Designer",
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
              <div key={member.name} className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 text-center space-y-3">
                <div className="w-20 h-20 rounded-full mx-auto overflow-hidden border-2 border-indigo-500 shadow-md">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{member.name}</h4>
                  <span className="text-xs font-semibold text-indigo-600">{member.role}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
        <div className="container mx-auto px-4 max-w-xl">
          <h2 className="text-3xl font-extrabold mb-4">Be part of the recommerce movement</h2>
          <p className="text-indigo-100 text-sm mb-6">
            Join thousands of smart shoppers and sellers saving money and making Bangladesh greener.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-600 font-bold rounded-xl shadow-xl hover:bg-slate-100 transition-all"
          >
            Create Your Account Today <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
