"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Zap,
  Flame,
  ChevronRight,
  Smartphone,
  Laptop,
  Shirt,
  Armchair,
  Bike,
  Music,
  Users,
  Package,
  ShoppingCart,
  PlusCircle,
  ShoppingBag,
  Truck,
  ShieldAlert,
} from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import LocationSelector from "@/components/ui/LocationSelector";
import RecentlyViewedSection from "@/components/ui/RecentlyViewedSection";
import productService from "@/services/productService";
import type { Product } from "@/types";

// Popular Dynamic Categories
const DYNAMIC_CATEGORIES = [
  {
    id: "Electronics",
    name: "Phones & Gadgets",
    icon: Smartphone,
    count: "14,800+ Deals",
    gradient: "from-blue-600 to-indigo-600",
    popularSub: "iPhones, Samsung, Pixels",
  },
  {
    id: "Electronics",
    name: "Laptops & Computers",
    icon: Laptop,
    count: "8,300+ Deals",
    gradient: "from-indigo-600 to-purple-600",
    popularSub: "MacBooks, ThinkPads, GPUs",
  },
  {
    id: "Furniture",
    name: "Furniture & Decor",
    icon: Armchair,
    count: "4,600+ Items",
    gradient: "from-amber-500 to-orange-600",
    popularSub: "Chairs, Sofas, Desks",
  },
  {
    id: "Vehicles",
    name: "Bikes & Scooters",
    icon: Bike,
    count: "2,100+ Rides",
    gradient: "from-rose-500 to-red-600",
    popularSub: "Yamaha, Honda, Suzuki",
  },
  {
    id: "Clothing",
    name: "Fashion & Watches",
    icon: Shirt,
    count: "9,200+ Items",
    gradient: "from-purple-600 to-pink-600",
    popularSub: "Jackets, Sneakers, Bags",
  },
  {
    id: "Music",
    name: "Musical Gear",
    icon: Music,
    count: "1,150+ Gear",
    gradient: "from-cyan-500 to-blue-600",
    popularSub: "Guitars, Keys, Amps",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Bangladesh");
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("All");

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Dynamic fetch from backend
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoadingProducts(true);
        const data = await productService.getFeaturedProducts();
        if (data.success && data.data?.products) {
          setProducts(data.data.products);
        } else {
          setProducts([]);
        }
      } catch {
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchFeatured();

    const handleUpdate = () => { fetchFeatured(); };
    window.addEventListener("resellhub_products_updated", handleUpdate);
    return () => { window.removeEventListener("resellhub_products_updated", handleUpdate); };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/listings?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/listings");
    }
  };

  // Only display products with isFeatured: true in the Featured section (exactly 4 products)
  const featuredOnly = products.filter((p) => Boolean(p.isFeatured));
  const filteredFeatured = (activeCategoryTab === "All"
    ? featuredOnly
    : featuredOnly.filter((p) => p.category?.toLowerCase() === activeCategoryTab.toLowerCase())).slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* ============================================================
          1. HERO BANNER WITH AMBIENT 3D LIGHTING & RESPONSIVE SEARCH
          ============================================================ */}
      <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-32 overflow-hidden bg-[#090D16] text-white">
        {/* Glow Spheres */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[350px] sm:w-[600px] lg:w-[750px] h-[300px] sm:h-[500px] bg-gradient-to-tr from-indigo-600/30 via-purple-600/25 to-cyan-500/20 rounded-full blur-[90px] sm:blur-[130px] pointer-events-none" />
        <div className="absolute top-1/2 -right-48 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-amber-500/15 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Live Trust Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-xl mb-6 sm:mb-8 shadow-inner"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] sm:text-xs font-extrabold text-indigo-200 tracking-wide">
                Bangladesh&apos;s #1 Escrow-Protected Marketplace
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.12] sm:leading-[1.08] mb-4 sm:mb-6"
            >
              The Modern Way to <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Buy & Sell Second-Hand.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm sm:text-base lg:text-xl text-slate-300 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-normal px-2"
            >
              Join 25,000+ verified users trading genuine smartphones, laptops, vehicles, and furniture safely without middleman cuts.
            </motion.p>

            {/* ── Interactive Search Hub ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-3xl mx-auto bg-white/95 backdrop-blur-2xl p-2.5 sm:p-3.5 rounded-2xl sm:rounded-3xl shadow-2xl shadow-indigo-950/80 border border-white/40 text-slate-800"
            >
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2.5 w-full sm:flex-1 bg-slate-50/90 rounded-xl sm:rounded-2xl border border-slate-200/80 focus-within:border-indigo-500 focus-within:bg-white transition-all">
                  <Search size={18} className="text-indigo-600 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search iPhone 15, MacBook M2, Yamaha..."
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 placeholder:font-normal"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <LocationSelector
                    value={selectedCity}
                    onChange={setSelectedCity}
                    className="w-full sm:w-44 lg:w-48 text-xs"
                  />

                  <button
                    type="submit"
                    className="btn-shiny-primary px-6 sm:px-7 py-3 rounded-xl sm:rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto shadow-md"
                  >
                    <span>Search</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Quick action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 px-4 sm:px-0">
              <Link
                href="/listings"
                className="btn-shiny-primary w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingBag size={16} />
                <span>Explore 50K+ Listings</span>
              </Link>
              <Link
                href="/add-product"
                className="btn-shiny-amber w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
              >
                <PlusCircle size={16} />
                <span>Post a Free Ad (0% Fee)</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. DYNAMIC MARKETPLACE STATISTICS TICKER
          ============================================================ */}
      <section className="bg-white border-b border-slate-200/80 py-6 sm:py-10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-50/80 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black shrink-0 shadow-xs">
                <Package className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <span className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight block">50,000+</span>
                <span className="text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider">Total Products</span>
              </div>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-50/80 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black shrink-0 shadow-xs">
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <span className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight block">8,500+</span>
                <span className="text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider">Verified Sellers</span>
              </div>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-50/80 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black shrink-0 shadow-xs">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <span className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight block">25,000+</span>
                <span className="text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider">Active Buyers</span>
              </div>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-50/80 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black shrink-0 shadow-xs">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <span className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight block">38,000+</span>
                <span className="text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider">Completed Orders</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          3. POPULAR DYNAMIC CATEGORIES
          ============================================================ */}
      <section className="py-12 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <span className="text-[10px] sm:text-xs font-extrabold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-indigo-100">
                Popular Categories
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
                Discover by Category
              </h2>
            </div>
            <Link
              href="/categories"
              className="text-xs font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 group bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs w-fit"
            >
              <span>View All 12 Categories</span>
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
            {DYNAMIC_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={`/listings?category=${cat.id}`}
                  className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col items-center text-center group relative overflow-hidden"
                >
                  <div
                    className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${cat.gradient} text-white flex items-center justify-center shadow-md mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 mt-0.5 sm:mt-1">{cat.count}</span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400/80 mt-0.5 truncate max-w-[110px] hidden sm:block">{cat.popularSub}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          4. DYNAMIC FEATURED PRODUCTS (WITH LIVE FILTER TABS)
          ============================================================ */}
      <section className="py-12 sm:py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4 sm:gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[10px] sm:text-xs font-black text-amber-700 bg-amber-50 px-2.5 sm:px-3 py-1 rounded-full border border-amber-200">
                  <Flame size={13} className="text-amber-500" /> Hot Picks
                </span>
                <span className="text-[11px] sm:text-xs text-slate-400 font-medium">100% Genuine Verified</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
                Featured Verified Listings
              </h2>
            </div>

            {/* Quick Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 max-w-full scrollbar-none">
              {["All", "Electronics", "Furniture", "Vehicles", "Clothing"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveCategoryTab(tab)}
                  className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-black shrink-0 transition-all ${
                    activeCategoryTab === tab
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab === "All" ? "All Items" : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Grid with Loader State */}
          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-slate-100 rounded-2xl sm:rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : filteredFeatured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {filteredFeatured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-200">
              <ShoppingBag size={36} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-700">No featured products found</h3>
              <p className="text-xs text-slate-400 mt-1">Browse all available listings from the marketplace.</p>
              <Link href="/listings" className="mt-4 inline-block btn-shiny-primary px-5 py-2 rounded-xl text-xs font-black uppercase">
                View All Listings
              </Link>
            </div>
          )}

          <div className="text-center mt-10 sm:mt-12">
            <Link
              href="/listings"
              className="btn-shiny-primary px-7 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-black text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-lg"
            >
              <span>Explore All 50,000+ Items</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* ── Recently Viewed Products (Dynamic) ── */}
          <div className="mt-8">
            <RecentlyViewedSection />
          </div>
        </div>
      </section>

      {/* ============================================================
          5. THE RESELL HUB ESCROW PROTOCOL (SAFETY ARCHITECTURE)
          ============================================================ */}
      <section className="py-16 sm:py-24 bg-[#070B14] text-white relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-0 left-1/4 w-[300px] sm:w-[600px] h-[250px] sm:h-[350px] bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[300px] sm:w-[500px] h-[250px] sm:h-[350px] bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-3 sm:mb-4">
              <ShieldCheck size={14} className="animate-pulse" /> 100% Scam-Free Guarantee
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              The ReSell Hub <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-400">Escrow Protocol</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm lg:text-base mt-3 sm:mt-4 max-w-2xl mx-auto leading-relaxed">
              We eliminate traditional marketplace risks. Your payment remains locked in our secure vault until you personally inspect and approve the item.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                step: "01",
                icon: ShoppingCart,
                color: "indigo",
                title: "1. Secure Order & Vaulting",
                desc: "Buyer purchases item. 100% of the funds are deposited into our encrypted escrow vault, not sent directly to seller.",
                badge: "Funds 100% Locked",
              },
              {
                step: "02",
                icon: Truck,
                color: "cyan",
                title: "2. Verified Doorstep Pickup",
                desc: "Seller packs item. Our verified courier partners (RedX / SteadFast) pick up and provide real-time GPS tracking.",
                badge: "Tracked 64 Districts",
              },
              {
                step: "03",
                icon: Search,
                color: "amber",
                title: "3. 48-Hour Test Window",
                desc: "Buyer receives parcel and gets 48 hours to thoroughly test functionality, battery health, and authenticity.",
                badge: "Inspection Guaranteed",
              },
              {
                step: "04",
                icon: Zap,
                color: "emerald",
                title: "4. Instant Automated Payout",
                desc: "Buyer approves item. Escrow instantly releases payout to seller via bKash, Nagad, or direct bank transfer in 30s.",
                badge: "Instant 30s Payout",
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.step}
                  className="relative p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl hover:border-slate-700 transition-all group flex flex-col justify-between"
                >
                  <div className="absolute top-5 right-5 sm:top-6 sm:right-6 text-xl sm:text-2xl font-black text-slate-800 group-hover:text-slate-700 transition-colors">
                    {card.step}
                  </div>

                  <div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform text-white shadow-inner">
                      <Icon size={24} className={card.color === "emerald" ? "text-emerald-400" : card.color === "cyan" ? "text-cyan-400" : card.color === "amber" ? "text-amber-400" : "text-indigo-400"} />
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-white mb-2">{card.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6 font-normal">
                      {card.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/60 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[11px] font-bold text-slate-300">{card.badge}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 sm:mt-12 p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-950/40 via-indigo-950/40 to-slate-900 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 backdrop-blur-xl text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-white">100% Money-Back Buyer Protection</h4>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">If the received item doesn&apos;t match the ad or is defective, get a full refund instantly.</p>
              </div>
            </div>
            <Link
              href="/listings"
              className="btn-shiny-emerald w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-xl text-xs font-black uppercase tracking-wider shrink-0"
            >
              Shop with Escrow Safety
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          6. COMPARISON MATRIX (RESELL HUB VS TRADITIONAL CLASSIFIEDS)
          ============================================================ */}
      <section className="py-16 sm:py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <span className="text-[10px] sm:text-xs font-extrabold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
              Why We Are Different
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
              Why 50,000+ Bangladeshis Choose ReSell Hub
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-2">
              Say goodbye to dangerous stranger meetups, fake payment screenshots, and zero return policies.
            </p>
          </div>

          {/* Mobile Swipe Hint */}
          <div className="md:hidden flex items-center justify-center gap-1.5 text-[11px] font-bold text-indigo-600 bg-indigo-50 py-1 px-3 rounded-full mb-3 w-fit mx-auto">
            <span>← Swipe horizontally to see comparison →</span>
          </div>

          <div className="overflow-x-auto rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm">
            <div className="min-w-[620px] bg-slate-50 p-5 sm:p-8">
              <div className="grid grid-cols-12 pb-3.5 border-b border-slate-200 text-xs font-black text-slate-400 uppercase tracking-wider">
                <div className="col-span-6">Marketplace Feature</div>
                <div className="col-span-3 text-center text-indigo-600 font-extrabold flex items-center justify-center gap-1">
                  <Sparkles size={14} /> ReSell Hub
                </div>
                <div className="col-span-3 text-center text-slate-400 font-normal">
                  Traditional Classifieds
                </div>
              </div>

              {[
                {
                  feature: "Escrow Payment Vault (Funds released after buyer approval)",
                  rhText: "100% Protected",
                  tradText: "High Scam Risk",
                },
                {
                  feature: "Doorstep Courier Pickup & Delivery with Live GPS",
                  rhText: "64 Districts",
                  tradText: "Risky Meetups",
                },
                {
                  feature: "48-Hour Inspection & Full Return Window",
                  rhText: "Full Refund Policy",
                  tradText: "No Returns",
                },
                {
                  feature: "Verified NID / Merchant Identity Badges",
                  rhText: "Verified Trust Profiles",
                  tradText: "Fake Burner Accounts",
                },
                {
                  feature: "Instant Automated bKash & Bank Payouts",
                  rhText: "30-Sec Release",
                  tradText: "Manual Handover",
                },
                {
                  feature: "24/7 Dedicated Dispute Mediation Team",
                  rhText: "Live Arbitration",
                  tradText: "Zero Recourse",
                },
              ].map((row, idx) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-12 py-3.5 items-center text-xs sm:text-sm border-b border-slate-200/60 last:border-0 ${
                    idx % 2 === 0 ? "bg-white/60" : "bg-transparent"
                  } px-3 rounded-xl`}
                >
                  <div className="col-span-6 font-bold text-slate-800">{row.feature}</div>
                  <div className="col-span-3 text-center font-black text-emerald-600 flex items-center justify-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black">✓</span>
                    <span>{row.rhText}</span>
                  </div>
                  <div className="col-span-3 text-center text-rose-500 font-medium flex items-center justify-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px] font-black">✕</span>
                    <span className="text-slate-500">{row.tradText}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          7. VIP MOBILE EXPERIENCE & SELLER HIGHLIGHT
          ============================================================ */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-[#0B101D] via-[#0E1528] to-[#121B33] text-white relative overflow-hidden">
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 -right-32 w-80 h-80 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-5 sm:space-y-6">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-indigo-300 bg-indigo-900/60 px-3.5 py-1.5 rounded-full border border-indigo-700">
                Seamless Mobile Experience
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Trade Anytime, Anywhere with Instant Live Push
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed">
                Connect directly with buyers and sellers through end-to-end encrypted messaging, receive real-time price-drop alerts, and track your escrow payouts in real-time.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
                {[
                  { title: "Real-time Live Chat", desc: "Instant negotiations & audio/image sharing" },
                  { title: "Instant bKash Checkout", desc: "1-tap escrow deposits & cashouts" },
                  { title: "Price Drop Alerter", desc: "Get notified when saved items reduce price" },
                  { title: "GPS Radius Search", desc: "Discover verified items in your neighborhood" },
                ].map((item) => (
                  <div key={item.title} className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <h4 className="text-xs sm:text-sm font-black text-indigo-300 mb-0.5">{item.title}</h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3">
                <Link
                  href="/add-product"
                  className="btn-shiny-primary px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs uppercase tracking-wider text-center shadow-xl"
                >
                  Start Selling in 60 Seconds
                </Link>
                <Link
                  href="/listings"
                  className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-xs bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all text-white text-center"
                >
                  Browse Marketplace
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 flex justify-center">
              {/* Modern Showcase Card */}
              <div className="w-full max-w-md p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-2xl relative">
                <div className="flex items-center justify-between mb-5 sm:mb-6 pb-3.5 sm:pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-black text-white">ReSell Hub Shield™</div>
                      <div className="text-[10px] text-emerald-400 font-bold">● Active Escrow Protection</div>
                    </div>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase text-indigo-300 bg-indigo-950 px-2 sm:px-2.5 py-1 rounded-md border border-indigo-800">
                    Live Verified
                  </span>
                </div>

                <div className="space-y-3.5">
                  <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&auto=format&fit=crop&q=80"
                        alt="Product"
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover"
                      />
                      <div>
                        <div className="text-xs font-black text-white">iPhone 15 Pro 128GB</div>
                        <div className="text-[10px] text-slate-400">Buyer: Tanzid H. (Gulshan)</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-emerald-400">৳94,000</div>
                      <div className="text-[9px] text-slate-400">In Escrow Vault</div>
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-800/80 border border-slate-700 text-xs space-y-2">
                    <div className="flex justify-between text-slate-300 text-[11px]">
                      <span>Courier Dispatch:</span>
                      <strong className="text-emerald-400 font-bold">SteadFast Express #SF-9842</strong>
                    </div>
                    <div className="flex justify-between text-slate-300 text-[11px]">
                      <span>Inspection Window:</span>
                      <strong className="text-cyan-400 font-bold">48 Hours Remaining</strong>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mt-1">
                      <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full w-3/4" />
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-6 pt-3.5 border-t border-slate-800 text-center">
                  <span className="text-[10px] sm:text-[11px] text-slate-400">
                    🔒 Protected by 256-bit SSL Escrow encryption
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          8. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION)
          ============================================================ */}
      <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-[10px] sm:text-xs font-extrabold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
              Clear & Transparent
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-2">
              Everything you need to know about buying, selling, and escrow protection on ReSell Hub.
            </p>
          </div>

          <div className="space-y-3.5 sm:space-y-4">
            {[
              {
                q: "How does the Escrow Payment system protect me?",
                a: "When you buy an item, your money is held securely in our Escrow Vault instead of going directly to the seller. The seller only receives the payout after you receive the item, test it during the 48-hour inspection window, and confirm it matches the description.",
              },
              {
                q: "What if the item I receive is broken or counterfeit?",
                a: "If the item is not as described, simply click 'Report Issue' in your order dashboard within 48 hours. Our dispute team will freeze the funds, provide a prepaid return courier slip, and issue a 100% full refund once returned.",
              },
              {
                q: "How quickly do sellers receive their money?",
                a: "Once the buyer confirms receipt or the 48-hour inspection window passes without dispute, funds are automatically transferred directly to your bKash, Nagad, or bank account within 30 seconds.",
              },
              {
                q: "How does nationwide courier delivery work?",
                a: "Once an item is ordered, a RedX or SteadFast courier will arrive at the seller's doorstep to pick up the parcel. Both buyer and seller receive live SMS and in-app tracking across all 64 districts in Bangladesh.",
              },
              {
                q: "Is there any fee to post an ad for sale?",
                a: "No! Posting ads on ReSell Hub is 100% free for standard listings. We only take a nominal escrow processing fee when an item successfully sells.",
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="group bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-xs open:shadow-md transition-all cursor-pointer"
              >
                <summary className="font-black text-slate-900 text-xs sm:text-base flex items-center justify-between list-none">
                  <span>{faq.q}</span>
                  <ChevronRight size={18} className="text-indigo-600 group-open:rotate-90 transition-transform shrink-0 ml-2" />
                </summary>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100 font-normal">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          9. ULTRA-LUXURY VIP CLUB & HIGH-CONVERTING FINAL CTA
          ============================================================ */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 text-white relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[200px] sm:h-[300px] bg-indigo-500/20 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] sm:w-[500px] h-[200px] sm:h-[300px] bg-emerald-500/15 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-300 mb-4 sm:mb-6 shadow-inner">
            <Sparkles size={14} className="text-amber-400 animate-spin" /> VIP Trader Access — 0% Commission
          </span>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black mt-2 mb-4 sm:mb-6 tracking-tight leading-tight">
            Turn Your Unused Tech Into <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300">Instant Cash</span>
          </h2>

          <p className="text-slate-300 max-w-xl mx-auto mb-8 sm:mb-10 text-xs sm:text-sm lg:text-base leading-relaxed font-normal px-2">
            Join over 50,000 verified buyers and sellers across Bangladesh. List your first product in 60 seconds with 100% Escrow Protection.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0">
            <Link
              href="/add-product"
              className="btn-shiny-amber w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-2xl hover:scale-105 transition-transform"
            >
              Post an Item for Sale Free
            </Link>
            <Link
              href="/listings"
              className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-xl transition-all text-white"
            >
              Explore All Listings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
