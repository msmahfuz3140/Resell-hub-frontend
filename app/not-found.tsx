"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Home, ArrowRight, ShoppingBag, Sparkles, Compass } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/listings?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/listings");
    }
  };

  const POPULAR_PAGES = [
    { label: "Phones & Gadgets", href: "/listings?category=Electronics" },
    { label: "Laptops & PCs", href: "/listings?category=Electronics" },
    { label: "Vehicles & Bikes", href: "/listings?category=Vehicles" },
    { label: "Post a Free Ad", href: "/add-product" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 sm:p-6 transition-colors duration-200">
      <div className="max-w-xl w-full text-center py-12 px-6 sm:px-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/15 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-0 w-48 h-48 bg-purple-500/15 dark:bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* 404 Headline badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-wider mb-4 shadow-xs">
          <Sparkles size={13} /> 404 — Page Not Found
        </div>

        {/* Big 404 text */}
        <h1 className="text-7xl sm:text-8xl font-black tracking-tight leading-none bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 dark:from-indigo-400 dark:via-purple-300 dark:to-cyan-300 bg-clip-text text-transparent mb-3">
          404
        </h1>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
          Looks like this deal slipped away!
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
          The page you are looking for doesn&apos;t exist, may have expired, or has moved to a new URL. Try searching below or explore popular categories.
        </p>

        {/* Search Bar Input */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-6 flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands, or gadgets..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-800 dark:text-white outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
          <button
            type="submit"
            className="btn-shiny-primary px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center shrink-0 shadow-md"
          >
            <span>Search</span>
          </button>
        </form>

        {/* Popular Quick Links */}
        <div className="mb-8">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Popular Destinations
          </span>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {POPULAR_PAGES.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/80 dark:border-slate-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link
            href="/"
            className="btn-shiny-primary w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
          >
            <Home size={15} />
            <span>Go to Homepage</span>
          </Link>
          <Link
            href="/listings"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <Compass size={15} />
            <span>Browse All Listings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
