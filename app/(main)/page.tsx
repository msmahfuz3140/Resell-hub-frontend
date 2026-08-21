"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  MessageSquare,
  Repeat,
  DollarSign,
  Star,
  Flame,
  ChevronRight,
  Smartphone,
  Laptop,
  Shirt,
  Armchair,
  BookOpen,
  Bike,
  Music,
  MapPin,
  Clock,
  ThumbsUp,
  Award,
  Check,
  X as XIcon,
} from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import type { Product } from "@/types";

// Showcase Products
const FEATURED_PRODUCTS: Product[] = [
  {
    _id: "prod-1",
    title: "Apple iPhone 15 Pro - 128GB (Natural Titanium)",
    description: "Mint condition, battery health 98%, with original box & receipt.",
    price: 94000,
    originalPrice: 115000,
    category: "Electronics",
    condition: "Like New",
    images: [
      {
        url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
        publicId: "iphone15",
        isPrimary: true,
      },
    ],
    sellerInfo: {
      sellerId: "user-1",
      name: "Tanzid Hossain",
      rating: 4.9,
      totalSales: 24,
      location: { city: "Gulshan, Dhaka", country: "Bangladesh" },
    },
    stock: 1,
    status: "active",
    location: { city: "Gulshan, Dhaka", country: "Bangladesh" },
    isFeatured: true,
    views: 420,
    favorites: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "prod-2",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    description: "Used for 2 months only. Comes with carry case and all original accessories.",
    price: 28500,
    originalPrice: 36000,
    category: "Electronics",
    condition: "Like New",
    images: [
      {
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
        publicId: "sony_wh",
        isPrimary: true,
      },
    ],
    sellerInfo: {
      sellerId: "user-2",
      name: "Nabila Rahman",
      rating: 5.0,
      totalSales: 12,
      location: { city: "Dhanmondi, Dhaka", country: "Bangladesh" },
    },
    stock: 1,
    status: "active",
    location: { city: "Dhanmondi, Dhaka", country: "Bangladesh" },
    isFeatured: true,
    views: 310,
    favorites: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "prod-3",
    title: "MacBook Air M2 (16GB RAM, 512GB SSD) Midnight",
    description: "Perfect for developers and students. Cycle count only 45.",
    price: 108000,
    originalPrice: 135000,
    category: "Electronics",
    condition: "New",
    images: [
      {
        url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
        publicId: "macbook_m2",
        isPrimary: true,
      },
    ],
    sellerInfo: {
      sellerId: "user-3",
      name: "Sabbir Ahmed",
      rating: 4.8,
      totalSales: 38,
      location: { city: "Uttara, Dhaka", country: "Bangladesh" },
    },
    stock: 1,
    status: "active",
    location: { city: "Uttara, Dhaka", country: "Bangladesh" },
    isFeatured: true,
    views: 890,
    favorites: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "prod-4",
    title: "Ergonomic Mesh Office Chair with Lumbar Support",
    description: "Bought 6 months ago for WFH. Solid build and breathable mesh back.",
    price: 8500,
    originalPrice: 14000,
    category: "Furniture",
    condition: "Good",
    images: [
      {
        url: "https://images.unsplash.com/photo-1580481077197-2e32a688b139?w=600&auto=format&fit=crop&q=80",
        publicId: "ergo_chair",
        isPrimary: true,
      },
    ],
    sellerInfo: {
      sellerId: "user-4",
      name: "Imran Khan",
      rating: 4.7,
      totalSales: 9,
      location: { city: "Chittagong", country: "Bangladesh" },
    },
    stock: 1,
    status: "active",
    location: { city: "GEC, Chittagong", country: "Bangladesh" },
    isFeatured: false,
    views: 180,
    favorites: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const CATEGORY_SHOWCASE = [
  {
    id: "Electronics",
    name: "Smartphones & Gadgets",
    icon: Smartphone,
    count: "14,800+ Deals",
    gradient: "from-blue-600 to-indigo-600",
    glow: "rgba(59, 130, 246, 0.15)",
  },
  {
    id: "Electronics",
    name: "Laptops & Computing",
    icon: Laptop,
    count: "8,300+ Deals",
    gradient: "from-indigo-600 to-purple-600",
    glow: "rgba(99, 102, 241, 0.15)",
  },
  {
    id: "Clothing",
    name: "Fashion & Watches",
    icon: Shirt,
    count: "9,200+ Items",
    gradient: "from-purple-600 to-pink-600",
    glow: "rgba(168, 85, 247, 0.15)",
  },
  {
    id: "Furniture",
    name: "Furniture & Decor",
    icon: Armchair,
    count: "4,600+ Items",
    gradient: "from-amber-500 to-orange-600",
    glow: "rgba(245, 158, 11, 0.15)",
  },
  {
    id: "Vehicles",
    name: "Bikes & Scooters",
    icon: Bike,
    count: "2,100+ Rides",
    gradient: "from-rose-500 to-red-600",
    glow: "rgba(244, 63, 94, 0.15)",
  },
  {
    id: "Music",
    name: "Musical Gear",
    icon: Music,
    count: "1,150+ Gear",
    gradient: "from-cyan-500 to-blue-600",
    glow: "rgba(6, 182, 212, 0.15)",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Bangladesh");
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/listings?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/listings");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── HERO SECTION WITH 3D AMBIENT LIGHTING ── */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden bg-[#090D16] text-white">
        {/* Glow Spheres */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-indigo-600/30 via-purple-600/25 to-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -right-48 w-[400px] h-[400px] bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Live Trust Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-xl mb-8 shadow-inner"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-extrabold text-indigo-200 tracking-wide">
                Bangladesh&apos;s #1 Escrow-Protected Marketplace
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6"
            >
              The Smarter Way to <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Buy & Sell Pre-Loved Items.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
            >
              Join 25,000+ verified users trading genuine smartphones, laptops, vehicles, and furniture safely without middleman fees.
            </motion.p>

            {/* ── Airbnb-Class Interactive Search Hub ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="max-w-3xl mx-auto bg-white/95 backdrop-blur-2xl p-2.5 sm:p-3.5 rounded-3xl shadow-2xl shadow-indigo-950/80 border border-white/40 text-slate-800"
            >
              {/* Tab Selector */}
              <div className="flex items-center gap-2 mb-3 px-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("buy")}
                  className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${
                    activeTab === "buy"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  🔍 I Want to Buy
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/add-product")}
                  className="px-4 py-1.5 rounded-full text-xs font-black bg-amber-100 text-amber-900 hover:bg-amber-200 transition-all flex items-center gap-1.5"
                >
                  <Sparkles size={13} className="text-amber-600" />
                  <span>I Want to Sell</span>
                </button>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2">
                <div className="flex items-center gap-3 px-4 py-2.5 w-full sm:flex-1 bg-slate-50/90 rounded-2xl border border-slate-200/80 focus-within:border-indigo-500 focus-within:bg-white transition-all">
                  <Search size={18} className="text-indigo-600 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search iPhone 15, MacBook M2, Royal Enfield..."
                    className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 placeholder:font-normal"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-44">
                    <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full pl-9 pr-3 py-3 bg-slate-50/90 rounded-2xl border border-slate-200/80 text-xs font-bold text-slate-700 outline-none cursor-pointer"
                    >
                      <option>All Bangladesh</option>
                      <option>Dhaka</option>
                      <option>Chittagong</option>
                      <option>Sylhet</option>
                      <option>Rajshahi</option>
                      <option>Khulna</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn-shiny-primary px-7 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto shadow-md"
                  >
                    <span>Search</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Trending Quick Search Chips */}
            <div className="flex items-center justify-center flex-wrap gap-2 mt-6 text-xs text-slate-400">
              <span className="font-bold text-slate-300">Hot searches:</span>
              {["iPhone 15 Pro", "MacBook Air", "Yamaha FZ-S", "Sony XM5", "Electric Guitar"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => router.push(`/listings?search=${encodeURIComponent(tag)}`)}
                  className="bg-white/5 hover:bg-white/15 text-slate-300 px-3 py-1 rounded-full border border-white/10 transition-colors font-medium"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE MARKETPLACE STATS TICKER ── */}
      <section className="bg-white border-b border-slate-200/80 py-8 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-3xl font-black text-slate-900 tracking-tight">50,000+</span>
              <span className="text-xs font-extrabold text-indigo-600 block mt-1 uppercase tracking-wider">
                Live Listings
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-3xl font-black text-slate-900 tracking-tight">25,000+</span>
              <span className="text-xs font-extrabold text-indigo-600 block mt-1 uppercase tracking-wider">
                Verified Users
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-3xl font-black text-slate-900 tracking-tight">৳ 2.4 Cr+</span>
              <span className="text-xs font-extrabold text-indigo-600 block mt-1 uppercase tracking-wider">
                Saved by Buyers
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-3xl font-black text-slate-900 tracking-tight">100%</span>
              <span className="text-xs font-extrabold text-emerald-600 block mt-1 uppercase tracking-wider">
                Escrow Protected
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── POPULAR CATEGORIES GRID ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
                Explore Marketplace
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
                Curated by Category
              </h2>
            </div>
            <Link
              href="/categories"
              className="text-xs font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs"
            >
              <span>View All 12 Categories</span>
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {CATEGORY_SHOWCASE.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={`/listings?category=${cat.id}`}
                  className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col items-center text-center group relative overflow-hidden"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-400 mt-1">{cat.count}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOT DROPS & FEATURED DEALS ── */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  <Flame size={14} className="text-amber-500" /> Hot Drops Today
                </span>
                <span className="text-xs text-slate-400 font-medium">Verified condition</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
                Featured Verified Listings
              </h2>
            </div>
            <Link
              href="/listings"
              className="btn-shiny-primary px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <span>Explore 500+ Items</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Grid of Ultra-Premium Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY RESELL HUB VS CLASSIFIEDS (COMPETITOR COMPARISON) ── */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest bg-indigo-950/90 px-3.5 py-1.5 rounded-full border border-indigo-800">
              Why We Are Different
            </span>
            <h2 className="text-3xl sm:text-5xl font-black mt-3 mb-4 tracking-tight">
              A Safer Marketplace Experience
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-normal">
              Compare how ReSell Hub protects your hard-earned money versus traditional classifieds.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-700/80 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-3 p-6 sm:p-8 bg-slate-800/90 border-b border-slate-700 font-extrabold text-xs sm:text-sm tracking-wider uppercase">
              <span className="text-slate-400">Feature</span>
              <span className="text-indigo-400 text-center font-black">ReSell Hub</span>
              <span className="text-slate-400 text-center">Regular Classifieds</span>
            </div>

            {[
              { title: "Escrow Payment Protection", resell: true, other: false, desc: "Funds held safely until delivery approval" },
              { title: "ID & Profile Verification", resell: true, other: false, desc: "Known identity for all buyers and sellers" },
              { title: "Instant In-App Chat", resell: true, other: true, desc: "Direct negotiation without sharing private phone" },
              { title: "Condition Transparency Rating", resell: true, other: false, desc: "Detailed 5-point physical condition scale" },
              { title: "Doorstep Courier Pickup", resell: true, other: false, desc: "Integrated shipping across 64 districts" },
            ].map((item, idx) => (
              <div
                key={item.title}
                className={`grid grid-cols-3 p-5 sm:p-6 items-center text-xs sm:text-sm ${
                  idx % 2 === 0 ? "bg-slate-800/30" : "bg-slate-800/50"
                } border-b border-slate-700/40`}
              >
                <div>
                  <h4 className="font-bold text-slate-200">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <div className="flex justify-center">
                  <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 font-black">
                    <Check size={16} />
                  </span>
                </div>
                <div className="flex justify-center">
                  {item.other ? (
                    <span className="w-8 h-8 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center text-xs">
                      <Check size={14} />
                    </span>
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 font-black">
                      <XIcon size={16} />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HIGH-CONVERSION SELLER CTA BANNER ── */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs font-black tracking-widest uppercase bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
            0% Commission on First 3 Listings
          </span>
          <h2 className="text-3xl sm:text-5xl font-black mt-4 mb-4 tracking-tight">
            Turn your unused gadgets & items into instant cash
          </h2>
          <p className="text-indigo-100 max-w-xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
            Create an ad in less than a minute. Reach thousands of active buyers across Bangladesh today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/add-product"
              className="btn-shiny-amber px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-2xl"
            >
              Post an Item for Sale Free
            </Link>
            <Link
              href="/listings"
              className="px-8 py-4 rounded-2xl font-bold text-sm bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md transition-all"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
