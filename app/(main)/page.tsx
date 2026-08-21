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
  Car,
  Bike,
  Watch,
  Music,
} from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { CATEGORIES } from "@/lib/constants";
import type { Product } from "@/types";

// Mock Showcase Products for instant rich visual rendering
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
      location: { city: "Dhaka", country: "Bangladesh" },
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

const POPULAR_CATEGORIES = [
  { id: "Electronics", name: "Electronics", icon: Laptop, count: "12,400+ items", bg: "bg-blue-50 text-blue-600 border-blue-100" },
  { id: "Clothing", name: "Fashion & Clothes", icon: Shirt, count: "8,900+ items", bg: "bg-purple-50 text-purple-600 border-purple-100" },
  { id: "Furniture", name: "Furniture & Decor", icon: Armchair, count: "4,200+ items", bg: "bg-amber-50 text-amber-600 border-amber-100" },
  { id: "Books", name: "Books & Study", icon: BookOpen, count: "3,100+ items", bg: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { id: "Vehicles", name: "Bikes & Cars", icon: Bike, count: "1,800+ items", bg: "bg-red-50 text-red-600 border-red-100" },
  { id: "Music", name: "Musical Instruments", icon: Music, count: "950+ items", bg: "bg-indigo-50 text-indigo-600 border-indigo-100" },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Bangladesh");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/listings?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/listings");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-20 lg:py-28">
        {/* Background glow ornaments */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold tracking-wide text-indigo-200 mb-6 backdrop-blur-md"
            >
              <Sparkles size={14} className="text-amber-400" />
              <span>Next-Gen Second-Hand Marketplace in Bangladesh</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] mb-6"
            >
              Buy Pre-Loved. <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">
                Sell Pre-Owned.
              </span>{" "}
              Save Smart.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed"
            >
              Discover thousands of verified second-hand items from trusted buyers & sellers across Dhaka, Chittagong, Sylhet, and beyond.
            </motion.p>

            {/* ── Airbnb-style Search Box ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-2 sm:p-3 rounded-2xl sm:rounded-full shadow-2xl shadow-indigo-950/50 max-w-2xl mx-auto text-slate-800"
            >
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2">
                <div className="flex items-center gap-3 px-4 py-2 w-full sm:w-auto sm:flex-1 border-b sm:border-b-0 sm:border-r border-slate-100">
                  <Search size={18} className="text-indigo-600 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search iPhone, MacBook, Bike, Sofa..."
                    className="w-full bg-transparent text-sm sm:text-base font-medium outline-none placeholder:text-slate-400"
                  />
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 w-full sm:w-auto">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="text-xs sm:text-sm font-semibold bg-slate-100 text-slate-700 py-2 px-3 rounded-xl sm:rounded-full outline-none cursor-pointer"
                  >
                    <option>All Bangladesh</option>
                    <option>Dhaka</option>
                    <option>Chittagong</option>
                    <option>Sylhet</option>
                    <option>Rajshahi</option>
                    <option>Khulna</option>
                  </select>

                  <button
                    type="submit"
                    className="btn btn-primary w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-full font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                  >
                    <span>Search</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Quick tags */}
            <div className="flex items-center justify-center flex-wrap gap-2 mt-6 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Trending:</span>
              {["iPhone 15", "MacBook Air", "Royal Enfield", "Gaming PC", "Acoustic Guitar"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => router.push(`/listings?search=${encodeURIComponent(tag)}`)}
                  className="bg-white/5 hover:bg-white/15 text-slate-300 px-3 py-1 rounded-full border border-white/10 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST & STATS BAR ── */}
      <section className="bg-white border-b border-slate-200/80 py-8 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-indigo-600 tracking-tight">50,000+</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Verified Listings</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-indigo-600 tracking-tight">25,000+</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Happy Buyers & Sellers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-indigo-600 tracking-tight">৳ 2.4 Cr+</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Trade Volume</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-indigo-600 tracking-tight">100%</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Secure Escrow/Stripe</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── POPULAR CATEGORIES ── */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Explore Categories
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                What are you shopping for?
              </h2>
            </div>
            <Link
              href="/categories"
              className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
            >
              <span>All Categories</span>
              <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {POPULAR_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  href={`/listings?category=${cat.id}`}
                  className="bg-white p-5 rounded-2xl border border-slate-200/70 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3.5 border ${cat.bg} transition-transform group-hover:scale-110`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs text-slate-400 mt-1 font-medium">{cat.count}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED & FRESH LISTINGS ── */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  <Flame size={14} className="text-amber-500" /> Hot Picks
                </span>
                <span className="text-xs font-medium text-slate-500">Updated just now</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                Featured Deals & Recent Drops
              </h2>
            </div>
            <Link
              href="/listings"
              className="btn btn-secondary text-sm font-semibold rounded-xl"
            >
              Browse All 500+ Items
            </Link>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_PRODUCTS.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS (Marketplace Safety) ── */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-950/80 px-3.5 py-1.5 rounded-full border border-indigo-800">
              Simple & Safe Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 mb-4">
              How ReSell Hub Works
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Buying and selling second-hand goods shouldn&apos;t be sketchy. We make it secure, transparent, and seamless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700/60 backdrop-blur-sm relative">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-black text-xl mb-6 border border-indigo-500/30">
                1
              </div>
              <h3 className="text-xl font-bold mb-2.5">Post an Ad in 60s</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Take a few photos of your pre-loved gadget, furniture, or clothes. Set a fair price and publish free to thousands of buyers.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700/60 backdrop-blur-sm relative">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-black text-xl mb-6 border border-purple-500/30">
                2
              </div>
              <h3 className="text-xl font-bold mb-2.5">Chat & Negotiate</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Connect directly with verified buyers via instant messaging. Agree on meetup location or opt for door-to-door delivery.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700/60 backdrop-blur-sm relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-black text-xl mb-6 border border-emerald-500/30">
                3
              </div>
              <h3 className="text-xl font-bold mb-2.5">Pay & Trade Safely</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Complete your transaction securely via Stripe online payment protection or cash on in-person verification. Leave a rating!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS / SOCIAL PROOF ── */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Community Love
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Loved by 25,000+ Bangladeshi Traders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "Sold my gaming laptop within 24 hours of posting! Buyer paid through Stripe, no hassle of fake notes or bargaining.",
                name: "Rakibul Islam",
                role: "Seller from Dhanmondi",
                stars: 5,
              },
              {
                quote: "Found an almost new Sony camera for 40% off original price. The seller verified condition in person before I paid.",
                name: "Sumaiya Anjum",
                role: "Buyer from Gulshan",
                stars: 5,
              },
              {
                quote: "The cleanest UI among all marketplace platforms in Bangladesh. Filtering by condition and location saves so much time.",
                name: "Mahir Faysal",
                role: "Frequent Buyer & Seller",
                stars: 5,
              },
            ].map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-amber-400 mb-3">
                    {[...Array(t.stars)].map((_, idx) => (
                      <Star key={idx} size={16} fill="#fbbf24" stroke="#fbbf24" />
                    ))}
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed italic mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{t.name}</h4>
                    <span className="text-[11px] text-slate-500">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION BANNER ── */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Turn your unused items into cash today
          </h2>
          <p className="text-indigo-100 max-w-lg mx-auto mb-8 text-sm sm:text-base">
            Join ReSell Hub for free. Post your first listing in under a minute and connect with eager buyers immediately.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-3.5 bg-white text-indigo-700 font-bold rounded-xl shadow-xl hover:bg-slate-50 transition-all transform hover:-translate-y-0.5"
            >
              Start Selling Free
            </Link>
            <Link
              href="/listings"
              className="px-8 py-3.5 bg-indigo-800/60 border border-white/20 text-white font-bold rounded-xl hover:bg-indigo-800 transition-all"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
