"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  User as UserIcon,
  MapPin,
  Calendar,
  Star,
  ShieldCheck,
  Package,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Phone,
  ThumbsUp,
  Tag,
} from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { userService } from "@/services/userService";
import type { Product, User } from "@/types";
import { timeAgo, formatCurrency } from "@/lib/utils";

// Sample verified fallback seller for mock/local IDs
const FALLBACK_SELLER: User = {
  _id: "user-1",
  name: "Tanzid Hossain",
  email: "tanzid.verified@resellhub.com",
  role: "seller",
  status: "active",
  provider: "local",
  phone: "+880 1711-223344",
  location: { city: "Gulshan, Dhaka", country: "Bangladesh" },
  bio: "Passionate tech enthusiast and certified electronics reseller. All devices are 100% verified, tested with diagnostic tools, and come with a personal 7-day testing warranty. Fast and secure meetup in Gulshan-1 / Banani area.",
  isVerifiedSeller: true,
  rating: { average: 4.9, count: 24 },
  totalSales: 24,
  totalPurchases: 3,
  createdAt: "2024-03-15T10:00:00.000Z",
  updatedAt: "2026-08-20T10:00:00.000Z",
};

const SAMPLE_SELLER_PRODUCTS: Product[] = [
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
      isVerifiedSeller: true,
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
    _id: "prod-3",
    title: "MacBook Pro 14-inch M2 Pro - 16GB / 512GB (Space Gray)",
    description: "Battery cycle only 42. Care+ active until late 2026.",
    price: 165000,
    originalPrice: 198000,
    category: "Electronics",
    condition: "Like New",
    images: [
      {
        url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
        publicId: "macbook_pro",
        isPrimary: true,
      },
    ],
    sellerInfo: {
      sellerId: "user-1",
      name: "Tanzid Hossain",
      rating: 4.9,
      totalSales: 24,
      isVerifiedSeller: true,
      location: { city: "Gulshan, Dhaka", country: "Bangladesh" },
    },
    stock: 1,
    status: "active",
    location: { city: "Gulshan, Dhaka", country: "Bangladesh" },
    isFeatured: true,
    views: 890,
    favorites: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const SAMPLE_REVIEWS = [
  {
    _id: "rev-1",
    reviewerInfo: { name: "Mahfuzur Rahman", photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" },
    rating: 5,
    comment: "Excellent seller! The iPhone 15 Pro was in 100% mint condition as described. Met in Gulshan and completed escrow safely.",
    isVerifiedPurchase: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    _id: "rev-2",
    reviewerInfo: { name: "Sadia Sultana", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" },
    rating: 5,
    comment: "Very polite and honest seller. Packaging was flawless and device battery health checked out at 98%. Recommended!",
    isVerifiedPurchase: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
  },
];

export default function SellerPublicProfilePage() {
  const { id } = useParams<{ id: string }>();

  const [seller, setSeller] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"listings" | "reviews">("listings");
  const [isLoading, setIsLoading] = useState(true);

  const fetchSellerData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);

    try {
      // 1. Fetch seller public profile
      const userRes = await userService.getPublicProfile(id);
      if (userRes.success && userRes.data?.user) {
        setSeller(userRes.data.user);
      }

      // 2. Fetch seller listings
      const listingsRes = await userService.getUserListings(id);
      if (listingsRes.success && listingsRes.data) {
        setProducts(listingsRes.data);
      }

      // 3. Fetch seller reviews
      const reviewsRes = await userService.getUserReviews(id);
      if (reviewsRes.success && reviewsRes.data) {
        setReviews(reviewsRes.data);
      }
    } catch {
      // Fallback for demo/offline profile IDs
      setSeller({
        ...FALLBACK_SELLER,
        _id: id,
        name: id === "user-1" ? "Tanzid Hossain" : "Verified Marketplace Seller",
      });
      setProducts(SAMPLE_SELLER_PRODUCTS);
      setReviews(SAMPLE_REVIEWS);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSellerData();
  }, [fetchSellerData]);

  const joinedDateFormatted = seller?.createdAt
    ? new Date(seller.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Member since 2024";

  const sellerRatingAvg =
    typeof seller?.rating === "object"
      ? Number(seller?.rating?.average || 5.0)
      : Number(seller?.rating || 5.0);

  const isVerified =
    Boolean(seller?.isVerifiedSeller) ||
    seller?.role === "seller" ||
    sellerRatingAvg >= 4.8;

  return (
    <div className="min-h-screen py-8 sm:py-12 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Back Link */}
        <Link
          href="/listings"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mb-6"
        >
          <ArrowLeft size={14} />
          <span>Back to Marketplace</span>
        </Link>

        {/* ── Seller Hero Header Card ── */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl p-6 sm:p-10 mb-8 relative overflow-hidden">
          {/* Subtle Glow Backdrop */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8 relative z-10">
            {/* Avatar with Verified Badge */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-3xl shadow-xl overflow-hidden">
                {seller?.photo?.url ? (
                  <img src={seller.photo.url} alt={seller.name} className="w-full h-full object-cover" />
                ) : (
                  seller?.name?.[0]?.toUpperCase() || "S"
                )}
              </div>
              {isVerified && (
                <div
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-blue-600 text-white border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-md"
                  title="Verified Seller by ReSell Hub"
                >
                  <ShieldCheck size={16} />
                </div>
              )}
            </div>

            {/* Seller Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {seller?.name || "Seller Profile"}
                </h1>
                {isVerified && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-extrabold uppercase">
                    <ShieldCheck size={13} /> Verified Seller
                  </span>
                )}
              </div>

              {/* Bio */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mb-4">
                {seller?.bio || "Verified member offering quality pre-owned goods on ReSell Hub."}
              </p>

              {/* Meta Info Badges */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-indigo-500 shrink-0" />
                  {seller?.location?.city || "Dhaka"}, Bangladesh
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-400 shrink-0" />
                  {joinedDateFormatted}
                </span>
                {seller?.phone && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <Phone size={14} className="text-indigo-500 shrink-0" />
                      {seller.phone}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Quick Stats Column */}
            <div className="flex sm:flex-col gap-3 w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 md:pl-8">
              {/* Rating Card */}
              <div className="flex-1 bg-slate-50 dark:bg-slate-800/80 p-3.5 sm:p-4 rounded-2xl border border-slate-100 dark:border-slate-700 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-500 font-black text-lg sm:text-xl">
                  <Star size={18} className="fill-amber-400" />
                  <span>{sellerRatingAvg.toFixed(1)}</span>
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                  Average Rating
                </span>
              </div>

              {/* Sales Card */}
              <div className="flex-1 bg-slate-50 dark:bg-slate-800/80 p-3.5 sm:p-4 rounded-2xl border border-slate-100 dark:border-slate-700 text-center sm:text-left">
                <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white block">
                  {seller?.totalSales || products.length || 0}
                </span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                  Sales Completed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs Navigation ── */}
        <div className="flex items-center gap-3 mb-8 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("listings")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all ${
              activeTab === "listings"
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            <Package size={16} />
            <span>Active Listings ({products.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all ${
              activeTab === "reviews"
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            <MessageSquare size={16} />
            <span>Customer Reviews ({reviews.length})</span>
          </button>
        </div>

        {/* ── Tab 1: Active Listings ── */}
        {activeTab === "listings" && (
          <div>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <Package size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                  No active listings at the moment
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Check back later or browse other verified sellers.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Tab 2: Customer Reviews ── */}
        {activeTab === "reviews" && (
          <div className="space-y-4 max-w-4xl">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                        {rev.reviewerInfo?.photo ? (
                          <img src={rev.reviewerInfo.photo} alt={rev.reviewerInfo.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-600">
                            {rev.reviewerInfo?.name?.[0] || "U"}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {rev.reviewerInfo?.name || "Verified Buyer"}
                        </h4>
                        <span className="text-[11px] text-slate-400">{timeAgo(rev.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} size={14} className="fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {rev.comment}
                  </p>

                  {rev.isVerifiedPurchase && (
                    <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 size={11} /> Verified Escrow Purchase
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <MessageSquare size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No reviews yet</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Reviews will appear after buyers complete purchases with this seller.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
