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
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, timeAgo } from "@/lib/utils";
import ProductCard from "@/components/ui/ProductCard";
import type { Product } from "@/types";

// Mock Detailed Product Data for demonstration
const SAMPLE_PRODUCT: Product = {
  _id: "prod-1",
  title: "Apple iPhone 15 Pro - 128GB (Natural Titanium)",
  description: `Selling my carefully maintained Apple iPhone 15 Pro (128GB, Natural Titanium). 
  
Key Details:
• Battery Health: 98% (Original Apple battery)
• Physical Condition: 9.8/10 (Always used with Spigen case & screen protector from day 1)
• 3U Tools Score: 100% genuine parts, 0 replaced components
• Factory Unlocked: Works flawlessly with GP, Banglalink, Robi, Airtel, Teletalk eSIM & Physical SIM
• Accessories Included: Original braided USB-C cable, retail box, Spigen Liquid Air case

Reason for Selling: Upgrading to 16 Pro Max. 
Meetup Preferred: Gulshan-1 / Banani or police station verified public locations. Doorstep delivery available with advance courier charges.`,
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
  const params = useParams();
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
    router.push(`/checkout?productId=${product._id}`);
  };

  const handleChat = () => {
    toast.info(`Connecting you with seller ${product.sellerInfo?.name}...`);
    router.push(`/dashboard`);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <ChevronRight size={14} />
          <Link href="/listings" className="hover:text-indigo-600">Listings</Link>
          <ChevronRight size={14} />
          <Link href={`/listings?category=${product.category}`} className="hover:text-indigo-600">{product.category}</Link>
          <ChevronRight size={14} />
          <span className="text-slate-800 truncate max-w-[200px]">{product.title}</span>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* ── Left: Image Gallery (7 Cols) ── */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Large Image Frame */}
            <div className="relative aspect-4/3 sm:aspect-16/10 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <img
                src={activeImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />

              {/* Floating Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="badge condition-like-new font-bold px-3 py-1 text-xs shadow-md backdrop-blur-md">
                  Condition: {product.condition}
                </span>
                {product.isFeatured && (
                  <span className="badge badge-warning font-bold px-3 py-1 text-xs flex items-center gap-1 shadow-md backdrop-blur-md">
                    <Sparkles size={12} /> Featured Listing
                  </span>
                )}
              </div>

              {/* Action buttons on image */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  type="button"
                  onClick={handleFavorite}
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-red-500 flex items-center justify-center shadow-md transition-transform hover:scale-110"
                >
                  <Heart size={20} className={isFavorited ? "fill-red-500 stroke-red-500 text-red-500" : ""} />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-indigo-600 flex items-center justify-center shadow-md transition-transform hover:scale-110"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* Thumbnail Row */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images?.map((img, index) => (
                <button
                  key={img.publicId || index}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === index
                      ? "border-indigo-600 shadow-md scale-105"
                      : "border-slate-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Description Section */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900">
                Seller Description & Overview
              </h2>
              <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line font-normal">
                {product.description}
              </div>

              {/* Specifications Matrix */}
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Item Specifications
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-[11px] text-slate-400 font-semibold block">Category</span>
                    <span className="text-xs font-bold text-slate-800">{product.category}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-[11px] text-slate-400 font-semibold block">Condition</span>
                    <span className="text-xs font-bold text-slate-800">{product.condition}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-[11px] text-slate-400 font-semibold block">Stock</span>
                    <span className="text-xs font-bold text-slate-800">{product.stock} available</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-[11px] text-slate-400 font-semibold block">Delivery / Meetup</span>
                    <span className="text-xs font-bold text-slate-800">In-Person & Courier</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-[11px] text-slate-400 font-semibold block">Negotiable</span>
                    <span className="text-xs font-bold text-emerald-600">Yes, within reason</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-[11px] text-slate-400 font-semibold block">Authenticity</span>
                    <span className="text-xs font-bold text-indigo-600">100% Verified Genuine</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Buy Box & Seller Profile (5 Cols) ── */}
          <div className="lg:col-span-5 space-y-6">
            {/* Main Buy Box */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              {/* Category & Posted Time */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                  {product.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={13} /> {timeAgo(product.createdAt)}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                {product.title}
              </h1>

              {/* Location & View Stats */}
              <div className="flex items-center gap-4 text-xs text-slate-500 pb-4 border-b border-slate-100">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin size={14} className="text-slate-400" />
                  {product.location?.city}
                </span>
                <span className="flex items-center gap-1 font-medium">
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
                      <span className="text-base text-slate-400 line-through font-medium">
                        {formatCurrency(product.originalPrice)}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-400">Fixed/Negotiable in BDT (Bangladeshi Taka)</p>
              </div>

              {/* Primary Call to Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="btn btn-primary w-full py-4 rounded-xl font-bold text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={20} />
                  <span>Buy Now with Escrow Protection</span>
                </button>

                <button
                  type="button"
                  onClick={handleChat}
                  className="btn btn-secondary w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  <span>Chat with Seller</span>
                </button>
              </div>

              {/* Buyer Protection Guarantee */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs">
                  <ShieldCheck size={16} /> ReSell Hub Buyer Protection Guarantee
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Your payment is safely held until you inspect and approve the item. 100% money back if not as described.
                </p>
              </div>
            </div>

            {/* Seller Information Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Seller Information
              </h3>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xl overflow-hidden shrink-0">
                  {product.sellerInfo?.photo ? (
                    <img src={product.sellerInfo.photo} alt="seller" className="w-full h-full object-cover" />
                  ) : (
                    product.sellerInfo?.name?.[0]
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-base">
                      {product.sellerInfo?.name}
                    </h4>
                    <span className="badge badge-success text-[10px] font-bold py-0.5">
                      Verified
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star size={13} fill="#f59e0b" /> {product.sellerInfo?.rating}
                    </span>
                    <span>•</span>
                    <span>{product.sellerInfo?.totalSales} Completed Sales</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100">
                <div className="text-slate-500">
                  Member since: <strong className="text-slate-700">Jan 2024</strong>
                </div>
                <div className="text-slate-500">
                  Response rate: <strong className="text-emerald-600">99% (&lt; 15 mins)</strong>
                </div>
              </div>

              <Link
                href={`/users/${product.sellerInfo?.sellerId || "seller"}`}
                className="block text-center text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-2"
              >
                View all listings from this seller →
              </Link>
            </div>

            {/* Safety Tips Checklist */}
            <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200/80 space-y-2 text-xs text-amber-900">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <AlertCircle size={15} /> Safety Guidelines for Buyers
              </div>
              <ul className="space-y-1.5 text-[11px] list-disc list-inside text-amber-800/90 leading-relaxed">
                <li>Meet in crowded, well-lit public places (e.g. shopping malls, metro stations).</li>
                <li>Inspect hardware, IMEI/serial numbers before concluding payment.</li>
                <li>Never share banking OTPs or sensitive personal data with strangers.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── Related / Similar Listings ── */}
        <div className="pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Similar Items You Might Like
              </h2>
              <p className="text-xs text-slate-500 mt-1">Based on category & condition</p>
            </div>
            <Link href="/listings" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
              View All Listings →
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
