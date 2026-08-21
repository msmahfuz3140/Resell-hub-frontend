"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  Leaf,
  Users,
  Package,
  ShoppingCart,
  Recycle,
  BadgePercent,
  PlusCircle,
  Headphones,
  ShoppingBag,
} from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import productService from "@/services/productService";
import type { Product } from "@/types";

// Curated Fallback Featured Products
const FALLBACK_FEATURED_PRODUCTS: Product[] = [
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
  {
    _id: "prod-5",
    title: "Canon EOS R50 Mirrorless Camera + 18-45mm Lens",
    description: "Vlogger pack with 4K recording and dual pixel autofocus.",
    price: 62000,
    originalPrice: 78000,
    category: "Electronics",
    condition: "Like New",
    images: [
      {
        url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80",
        publicId: "canon_r50",
        isPrimary: true,
      },
    ],
    sellerInfo: {
      sellerId: "user-5",
      name: "Farhan Tariq",
      rating: 4.9,
      totalSales: 16,
      location: { city: "Mirpur, Dhaka", country: "Bangladesh" },
    },
    stock: 1,
    status: "active",
    location: { city: "Mirpur, Dhaka", country: "Bangladesh" },
    isFeatured: true,
    views: 540,
    favorites: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "prod-6",
    title: "Yamaha FZ-S Version 3.0 (Matte Dark Blue)",
    description: "Single hand driven with digital smart registration card.",
    price: 195000,
    originalPrice: 245000,
    category: "Vehicles",
    condition: "Good",
    images: [
      {
        url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80",
        publicId: "yamaha_fzs",
        isPrimary: true,
      },
    ],
    sellerInfo: {
      sellerId: "user-6",
      name: "Rifat Hasan",
      rating: 4.6,
      totalSales: 4,
      location: { city: "Sylhet", country: "Bangladesh" },
    },
    stock: 1,
    status: "active",
    location: { city: "Sylhet", country: "Bangladesh" },
    isFeatured: false,
    views: 1240,
    favorites: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "prod-7",
    title: "Vintage Cowhide Leather Biker Jacket (Size M)",
    description: "Genuine heavy-duty leather. Worn 3-4 times in winter only.",
    price: 4500,
    originalPrice: 9000,
    category: "Clothing",
    condition: "Good",
    images: [
      {
        url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
        publicId: "leather_biker",
        isPrimary: true,
      },
    ],
    sellerInfo: {
      sellerId: "user-7",
      name: "Ayman Sadiq",
      rating: 4.8,
      totalSales: 7,
      location: { city: "Banani, Dhaka", country: "Bangladesh" },
    },
    stock: 1,
    status: "active",
    location: { city: "Banani, Dhaka", country: "Bangladesh" },
    isFeatured: false,
    views: 290,
    favorites: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "prod-8",
    title: "Yamaha Pacifica 112V Electric Guitar + Fender Frontman Amp",
    description: "Complete studio pack with padded gig bag and gold-plated cable.",
    price: 24000,
    originalPrice: 32000,
    category: "Music",
    condition: "Like New",
    images: [
      {
        url: "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=600&auto=format&fit=crop&q=80",
        publicId: "yamaha_guitar",
        isPrimary: true,
      },
    ],
    sellerInfo: {
      sellerId: "user-8",
      name: "Tahsan Ali",
      rating: 5.0,
      totalSales: 15,
      location: { city: "Dhanmondi, Dhaka", country: "Bangladesh" },
    },
    stock: 1,
    status: "active",
    location: { city: "Dhanmondi, Dhaka", country: "Bangladesh" },
    isFeatured: true,
    views: 670,
    favorites: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Popular Dynamic Categories
const DYNAMIC_CATEGORIES = [
  {
    id: "Electronics",
    name: "Mobile Phones & Gadgets",
    icon: Smartphone,
    count: "14,800+ Deals",
    gradient: "from-blue-600 to-indigo-600",
    glow: "rgba(59, 130, 246, 0.2)",
    popularSub: "iPhones, Samsung, Pixels",
  },
  {
    id: "Electronics",
    name: "Laptops & Computers",
    icon: Laptop,
    count: "8,300+ Deals",
    gradient: "from-indigo-600 to-purple-600",
    glow: "rgba(99, 102, 241, 0.2)",
    popularSub: "MacBooks, ThinkPads, GPUs",
  },
  {
    id: "Furniture",
    name: "Furniture & Decor",
    icon: Armchair,
    count: "4,600+ Items",
    gradient: "from-amber-500 to-orange-600",
    glow: "rgba(245, 158, 11, 0.2)",
    popularSub: "Ergonomic Chairs, Sofas, Beds",
  },
  {
    id: "Vehicles",
    name: "Motorcycles & Scooters",
    icon: Bike,
    count: "2,100+ Rides",
    gradient: "from-rose-500 to-red-600",
    glow: "rgba(244, 63, 94, 0.2)",
    popularSub: "Yamaha, Honda, Royal Enfield",
  },
  {
    id: "Clothing",
    name: "Fashion & Watches",
    icon: Shirt,
    count: "9,200+ Items",
    gradient: "from-purple-600 to-pink-600",
    glow: "rgba(168, 85, 247, 0.2)",
    popularSub: "Jackets, Sneakers, Timepieces",
  },
  {
    id: "Music",
    name: "Musical Instruments",
    icon: Music,
    count: "1,150+ Gear",
    gradient: "from-cyan-500 to-blue-600",
    glow: "rgba(6, 182, 212, 0.2)",
    popularSub: "Guitars, Keyboards, Drums",
  },
];

// Trusted Verified Sellers
const TRUSTED_SELLERS = [
  {
    id: "seller-1",
    name: "Tanzid Hossain",
    handle: "@tanzid_tech",
    rating: 4.9,
    reviews: 142,
    sales: "৳ 14.5 Lakh+",
    badge: "Top Rated Seller",
    specialty: "Apple Products & Audio",
    city: "Gulshan, Dhaka",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "seller-2",
    name: "Nabila Rahman",
    handle: "@nabila_gear",
    rating: 5.0,
    reviews: 89,
    sales: "৳ 8.2 Lakh+",
    badge: "Verified Merchant",
    specialty: "Cameras & Lenses",
    city: "Dhanmondi, Dhaka",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "seller-3",
    name: "Sabbir Ahmed",
    handle: "@sabbir_deals",
    rating: 4.8,
    reviews: 210,
    sales: "৳ 22.0 Lakh+",
    badge: "Super Seller",
    specialty: "Laptops & Workstations",
    city: "Uttara, Dhaka",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "seller-4",
    name: "Imran Khan",
    handle: "@imran_furniture",
    rating: 4.9,
    reviews: 64,
    sales: "৳ 6.8 Lakh+",
    badge: "Verified Local",
    specialty: "Ergonomic Furniture",
    city: "GEC, Chittagong",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
  },
];

// Success Stories
const SUCCESS_STORIES = [
  {
    quote: "I sold my MacBook Pro in under 18 hours. The buyer opted for Escrow checkout, making the transaction 100% stress-free without any cash counting hassle.",
    name: "Rakibul Islam",
    role: "Software Engineer",
    itemTraded: "MacBook Pro M1 (16GB)",
    price: "৳ 98,000",
    stars: 5,
    userType: "Seller from Dhaka",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  },
  {
    quote: "Saved almost ৳ 35,000 buying a pristine Sony mirrorless camera. The seller allowed me to inspect hardware before releasing payment from Escrow.",
    name: "Sumaiya Anjum",
    role: "Content Creator",
    itemTraded: "Sony Alpha A7 III",
    price: "৳ 1,25,000",
    stars: 5,
    userType: "Buyer from Gulshan",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
  {
    quote: "The interface is lightyears ahead of any old classified board. Clean condition filters, real seller ratings, and zero spam messages.",
    name: "Mahir Faysal",
    role: "University Student",
    itemTraded: "Yamaha FZ-S V3",
    price: "৳ 1,90,000",
    stars: 5,
    userType: "Frequent Buyer & Seller",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Bangladesh");
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("All");

  const [products, setProducts] = useState<Product[]>(FALLBACK_FEATURED_PRODUCTS);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Dynamic fetch from backend
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoadingProducts(true);
        const data = await productService.getFeaturedProducts();
        if (data.success && data.data?.products && data.data.products.length > 0) {
          setProducts(data.data.products);
        }
      } catch {
        // Use rich fallback products
        setProducts(FALLBACK_FEATURED_PRODUCTS);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/listings?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/listings");
    }
  };

  const filteredFeatured = activeCategoryTab === "All"
    ? products
    : products.filter((p) => p.category === activeCategoryTab);

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* ============================================================
          1. HERO BANNER WITH AMBIENT 3D LIGHTING & STATS
          ============================================================ */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden bg-[#090D16] text-white">
        {/* Glow Spheres */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[750px] h-[520px] bg-gradient-to-tr from-indigo-600/30 via-purple-600/25 to-cyan-500/20 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/2 -right-48 w-[400px] h-[400px] bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Live Trust Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-xl mb-8 shadow-inner"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-extrabold text-indigo-200 tracking-wide">
                Bangladesh&apos;s #1 Escrow-Protected Marketplace
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6"
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
              className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
            >
              Join 25,000+ verified users trading genuine smartphones, laptops, vehicles, and furniture safely without middleman cuts.
            </motion.p>

            {/* ── Interactive Search Hub ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-3xl mx-auto bg-white/95 backdrop-blur-2xl p-2.5 sm:p-3.5 rounded-3xl shadow-2xl shadow-indigo-950/80 border border-white/40 text-slate-800"
            >
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2">
                <div className="flex items-center gap-3 px-4 py-2.5 w-full sm:flex-1 bg-slate-50/90 rounded-2xl border border-slate-200/80 focus-within:border-indigo-500 focus-within:bg-white transition-all">
                  <Search size={18} className="text-indigo-600 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search iPhone 15, MacBook M2, Royal Enfield, Sofa..."
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

            {/* Quick action buttons & Trending tags */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Link
                href="/listings"
                className="btn-shiny-primary px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
              >
                <ShoppingBag size={16} />
                <span>Explore 50K+ Listings</span>
              </Link>
              <Link
                href="/add-product"
                className="btn-shiny-amber px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
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
      <section className="bg-white border-b border-slate-200/80 py-10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-3xl bg-slate-50/80 border border-slate-100 flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black shrink-0 shadow-xs">
                <Package size={26} />
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 tracking-tight block">50,000+</span>
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Total Products</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-3xl bg-slate-50/80 border border-slate-100 flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black shrink-0 shadow-xs">
                <Users size={26} />
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 tracking-tight block">8,500+</span>
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Verified Sellers</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-3xl bg-slate-50/80 border border-slate-100 flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black shrink-0 shadow-xs">
                <ShoppingCart size={26} />
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 tracking-tight block">25,000+</span>
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Active Buyers</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-3xl bg-slate-50/80 border border-slate-100 flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black shrink-0 shadow-xs">
                <ShieldCheck size={26} />
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900 tracking-tight block">38,000+</span>
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Completed Orders</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================
          3. POPULAR DYNAMIC CATEGORIES
          ============================================================ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
                Popular Categories
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
                Discover by Category
              </h2>
            </div>
            <Link
              href="/categories"
              className="text-xs font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 group bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs w-fit"
            >
              <span>View All 12 Categories</span>
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {DYNAMIC_CATEGORIES.map((cat) => {
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
                  <span className="text-[10px] text-slate-400/80 mt-1 truncate max-w-[120px]">{cat.popularSub}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          4. DYNAMIC FEATURED PRODUCTS (WITH LIVE FILTER TABS)
          ============================================================ */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  <Flame size={14} className="text-amber-500" /> Hot Picks
                </span>
                <span className="text-xs text-slate-400 font-medium">100% Genuine Verified</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
                Featured Verified Listings
              </h2>
            </div>

            {/* Quick Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
              {["All", "Electronics", "Furniture", "Vehicles", "Clothing"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveCategoryTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-slate-100 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {filteredFeatured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/listings"
              className="btn-shiny-primary px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-lg"
            >
              <span>Explore All 50,000+ Items</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          5. SUSTAINABILITY IMPACT & CIRCULAR ECONOMY
          ============================================================ */}
      <section className="py-20 bg-gradient-to-br from-emerald-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/90 px-3.5 py-1.5 rounded-full border border-emerald-800">
                Eco & Social Impact
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Second-Hand is the Future of Sustainable Living
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                By trading pre-owned items on ReSell Hub, you are directly preventing hazardous electronic waste and cutting down carbon emissions associated with manufacturing new products.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="text-3xl font-black text-emerald-400">120+ Tons</div>
                  <div className="text-xs text-slate-300 font-bold mt-1">E-Waste Prevented</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="text-3xl font-black text-emerald-400">450+ MT</div>
                  <div className="text-xs text-slate-300 font-bold mt-1">CO₂ Emissions Saved</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Recycle size={24} />
                </div>
                <h3 className="font-bold text-base text-white">Circular Lifecycles</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Give gadgets, fashion, and furniture a 2nd and 3rd life rather than dumping them into landfills.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <BadgePercent size={24} />
                </div>
                <h3 className="font-bold text-base text-white">Up to 60% Savings</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Enjoy genuine flagship tech and designer goods at a fraction of their retail market price.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="font-bold text-base text-white">Zero Scam Escrow</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Every trade is protected with our buyer protection policy and verified user profiles.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  <Zap size={24} />
                </div>
                <h3 className="font-bold text-base text-white">Direct Liquidity</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Turn unused clutter in your home into instant cash with free 60-second ad posting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          6. TRUSTED SELLERS SHOWCASE
          ============================================================ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
              Verified Merchants
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
              Top-Rated Trusted Sellers
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Experienced traders with 4.8+ ratings and hundreds of successful transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUSTED_SELLERS.map((seller) => (
              <div
                key={seller.id}
                className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all text-center space-y-4 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <img
                      src={seller.img}
                      alt={seller.name}
                      className="w-full h-full rounded-2xl object-cover border-2 border-indigo-500 shadow-md"
                    />
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-xs">
                      ✓
                    </span>
                  </div>

                  <h3 className="font-black text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                    {seller.name}
                  </h3>
                  <span className="text-xs text-indigo-600 font-bold block">{seller.handle}</span>

                  <div className="flex items-center justify-center gap-1 text-xs text-amber-500 font-bold mt-2">
                    <Star size={13} fill="#f59e0b" />
                    <span>{seller.rating}</span>
                    <span className="text-slate-400 font-normal">({seller.reviews} reviews)</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-left text-xs space-y-1 mt-4">
                    <div className="flex justify-between text-slate-500">
                      <span>Volume:</span>
                      <strong className="text-slate-800 font-bold">{seller.sales}</strong>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Location:</span>
                      <strong className="text-slate-800 font-bold">{seller.city}</strong>
                    </div>
                  </div>
                </div>

                <Link
                  href="/listings"
                  className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-600 font-bold text-xs rounded-xl transition-all block text-center"
                >
                  View Seller Listings
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          7. SUCCESS STORIES (BUYER & SELLER EXPERIENCES)
          ============================================================ */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100">
              Community Voices
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
              Real Trader Success Stories
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Read how buyers and sellers across Bangladesh save and earn with ReSell Hub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SUCCESS_STORIES.map((story, i) => (
              <motion.div
                key={story.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1 text-amber-400">
                      {[...Array(story.stars)].map((_, idx) => (
                        <Star key={idx} size={15} fill="#fbbf24" stroke="#fbbf24" />
                      ))}
                    </div>
                    <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      {story.price}
                    </span>
                  </div>

                  <p className="text-slate-700 text-sm leading-relaxed italic mb-6">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3.5 pt-4 border-t border-slate-200/60">
                  <img
                    src={story.avatar}
                    alt={story.name}
                    className="w-11 h-11 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-black text-xs text-slate-900">{story.name}</h4>
                    <span className="text-[11px] text-slate-500 font-medium block">{story.role}</span>
                    <span className="text-[10px] text-indigo-600 font-bold block">{story.itemTraded}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          8. HIGH-IMPACT FINAL CTA BANNER
          ============================================================ */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <span className="text-xs font-black tracking-widest uppercase bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
            0% Commission on First 3 Listings
          </span>
          <h2 className="text-3xl sm:text-5xl font-black mt-4 mb-4 tracking-tight">
            Ready to turn pre-loved items into cash?
          </h2>
          <p className="text-indigo-100 max-w-xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
            Create an ad in less than 60 seconds. Reach thousands of eager buyers in Dhaka, Chittagong, Sylhet, and nationwide.
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
              Explore All Listings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
