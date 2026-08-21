"use client";

import Link from "next/link";
import { ShoppingBag, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/listings", label: "Browse Products" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

const SELLER_LINKS = [
  { href: "/register", label: "Start Selling" },
  { href: "/add-product", label: "List a Product" },
  { href: "/my-products", label: "My Listings" },
  { href: "/dashboard", label: "Seller Dashboard" },
];

const SUPPORT_LINKS = [
  { href: "/contact", label: "Help Center" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/contact", label: "Support & FAQs" },
];

// Inline Social Brand Icons (SVG)
const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const SOCIAL_LINKS = [
  { icon: FacebookIcon, label: "Facebook", href: "https://facebook.com" },
  { icon: TwitterIcon, label: "Twitter", href: "https://twitter.com" },
  { icon: InstagramIcon, label: "Instagram", href: "https://instagram.com" },
  { icon: YoutubeIcon, label: "YouTube", href: "https://youtube.com" },
];

const CATEGORIES = [
  "Electronics", "Clothing", "Furniture", "Books",
  "Sports", "Vehicles", "Toys", "Music",
];

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return toast.error("Please enter a valid email.");
    toast.success("🎉 You're subscribed! Check your inbox.");
    setEmail("");
  };

  return (
    <footer className="footer bg-slate-950 text-slate-400">
      {/* ── Newsletter Banner ── */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-8 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold tracking-tight mb-1">
                Get notified of the freshest second-hand deals! 🔥
              </h3>
              <p className="text-indigo-100 text-xs sm:text-sm">
                Subscribe for weekly curated drops, discount alerts, and community safety tips.
              </p>
            </div>
            <form onSubmit={handleNewsletter} className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-white/60 text-sm outline-none w-full sm:w-72 backdrop-blur-md"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-white text-indigo-700 font-bold text-sm rounded-xl hover:bg-slate-100 transition-colors shrink-0 flex items-center gap-1.5"
              >
                <span>Join</span>
                <ArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Main Footer Grid ── */}
      <div className="py-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-2.5 text-white">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
                  <ShoppingBag size={20} color="white" />
                </div>
                <span className="text-xl font-black tracking-tight">
                  ReSell<span className="text-indigo-400">Hub</span>
                </span>
              </Link>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                Bangladesh&apos;s most reliable circular marketplace. Buy, sell, and trade pre-loved gadgets, vehicles, furniture, and fashion securely with escrow protection.
              </p>

              <div className="space-y-2 text-xs text-slate-400 pt-2">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-indigo-400" />
                  <span>support@resellhub.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-indigo-400" />
                  <span>+880 1700-000000 (9 AM – 10 PM)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-indigo-400" />
                  <span>Gulshan-1, Dhaka, Bangladesh</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-2.5 pt-2">
                {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-600 flex items-center justify-center transition-all"
                    aria-label={label}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
                Explore
              </h4>
              <ul className="space-y-2.5 text-xs">
                {QUICK_LINKS.map(({ href, label }) => (
                  <li key={label}>
                    <Link href={href} className="text-slate-400 hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Seller Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
                Selling
              </h4>
              <ul className="space-y-2.5 text-xs">
                {SELLER_LINKS.map(({ href, label }) => (
                  <li key={label}>
                    <Link href={href} className="text-slate-400 hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
                Trust & Support
              </h4>
              <ul className="space-y-2.5 text-xs">
                {SUPPORT_LINKS.map(({ href, label }) => (
                  <li key={label}>
                    <Link href={href} className="text-slate-400 hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Popular Categories Chips */}
          <div className="mt-12 pt-8 border-t border-slate-900 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-2">Categories:</span>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/listings?category=${cat}`}
                className="text-[11px] font-medium bg-slate-900 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-800 transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Copyright Row */}
          <div className="mt-8 pt-6 border-t border-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} ReSell Hub Bangladesh Ltd. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/terms" className="hover:text-slate-300">Terms of Use</Link>
              <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
              <Link href="/contact" className="hover:text-slate-300">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
