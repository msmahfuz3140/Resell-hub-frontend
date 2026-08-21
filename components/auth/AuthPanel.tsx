"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

interface AuthPanelProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  stats?: { value: string; label: string }[];
}

export default function AuthPanel({ children, title, subtitle, stats }: AuthPanelProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#fafafa]">
      {/* Left brand panel */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex relative flex-col items-center justify-center p-12 overflow-hidden bg-gradient-to-br from-charcoal via-gray-900 to-charcoal"
      >
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-teal/10 blur-3xl" />

        <div className="relative text-center text-white max-w-sm">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", delay: 0.15 }}
            className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center"
          >
            <ShoppingBag size={40} />
          </motion.div>

          <h2 className="text-3xl font-extrabold tracking-tight mb-3">ReSell Hub</h2>
          <p className="text-white/75 text-base leading-relaxed">
            Bangladesh&apos;s trusted marketplace for buying and selling second-hand items securely.
          </p>

          {stats && (
            <div className="flex justify-center gap-10 mt-10 pt-8 border-t border-white/10">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-extrabold">{stat.value}</div>
                  <div className="text-xs text-white/50 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full max-w-[420px]"
        >
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center">
              <ShoppingBag size={18} color="white" />
            </div>
            <span className="text-lg font-black">
              ReSell<span className="text-brand">Hub</span>
            </span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-charcoal tracking-tight mb-2">{title}</h1>
            <p className="text-[#717171]">{subtitle}</p>
          </div>

          {children}
        </motion.div>
      </div>
    </div>
  );
}
