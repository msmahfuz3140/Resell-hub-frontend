"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Heart,
  Share2,
  MapPin,
  ShieldCheck,
  Star,
  MessageCircle,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  Clock,
  Eye,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowLeft,
  Calendar,
  Lock,
  Phone,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, timeAgo } from "@/lib/utils";
import ProductCard from "@/components/ui/ProductCard";
import type { Product } from "@/types";

const SAMPLE_PRODUCT: Product = {
  _id: "prod-1",
  title: "Apple iPhone 15 Pro - 128GB (Natural Titanium)",
  description: `Selling my carefully maintained Apple iPhone 15 Pro (128GB, Natural Titanium). 

Key Specifications & Integrity Check:
• Battery Health: 98% (Original Apple Battery)
• Physical Condition: 9.8/10 (Always used with Spigen case & tempered glass from day 1)
• 3U Tools Score: 100% genuine parts, 0 replaced components
• Factory Unlocked: Works flawlessly with GP, Banglalink, Robi, Airtel, Teletalk eSIM & Physical SIM
• Accessories Included: Original braided USB-C cable, retail box, Spigen Liquid Air case

Reason for Selling: Upgrading to 16 Pro Max.
Meetup Preferred: Gulshan-1 / Banani or verified public locations with CCTV. Doorstep delivery available with advance courier charges.`,
  price: 94000,
  originalPrice: 115000,
  category: "Electronics",
  condition: "Like New",
  images: [
    {
      url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=900&auto=format&fit=crop&q=80",
      publicId: "img1",
      isPrimary: true,
    },
    {
      url: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=900&auto=format&fit=crop&q=80",
      publicId: "img2",
      isPrimary: false,
    },
    {
      url: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=900&auto=format&fit=crop&q=80",
      publicId: "img3",
      isPrimary: false,
    },
  ],
  sellerInfo: {
    sellerId: "user-1",
    name: "Tanzid Hossain",
    phone: "+880 1711-223344",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    rating: 4.9,
    totalSales: 24,
    location: { city: "Gulshan, Dhaka", country: "Bangladesh" },
  },
  stock: 1,
  status: "active",
  location: { city: "Gulshan-1, Dhaka", country: "Bangladesh" },
  isFeatured: true,
  views: 482,
  favorites: [],
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  updatedAt: new Date().toISOString(),
};

const RELATED_PRODUCTS: Product[] = [
  {
    _id: "prod-2",
    title: "Sony WH-1000XM5 Wireless Headphones",
    description: "Mint condition with all accessories.",
    price: 28500,
    originalPrice: 36000,
    category: "Electronics",
    condition: "Like New",
    images: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80", publicId: "sony", isPrimary: true }],
    sellerInfo: { sellerId: "u2", name: "Nabila", rating: 5.0, totalSales: 12, location: { city: "Dhaka", country: "BD" } },
    stock: 1,
    status: "active",
    location: { city: "Dhaka", country: "Bangladesh" },
    isFeatured: true,
    views: 310,
    favorites: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "prod-3",
    title: "MacBook Air M2 (16GB RAM, 512GB SSD)",
    description: "Midnight color with cycle count 45.",
    price: 108000,
    originalPrice: 135000,
    category: "Electronics",
    condition: "New",
    images: [{ url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80", publicId: "mac", isPrimary: true }],
    sellerInfo: { sellerId: "u3", name: "Sabbir", rating: 4.8, totalSales: 38, location: { city: "Dhaka", country: "BD" } },
    stock: 1,
    status: "active",
    location: { city: "Dhaka", country: "Bangladesh" },
    isFeatured: true,
    views: 890,
    favorites: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function ProductDetailPage() {
  const router = useRouter();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const product = SAMPLE_PRODUCT;
  const activeImage = product.images?.[activeImageIndex]?.url || product.images?.[0]?.url;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} on ReSell Hub!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Listing link copied to clipboard! 📋");
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast.success(isFavorited ? "Removed from wishlist" : "Saved to wishlist! ❤️");
  };

  const handleBuyNow = () => {
    toast.success("Redirecting to Escrow Protected Checkout...");
    router.push("/dashboard");
  };

  const handleChat = () => {
    toast.info(`Connecting with seller ${product.sellerInfo?.name}...`);
    router.push("/dashboard");
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-6">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/listings" className="hover:text-indigo-600 transition-colors">Marketplace</Link>
          <ChevronRight size={14} />
          <Link href={`/listings?category=${product.category}`} className="hover:text-indigo-600 transition-colors">{product.category}</Link>
          <ChevronRight size={14} />
          <span className="text-slate-800 truncate max-w-[200px]">{product.title}</span>
        </div>

        {/* Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* ── Left Column: Gallery & Description (7 Cols) ── */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Image Showcase Frame */}
            <div className="relative aspect-[4/3] bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
              <img
                src={activeImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />

              {/* Floating Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wide bg-white/95 backdrop-blur-md text-indigo-700 shadow-md border border-white/60">
                  Condition: {product.condition}
                </span>
                {product.isFeatured && (
                  <span className="px-3.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md flex items-center gap-1.5 w-fit">
                    <Sparkles size={13} /> Featured Item
                  </span>
                )}
              </div>

              {/* Favorite & Share Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  type="button"
                  onClick={handleFavorite}
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-rose-500 flex items-center justify-center shadow-md transition-transform hover:scale-110"
                >
                  <Heart size={18} className={isFavorited ? "fill-rose-500 text-rose-500" : ""} />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-indigo-600 flex items-center justify-center shadow-md transition-transform hover:scale-110"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            {/* Thumbnails Row */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images?.map((img, index) => (
                <button
                  key={img.publicId || index}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === index
                      ? "border-indigo-600 shadow-md scale-105"
                      : "border-slate-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Detailed Description */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-slate-900">
                Seller Description & Overview
              </h2>
              <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line font-normal">
                {product.description}
              </div>

              {/* Hardware Specifications */}
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">
                  Item Specifications & Trade Conditions
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-[11px] text-slate-400 font-bold block">Category</span>
                    <span className="text-xs font-black text-slate-800">{product.category}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-[11px] text-slate-400 font-bold block">Physical Condition</span>
                    <span className="text-xs font-black text-indigo-600">{product.condition}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-[11px] text-slate-400 font-bold block">Stock Available</span>
                    <span className="text-xs font-black text-slate-800">{product.stock} Unit</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-[11px] text-slate-400 font-bold block">Fulfillment</span>
                    <span className="text-xs font-black text-slate-800">In-Person / Courier</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-[11px] text-slate-400 font-bold block">Negotiability</span>
                    <span className="text-xs font-black text-emerald-600">Open to Fair Offers</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-[11px] text-slate-400 font-bold block">Authenticity</span>
                    <span className="text-xs font-black text-indigo-600">100% Genuine</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: Buy Box & Seller (5 Cols) ── */}
          <div className="lg:col-span-5 space-y-6">
            {/* Main Buy Box */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6 sticky top-24">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  {product.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={13} /> {timeAgo(product.createdAt)}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
                {product.title}
              </h1>

              {/* Location & View Stats */}
              <div className="flex items-center gap-4 text-xs text-slate-500 pb-4 border-b border-slate-100">
                <span className="flex items-center gap-1 font-semibold text-slate-600">
                  <MapPin size={14} className="text-indigo-600" />
                  {product.location?.city}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-slate-600">
                  <Eye size={14} className="text-slate-400" />
                  {product.views} views
                </span>
              </div>

              {/* Pricing Section */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-base text-slate-400 line-through font-semibold">
                        {formatCurrency(product.originalPrice)}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-medium">Standard BDT Price • No hidden fees</p>
              </div>

              {/* CTAs */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="btn-shiny-primary w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                >
                  <Lock size={18} />
                  <span>Buy with Escrow Protection</span>
                </button>

                <button
                  type="button"
                  onClick={handleChat}
                  className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-200"
                >
                  <MessageCircle size={17} />
                  <span>Chat with Seller Instantly</span>
                </button>
              </div>

              {/* Escrow Guarantee Box */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-100 space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-900 font-black text-xs">
                  <ShieldCheck size={16} className="text-indigo-600" /> ReSell Hub 100% Escrow Guarantee
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                  Your funds are protected in escrow until you inspect and verify the product condition.
                </p>
              </div>

              {/* Seller Summary */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
                    {product.sellerInfo?.name?.[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{product.sellerInfo?.name}</h4>
                    <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                      <Star size={11} fill="#f59e0b" /> {product.sellerInfo?.rating} rating ({product.sellerInfo?.totalSales} sales)
                    </div>
                  </div>
                </div>

                <span className="badge badge-success text-[10px] font-bold py-0.5">
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Related Items ── */}
        <div className="pt-10 border-t border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Recommended Similar Items
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Based on category & buyer interest</p>
            </div>
            <Link href="/listings" className="text-xs font-black text-indigo-600 hover:text-indigo-800">
              Browse All Listings →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {RELATED_PRODUCTS.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
