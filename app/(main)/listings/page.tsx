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
} from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { CATEGORIES } from "@/lib/constants";
import type { Product } from "@/types";

// Mock Database of Products for rich showcase & filtering
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

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((item) => {
      // Search
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchCat = item.category.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchCat) return false;
      }

      // Category
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }

      // Condition
      if (selectedCondition !== "All" && item.condition !== selectedCondition) {
        return false;
      }

      // City
      if (selectedCity !== "All Locations" && item.location.city !== selectedCity) {
        return false;
      }

      // Price
      if (item.price > priceMax) {
        return false;
      }

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
      <div className="container mx-auto px-4">
        {/* Top Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Explore All Listings
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-1">
            Browse verified second-hand items across Bangladesh.
          </p>
        </div>

        {/* Search & Main Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by keyword..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Quick Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === "All"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Items
            </button>
            {CATEGORIES.slice(0, 5).map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === c.id
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>

          {/* Mobile filter toggle & Sort */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="md:hidden flex items-center gap-2 px-3.5 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
            >
              <Filter size={14} />
              Filters
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-bold bg-slate-100 text-slate-700 py-2 px-3 rounded-xl outline-none cursor-pointer border-none"
              >
                <option value="latest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout Grid (Filters Sidebar + Products) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* ── Filters Sidebar (Desktop + Mobile) ── */}
          <div className={`md:block ${showMobileFilter ? "block" : "hidden"} space-y-6`}>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-indigo-600" /> Filters
                </span>
                <button
                  onClick={resetFilters}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <RotateCcw size={12} /> Reset
                </button>
              </div>

              {/* Categories Filter */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                  Category
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-indigo-600">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === "All"}
                      onChange={() => setSelectedCategory("All")}
                      className="text-indigo-600 focus:ring-0"
                    />
                    <span>All Categories</span>
                  </label>
                  {CATEGORIES.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-indigo-600"
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

              {/* Condition Filter */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                  Condition
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {CONDITIONS.map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setSelectedCondition(cond)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                        selectedCondition === cond
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                  Location
                </h4>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-700 outline-none"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Max Price Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                    Max Price
                  </h4>
                  <span className="text-xs font-bold text-indigo-600">
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
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                  <span>৳ 1,000</span>
                  <span>৳ 250,000+</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Products Grid ── */}
          <div className="md:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-600">
                Showing <strong className="text-slate-900">{filteredProducts.length}</strong> items
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={28} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  No listings matched your filters
                </h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                  Try adjusting your keywords, price range, or category filter to discover more products.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="btn btn-primary px-6 py-2.5 rounded-xl font-bold text-xs shadow-md"
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
    <Suspense fallback={<div className="container py-20 text-center font-bold">Loading listings...</div>}>
      <ListingsContent />
    </Suspense>
  );
}
