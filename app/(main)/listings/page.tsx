"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Grid,
  List,
  Sparkles,
  RotateCcw,
  Tag,
  ChevronDown,
  X,
  MapPin,
  Flame,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { CATEGORIES } from "@/lib/constants";
import type { Product } from "@/types";

// Mock Database for rich browsing
const ALL_PRODUCTS: Product[] = [
  {
    _id: "prod-1",
    title: "Apple iPhone 15 Pro - 128GB (Natural Titanium)",
    description: "Mint condition, battery health 98%, with original box & invoice.",
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
    location: { city: "Dhaka", country: "Bangladesh" },
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
    location: { city: "Dhaka", country: "Bangladesh" },
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
    location: { city: "Dhaka", country: "Bangladesh" },
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
    location: { city: "Chittagong", country: "Bangladesh" },
    isFeatured: false,
    views: 180,
    favorites: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "prod-5",
    title: "Canon EOS R50 Mirrorless Camera + 18-45mm Lens",
    description: "Ideal for vloggers and photo enthusiasts. Shutter count under 1,500.",
    price: 62000,
    originalPrice: 78000,
    category: "Electronics",
    condition: "Like New",
    images: [
      {
        url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80",
        publicId: "canon_camera",
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
    location: { city: "Dhaka", country: "Bangladesh" },
    isFeatured: true,
    views: 540,
    favorites: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "prod-6",
    title: "Yamaha FZ-S Version 3.0 (Matte Dark Blue)",
    description: "Single-hand driven, 18,000 km run, digital number plate, tax token updated.",
    price: 195000,
    originalPrice: 245000,
    category: "Vehicles",
    condition: "Good",
    images: [
      {
        url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80",
        publicId: "yamaha_bike",
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
    title: "Vintage Leather Jacket (Brown, Size M)",
    description: "Genuine cowhide leather. Worn 3-4 times. Very soft texture and warm.",
    price: 4500,
    originalPrice: 9000,
    category: "Clothing",
    condition: "Good",
    images: [
      {
        url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
        publicId: "leather_jacket",
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
    location: { city: "Dhaka", country: "Bangladesh" },
    isFeatured: false,
    views: 290,
    favorites: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "prod-8",
    title: "Yamaha Pacifica 112V Electric Guitar + Fender Amp",
    description: "Excellent beginner to intermediate setup. Includes gig bag and cable.",
    price: 24000,
    originalPrice: 32000,
    category: "Music",
    condition: "Like New",
    images: [
      {
        url: "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=600&auto=format&fit=crop&q=80",
        publicId: "electric_guitar",
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
    location: { city: "Dhaka", country: "Bangladesh" },
    isFeatured: true,
    views: 670,
    favorites: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const CONDITIONS = ["All", "New", "Like New", "Good", "Fair", "Poor"];
const CITIES = ["All Locations", "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna"];

function ListingsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCondition, setSelectedCondition] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All Locations");
  const [sortBy, setSortBy] = useState("latest");
  const [priceMax, setPriceMax] = useState<number>(200000);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Filter & Sort Algorithm
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((item) => {
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchCat = item.category.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchCat) return false;
      }
      if (selectedCategory !== "All" && item.category !== selectedCategory) return false;
      if (selectedCondition !== "All" && item.condition !== selectedCondition) return false;
      if (selectedCity !== "All Locations" && item.location.city !== selectedCity) return false;
      if (item.price > priceMax) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "popular") return b.views - a.views;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [search, selectedCategory, selectedCondition, selectedCity, sortBy, priceMax]);

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedCondition("All");
    setSelectedCity("All Locations");
    setSortBy("latest");
    setPriceMax(200000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Live Feed
              </span>
              <span className="text-xs text-slate-400 font-medium">Updated every 5 mins</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
              Marketplace Listings
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-bold hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold bg-white text-slate-700 py-2.5 px-4 rounded-xl border border-slate-200 shadow-xs outline-none cursor-pointer"
            >
              <option value="latest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Popular Deals</option>
            </select>
          </div>
        </div>

        {/* ── Search & Filter Pill Bar ── */}
        <div className="bg-white p-3 sm:p-4 rounded-3xl border border-slate-200/80 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keywords, model, brand..."
              className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Quick Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === "All"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.slice(0, 5).map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === c.id
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="md:hidden w-full flex items-center justify-center gap-2 py-3 bg-indigo-50 text-indigo-600 rounded-2xl text-xs font-black border border-indigo-100"
          >
            <Filter size={15} />
            <span>Filter Products ({filteredProducts.length})</span>
          </button>
        </div>

        {/* ── Main Layout: Sidebar Filters + Products Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className={`md:col-span-4 lg:col-span-3 ${showMobileFilter ? "block" : "hidden md:block"} space-y-6`}>
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-indigo-600" /> Filter Criteria
                </span>
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <RotateCcw size={12} /> Reset
                </button>
              </div>

              {/* Category radio group */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                  Categories
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer hover:text-indigo-600">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === "All"}
                      onChange={() => setSelectedCategory("All")}
                      className="text-indigo-600 focus:ring-0"
                    />
                    <span>All Items</span>
                  </label>
                  {CATEGORIES.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer hover:text-indigo-600"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat.id}
                        onChange={() => setSelectedCategory(cat.id)}
                        className="text-indigo-600 focus:ring-0"
                      />
                      <span>{cat.icon} {cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Condition Pills */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                  Physical Condition
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {CONDITIONS.map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setSelectedCondition(cond)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedCondition === cond
                          ? "bg-slate-900 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Select */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                  Location
                </h4>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none"
                  >
                    {CITIES.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                    Max Price
                  </h4>
                  <span className="text-xs font-black text-indigo-600">
                    ৳ {priceMax.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={250000}
                  step={2000}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-bold">
                  <span>৳ 1,000</span>
                  <span>৳ 250,000+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-8 lg:col-span-9">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs sm:text-sm font-semibold text-slate-500">
                Found <strong className="text-slate-900 font-extrabold">{filteredProducts.length}</strong> matching verified listings
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white p-12 sm:p-16 rounded-3xl border border-slate-200 text-center shadow-xs">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search size={28} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1">
                  No listings found for your search
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-6">
                  Try clearing your search term or adjusting price slider to discover other available pre-loved items.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="btn-shiny-primary px-6 py-3 rounded-xl font-black text-xs shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center font-bold">Loading marketplace...</div>}>
      <ListingsContent />
    </Suspense>
  );
}
