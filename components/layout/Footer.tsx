"use client";

import Link from "next/link";
import { ShoppingBag, Mail, Phone, MapPin, ArrowRight, ShieldCheck, Truck, CreditCard } from "lucide-react";
import React, { useState } from "react";
import { motion } from "framer-motion";
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

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
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

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Verified Sellers" },
  { icon: CreditCard, label: "Secure Payments" },
  { icon: Truck, label: "Nationwide Delivery" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return toast.error("Please enter a valid email.");
    toast.success("You're subscribed! Check your inbox.");
    setEmail("");
  };

  return (
    <footer className="footer bg-[#111827] text-slate-400">
      {/* Newsletter */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-brand/20 via-transparent to-teal/20" />
        <div className="container mx-auto px-4 py-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row items-center justify-between gap-8"
          >
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-extrabold text-white tracking-tight mb-2">
                Never miss a great deal
              </h3>
              <p className="text-slate-400 text-sm max-w-md">
                Weekly curated drops, price-drop alerts, and marketplace safety tips — straight to your inbox.
              </p>
            </div>
            <form onSubmit={handleNewsletter} className="flex gap-2 w-full lg:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="px-5 py-3 rounded-2xl border border-white/10 bg-white/5 text-white placeholder:text-white/40 text-sm outline-none w-full sm:w-80 backdrop-blur-md focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-brand text-white font-bold text-sm rounded-2xl hover:bg-brand-dark transition-all shrink-0 flex items-center gap-2 shadow-lg shadow-brand/25"
              >
                Subscribe
                <ArrowRight size={15} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="border-b border-white/5 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 text-sm text-slate-300">
                <Icon size={18} className="text-teal" />
                <span className="font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="py-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2 space-y-5">
              <Link href="/" className="flex items-center gap-2.5 text-white">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center shadow-lg shadow-brand/30">
                  <ShoppingBag size={20} color="white" />
                </div>
                <span className="text-xl font-black tracking-tight">
                  ReSell<span className="text-brand">Hub</span>
                </span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                Bangladesh&apos;s most trusted circular marketplace. Buy, sell, and trade pre-loved gadgets, vehicles, furniture, and fashion with escrow protection.
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail size={15} className="text-brand shrink-0" />
                  <span>support@resellhub.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={15} className="text-brand shrink-0" />
                  <span>+880 1700-000000 (9 AM – 10 PM)</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={15} className="text-brand shrink-0" />
                  <span>Gulshan-1, Dhaka, Bangladesh</span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="social-btn text-slate-400 hover:text-white"
                    aria-label={label}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: "Explore", links: QUICK_LINKS },
              { title: "Selling", links: SELLER_LINKS },
              { title: "Trust & Support", links: SUPPORT_LINKS },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-white mb-5">
                  {title}
                </h4>
                <ul className="space-y-3">
                  {links.map(({ href, label }) => (
                    <li key={label}>
                      <Link href={href} className="footer-link text-sm">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-1">Popular:</span>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/listings?category=${cat}`}
                className="text-[11px] font-semibold bg-white/5 text-slate-400 hover:text-brand hover:bg-brand/10 px-3 py-1.5 rounded-full border border-white/5 transition-all"
              >
                {cat}
              </Link>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} ReSell Hub Bangladesh Ltd. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Use</Link>
              <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
              <Link href="/contact" className="hover:text-slate-300 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
