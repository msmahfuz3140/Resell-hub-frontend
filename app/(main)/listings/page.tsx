"use client";

import React, { useState, useEffect, useCallback, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  X,
  ArrowUpDown,
  TrendingUp,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/ProductCardSkeleton";
import Pagination from "@/components/ui/Pagination";
import LocationSelector from "@/components/ui/LocationSelector";
import { CATEGORIES, SORT_OPTIONS } from "@/lib/constants";
import { productService } from "@/services/productService";
import { getCustomProducts } from "@/lib/customProducts";
import type { Product } from "@/types";

const CONDITIONS = ["All", "New", "Like New", "Good", "Fair", "Poor"];

const FALLBACK_LISTINGS: Product[] = [
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

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function ListingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [selectedCondition, setSelectedCondition] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All Locations");
  const [sortBy, setSortBy] = useState("-createdAt");
  const [priceMax, setPriceMax] = useState<number>(250000);
  const [page, setPage] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 12, total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false });
  const [isLoading, setIsLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 300);
  const debouncedPriceMax = useDebounce(priceMax, 400);

  // Filter fallback products locally if API is connecting/offline
  const getFilteredFallback = useCallback(() => {
    const custom = getCustomProducts();
    let list = [...custom, ...FALLBACK_LISTINGS];

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== "All") {
      list = list.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (selectedCondition !== "All") {
      list = list.filter((p) => p.condition === selectedCondition);
    }
    if (debouncedPriceMax < 250000) {
      list = list.filter((p) => p.price <= debouncedPriceMax);
    }

    // Sort
    if (sortBy === "price") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "-price") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "-views") {
      list.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [debouncedSearch, selectedCategory, selectedCondition, debouncedPriceMax, sortBy]);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await productService.getProducts({
        search: debouncedSearch || undefined,
        category: selectedCategory !== "All" ? selectedCategory : undefined,
        condition: selectedCondition !== "All" ? selectedCondition : undefined,
        maxPrice: debouncedPriceMax < 250000 ? debouncedPriceMax : undefined,
        sort: sortBy,
        page,
        limit: 12,
      });
      setProducts(data.data || []);
      setMeta(data.meta || { page: 1, limit: 12, total: (data.data || []).length, totalPages: 1, hasNextPage: false, hasPrevPage: false });
    } catch {
      // Fallback only if backend completely unreachable
      const fallback = getFilteredFallback();
      setProducts(fallback);
      setMeta({ page: 1, limit: 12, total: fallback.length, totalPages: 1, hasNextPage: false, hasPrevPage: false });
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedCategory, selectedCondition, debouncedPriceMax, sortBy, page, getFilteredFallback]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const handleUpdate = () => { fetchProducts(); };
    window.addEventListener("resellhub_products_updated", handleUpdate);
    return () => { window.removeEventListener("resellhub_products_updated", handleUpdate); };
  }, [fetchProducts]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategory, selectedCondition, debouncedPriceMax, sortBy]);

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedCondition("All");
    setSelectedCity("All Locations");
    setSortBy("-createdAt");
    setPriceMax(250000);
    setPage(1);
  };

  const hasActiveFilters =
    search || selectedCategory !== "All" || selectedCondition !== "All" || priceMax < 250000;

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
              <span className="text-xs text-slate-400 font-medium">
                {isLoading ? "Loading..." : `${meta.total.toLocaleString()} listings`}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
              Marketplace Listings
            </h1>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-3">
            <ArrowUpDown size={15} className="text-slate-400 hidden sm:block" />
            <span className="text-xs text-slate-400 font-bold hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="text-xs font-bold bg-white text-slate-700 py-2.5 px-4 rounded-xl border border-slate-200 shadow-xs outline-none cursor-pointer focus:border-indigo-400 transition-colors"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search & Category Pill Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-3xl border border-slate-200/80 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, category, or keyword..."
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
              onClick={() => { setSelectedCategory("All"); setPage(1); }}
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
                onClick={() => { setSelectedCategory(c.id); setPage(1); }}
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
            className={`md:hidden w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-black border transition-all ${
              hasActiveFilters
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-indigo-50 text-indigo-600 border-indigo-100"
            }`}
          >
            <Filter size={15} />
            <span>Filters {hasActiveFilters ? "(active)" : ""}</span>
          </button>
        </div>

        {/* Active filter tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {search && (
              <span className="flex items-center gap-1.5 text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-full">
                Search: "{search}"
                <button onClick={() => setSearch("")}><X size={12} /></button>
              </span>
            )}
            {selectedCategory !== "All" && (
              <span className="flex items-center gap-1.5 text-xs font-bold bg-slate-800 text-white px-3 py-1.5 rounded-full">
                {selectedCategory}
                <button onClick={() => setSelectedCategory("All")}><X size={12} /></button>
              </span>
            )}
            {selectedCondition !== "All" && (
              <span className="flex items-center gap-1.5 text-xs font-bold bg-slate-800 text-white px-3 py-1.5 rounded-full">
                {selectedCondition}
                <button onClick={() => setSelectedCondition("All")}><X size={12} /></button>
              </span>
            )}
            {priceMax < 250000 && (
              <span className="flex items-center gap-1.5 text-xs font-bold bg-slate-800 text-white px-3 py-1.5 rounded-full">
                Max: ৳{priceMax.toLocaleString()}
                <button onClick={() => setPriceMax(250000)}><X size={12} /></button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-rose-600 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-rose-50 transition-all"
            >
              <RotateCcw size={12} /> Clear all
            </button>
          </div>
        )}

        {/* Main Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar Filters */}
          <div className={`md:col-span-4 lg:col-span-3 ${showMobileFilter ? "block" : "hidden md:block"} space-y-6`}>
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-indigo-600" /> Filter Criteria
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <RotateCcw size={12} /> Reset
                  </button>
                )}
              </div>

              {/* Category */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Categories</h4>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer hover:text-indigo-600">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === "All"}
                      onChange={() => { setSelectedCategory("All"); setPage(1); }}
                      className="text-indigo-600 focus:ring-0"
                    />
                    All Items
                  </label>
                  {CATEGORIES.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer hover:text-indigo-600">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat.id}
                        onChange={() => { setSelectedCategory(cat.id); setPage(1); }}
                        className="text-indigo-600 focus:ring-0"
                      />
                      <span>{cat.icon} {cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Condition</h4>
                <div className="flex flex-wrap gap-1.5">
                  {CONDITIONS.map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => { setSelectedCondition(cond); setPage(1); }}
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

              {/* Location */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Location</h4>
                <LocationSelector value={selectedCity} onChange={setSelectedCity} className="w-full" />
              </div>

              {/* Price Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Max Price</h4>
                  <span className="text-xs font-black text-indigo-600">
                    {priceMax < 250000 ? `৳ ${priceMax.toLocaleString()}` : "Any"}
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
            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs sm:text-sm font-semibold text-slate-500">
                {isLoading ? (
                  "Loading listings..."
                ) : (
                  <>
                    <strong className="text-slate-900 font-extrabold">{products.length}</strong> verified listings
                  </>
                )}
              </span>
            </div>

            {/* Loading Skeleton */}
            {isLoading && <ProductGridSkeleton count={12} />}

            {/* Empty State */}
            {!isLoading && products.length === 0 && (
              <div className="bg-white p-12 sm:p-16 rounded-3xl border border-slate-200 text-center shadow-xs">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search size={28} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1">No listings found</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-6">
                  Try adjusting your search or filters to discover more items.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="btn-shiny-primary px-6 py-3 rounded-xl font-black text-xs shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Products */}
            {!isLoading && products.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {meta.totalPages > 1 && (
                  <Pagination
                    page={meta.page}
                    totalPages={meta.totalPages}
                    total={meta.total}
                    limit={meta.limit}
                    onPageChange={(p) => {
                      setPage(p);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-slate-50 min-h-screen py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-10 w-64 bg-slate-200 rounded-xl animate-pulse mb-8" />
            <ProductGridSkeleton count={12} />
          </div>
        </div>
      }
    >
      <ListingsContent />
    </Suspense>
  );
}
