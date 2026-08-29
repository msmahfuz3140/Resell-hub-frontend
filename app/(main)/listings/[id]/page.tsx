"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Heart,
  Share2,
  MapPin,
  ShieldCheck,
  Star,
  MessageCircle,
  Sparkles,
  ChevronRight,
  Clock,
  Eye,
  CheckCircle2,
  ArrowLeft,
  Lock,
  Phone,
  ThumbsUp,
  AlertCircle,
  RefreshCw,
  Package,
  Tag,
  User as UserIcon,
  ImageOff,
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, timeAgo } from "@/lib/utils";
import ProductCard from "@/components/ui/ProductCard";
import ProductImage from "@/components/ui/ProductImage";
import { productService } from "@/services/productService";
import { useAuth } from "@/contexts/AuthContext";
import { isLocalFavorite, toggleLocalFavorite } from "@/lib/favorites";
import { findCustomProductById } from "@/lib/customProducts";
import type { Product } from "@/types";

// ─── Review Types ─────────────────────────────────
interface Review {
  _id: string;
  reviewerInfo: { name: string; photo?: string | null };
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  sellerReply?: { comment?: string | null; repliedAt?: string | null };
}

interface RatingStats {
  avgRating: number;
  count: number;
  rating1: number;
  rating2: number;
  rating3: number;
  rating4: number;
  rating5: number;
}

// ─── Curated Fallback Products Database ─────────────
const FALLBACK_PRODUCTS_MAP: Record<string, Product> = {
  "prod-1": {
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
        publicId: "iphone15",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=900&auto=format&fit=crop&q=80",
        publicId: "iphone15_2",
        isPrimary: false,
      },
    ],
    sellerInfo: {
      sellerId: "user-1",
      name: "Tanzid Hossain",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      phone: "+880 1711-223344",
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
    tags: ["apple", "iphone15", "naturaltitanium", "flagship"],
    meetupPreference: "Both",
    negotiable: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "prod-2": {
    _id: "prod-2",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    description: `Used for 2 months only with utmost care.
Industry-leading noise cancellation with 8 microphones and Auto NC Optimizer.
Comes with carry case, 3.5mm gold-plated cable, and USB-C fast charging cable.
Battery gives over 30 hours of continuous music playback with ANC turned on.`,
    price: 28500,
    originalPrice: 36000,
    category: "Electronics",
    condition: "Like New",
    images: [
      {
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80",
        publicId: "sony_wh",
        isPrimary: true,
      },
    ],
    sellerInfo: {
      sellerId: "user-2",
      name: "Nabila Rahman",
      photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
      phone: "+880 1812-345678",
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
    tags: ["sony", "headphones", "anc", "wireless"],
    meetupPreference: "Both",
    negotiable: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "prod-3": {
    _id: "prod-3",
    title: "MacBook Air M2 (16GB RAM, 512GB SSD) Midnight",
    description: `Perfect for developers, designers, and students.
Battery health 100% with only 45 cycle count.
Includes original 35W Dual USB-C port power adapter and MagSafe 3 braided cable.`,
    price: 108000,
    originalPrice: 135000,
    category: "Electronics",
    condition: "New",
    images: [
      {
        url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&auto=format&fit=crop&q=80",
        publicId: "macbook_m2",
        isPrimary: true,
      },
    ],
    sellerInfo: {
      sellerId: "user-3",
      name: "Sabbir Ahmed",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      phone: "+880 1913-987654",
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
    tags: ["apple", "macbook", "m2", "laptop"],
    meetupPreference: "Both",
    negotiable: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "prod-4": {
    _id: "prod-4",
    title: "Ergonomic Mesh Office Chair with Lumbar Support",
    description: `High-grade breathable Korean mesh back with 3D adjustable armrests and multi-level reclining lock.
Comfortable high-density molded foam seat cushion designed for 8+ hours workdays.`,
    price: 8500,
    originalPrice: 14000,
    category: "Furniture",
    condition: "Good",
    images: [
      {
        url: "https://images.unsplash.com/photo-1580481077197-2e32a688b139?w=900&auto=format&fit=crop&q=80",
        publicId: "ergo_chair",
        isPrimary: true,
      },
    ],
    sellerInfo: {
      sellerId: "user-4",
      name: "Imran Khan",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      phone: "+880 1614-556677",
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
    tags: ["furniture", "chair", "ergonomic", "wfh"],
    meetupPreference: "In-person",
    negotiable: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "prod-5": {
    _id: "prod-5",
    title: "Canon EOS R50 Mirrorless Camera + 18-45mm Lens",
    description: `Lightweight and compact mirrorless camera with 24.2 MP APS-C CMOS sensor.
Features uncropped 4K 30p video recording and Dual Pixel CMOS AF II.
Shutter count is under 1,500 clicks. Includes 64GB Extreme SD card.`,
    price: 62000,
    originalPrice: 78000,
    category: "Electronics",
    condition: "Like New",
    images: [
      {
        url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&auto=format&fit=crop&q=80",
        publicId: "canon_r50",
        isPrimary: true,
      },
    ],
    sellerInfo: {
      sellerId: "user-5",
      name: "Farhan Tariq",
      phone: "+880 1715-112233",
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
    tags: ["canon", "camera", "mirrorless", "vlog"],
    meetupPreference: "Both",
    negotiable: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "prod-6": {
    _id: "prod-6",
    title: "Yamaha FZ-S Version 3.0 (Matte Dark Blue)",
    description: `Single-hand driven bike with updated digital smart card registration.
Fuel-injected 149cc engine with single-channel ABS.
18,000 km run, regularly serviced with Yamalube engine oil.`,
    price: 195000,
    originalPrice: 245000,
    category: "Vehicles",
    condition: "Good",
    images: [
      {
        url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=900&auto=format&fit=crop&q=80",
        publicId: "yamaha_fzs",
        isPrimary: true,
      },
    ],
    sellerInfo: {
      sellerId: "user-6",
      name: "Rifat Hasan",
      phone: "+880 1816-998877",
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
    tags: ["yamaha", "motorcycle", "bike", "fzs"],
    meetupPreference: "In-person",
    negotiable: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "prod-7": {
    _id: "prod-7",
    title: "Vintage Cowhide Leather Biker Jacket (Size M)",
    description: `Genuine heavy-duty cowhide leather.
Worn only 3-4 times in winter. High quality YKK zippers and satin lining.`,
    price: 4500,
    originalPrice: 9000,
    category: "Clothing",
    condition: "Good",
    images: [
      {
        url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&auto=format&fit=crop&q=80",
        publicId: "leather_biker",
        isPrimary: true,
      },
    ],
    sellerInfo: {
      sellerId: "user-7",
      name: "Ayman Sadiq",
      phone: "+880 1917-443322",
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
    tags: ["fashion", "leather", "jacket", "vintage"],
    meetupPreference: "Both",
    negotiable: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "prod-8": {
    _id: "prod-8",
    title: "Yamaha Pacifica 112V Electric Guitar + Fender Frontman Amp",
    description: `Versatile solid alder body electric guitar with Alnico V custom pickups.
Comes paired with Fender Frontman 10G practice amplifier, heavy padded gig bag, and instrument cable.`,
    price: 24000,
    originalPrice: 32000,
    category: "Music",
    condition: "Like New",
    images: [
      {
        url: "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=900&auto=format&fit=crop&q=80",
        publicId: "yamaha_guitar",
        isPrimary: true,
      },
    ],
    sellerInfo: {
      sellerId: "user-8",
      name: "Tahsan Ali",
      phone: "+880 1718-665544",
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
    tags: ["yamaha", "guitar", "music", "electricguitar"],
    meetupPreference: "Both",
    negotiable: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

const SAMPLE_REVIEWS: Review[] = [
  {
    _id: "rev-1",
    reviewerInfo: { name: "Mahir Faysal" },
    rating: 5,
    comment: "The item condition was exactly as described! Transaction went super smooth via Escrow.",
    isVerifiedPurchase: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    sellerReply: { comment: "Thank you Mahir! Enjoy your purchase!", repliedAt: new Date().toISOString() },
  },
  {
    _id: "rev-2",
    reviewerInfo: { name: "Sumaiya Anjum" },
    rating: 5,
    comment: "Genuine product with all accessories included. Seller was very cooperative during meetup.",
    isVerifiedPurchase: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
];

// ─── Star Rating Component ─────────────────────────
function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-slate-300 fill-slate-200"}
        />
      ))}
    </div>
  );
}

// ─── Rating Bar Component ──────────────────────────
function RatingBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="font-bold text-slate-600 w-4 shrink-0">{label}</span>
      <div className="flex-1 bg-slate-100 rounded-full h-2">
        <div
          className="bg-amber-400 h-2 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-slate-400 font-medium w-6 text-right shrink-0">{count}</span>
    </div>
  );
}

// ─── Condition Badge Color ─────────────────────────
function conditionColor(condition: string) {
  const map: Record<string, string> = {
    New: "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Like New": "bg-blue-100 text-blue-700 border-blue-200",
    Good: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Fair: "bg-orange-100 text-orange-700 border-orange-200",
    Poor: "bg-rose-100 text-rose-700 border-rose-200",
  };
  return map[condition] || "bg-slate-100 text-slate-700 border-slate-200";
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingStats, setRatingStats] = useState<RatingStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // Fetch product with fallback support
  const fetchProduct = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);

    // 1. Try fetching from live backend API
    try {
      const data = await productService.getProductById(id as string);
      if (data.success && data.data?.product) {
        const p = data.data.product;
        setProduct(p);
        if (user && p.favorites?.includes(user._id)) {
          setIsFavorited(true);
        }
        fetchRelated(p.category, p._id);
        setIsLoading(false);
        return;
      }
    } catch {
      // If API fails or product not in DB, check fallback map below
    }

    // 2. Check custom local products
    const custom = findCustomProductById(id as string);
    if (custom) {
      setProduct(custom);
      setReviews(SAMPLE_REVIEWS);
      setRatingStats({
        avgRating: 5.0,
        count: 1,
        rating1: 0,
        rating2: 0,
        rating3: 0,
        rating4: 0,
        rating5: 1,
      });
      fetchRelated(custom.category, custom._id);
      setIsLoading(false);
      return;
    }

    // 3. Check local fallback map
    const fallback = FALLBACK_PRODUCTS_MAP[id as string];
    if (fallback) {
      setProduct(fallback);
      setReviews(SAMPLE_REVIEWS);
      setRatingStats({
        avgRating: 4.9,
        count: 2,
        rating1: 0,
        rating2: 0,
        rating3: 0,
        rating4: 0,
        rating5: 2,
      });
      fetchRelated(fallback.category, fallback._id);
      setIsLoading(false);
      return;
    }

    // 4. Not found
    setError("Product not found");
    setIsLoading(false);
  }, [id, user]);

  // Fetch related products
  const fetchRelated = async (category: string, currentId: string) => {
    try {
      const data = await productService.getProducts({ category, limit: 4, page: 1 });
      const apiRelated = (data.data || []).filter((p) => p._id !== currentId).slice(0, 4);
      if (apiRelated.length > 0) {
        setRelatedProducts(apiRelated);
      } else {
        const fallbackRelated = Object.values(FALLBACK_PRODUCTS_MAP).filter((p) => p._id !== currentId).slice(0, 4);
        setRelatedProducts(fallbackRelated);
      }
    } catch {
      const fallbackRelated = Object.values(FALLBACK_PRODUCTS_MAP).filter((p) => p._id !== currentId).slice(0, 4);
      setRelatedProducts(fallbackRelated);
    }
  };

  // Fetch reviews
  const fetchReviews = useCallback(async () => {
    if (!id) return;
    setReviewsLoading(true);
    try {
      const data = await productService.getProductReviews(id as string);
      if (data.data && data.data.length > 0) {
        setReviews(data.data);
        if (data.ratingStats) setRatingStats(data.ratingStats);
      } else if (FALLBACK_PRODUCTS_MAP[id as string]) {
        setReviews(SAMPLE_REVIEWS);
        setRatingStats({ avgRating: 4.9, count: 2, rating1: 0, rating2: 0, rating3: 0, rating4: 0, rating5: 2 });
      }
    } catch {
      if (FALLBACK_PRODUCTS_MAP[id as string]) {
        setReviews(SAMPLE_REVIEWS);
        setRatingStats({ avgRating: 4.9, count: 2, rating1: 0, rating2: 0, rating3: 0, rating4: 0, rating5: 2 });
      }
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [fetchProduct, fetchReviews]);

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to save items to your wishlist.");
      router.push("/login");
      return;
    }
    if (!product || favoriteLoading) return;
    setFavoriteLoading(true);
    try {
      const res = toggleLocalFavorite(product);
      setIsFavorited(res.isFavorited);
      toast.success(res.isFavorited ? "Saved to wishlist! ❤️" : "Removed from wishlist");
      // Background sync with API
      productService.toggleFavorite(product._id).catch(() => {});
    } catch {
      setIsFavorited(!isFavorited);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title,
        text: `Check out ${product?.title} on ReSell Hub!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard! 📋");
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error("Please login to purchase items.");
      router.push(`/login?redirect=/checkout?productId=${product?._id || id}`);
      return;
    }
    toast.success("Redirecting to Escrow Protected Checkout...");
    router.push(`/checkout?productId=${product?._id || id}`);
  };

  const handleChat = () => {
    if (!isAuthenticated) {
      toast.error("Please login to message the seller.");
      router.push("/login");
      return;
    }
    toast.info(`Connecting with seller ${product?.sellerInfo?.name}...`);
    router.push("/dashboard");
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
            <div className="lg:col-span-7 space-y-4">
              <div className="aspect-[4/3] bg-slate-200 rounded-3xl" />
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-20 h-20 bg-slate-200 rounded-2xl" />
                ))}
              </div>
              <div className="bg-white rounded-3xl p-8 space-y-3">
                <div className="h-6 bg-slate-200 rounded-lg w-3/4" />
                <div className="h-4 bg-slate-200 rounded-lg w-full" />
                <div className="h-4 bg-slate-200 rounded-lg w-5/6" />
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-8 space-y-4">
                <div className="h-8 bg-slate-200 rounded-lg w-1/2" />
                <div className="h-12 bg-slate-200 rounded-lg w-3/4" />
                <div className="h-12 bg-slate-200 rounded-2xl" />
                <div className="h-10 bg-slate-200 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error || !product) {
    return (
      <div className="bg-slate-50 min-h-screen py-20">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Product Not Found</h1>
          <p className="text-slate-500 mb-8">{error || "This listing may have been removed."}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => fetchProduct()} className="btn-shiny-primary px-6 py-3 rounded-xl font-black text-xs flex items-center gap-2">
              <RefreshCw size={14} /> Try Again
            </button>
            <Link href="/listings" className="px-6 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 font-black text-xs text-slate-700 transition-all">
              Browse Listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const activeImage = product.images?.[activeImageIndex]?.url || product.images?.[0]?.url;
  const discountPct =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-6">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/listings" className="hover:text-indigo-600 transition-colors">Marketplace</Link>
          <ChevronRight size={14} />
          <Link href={`/listings?category=${product.category}`} className="hover:text-indigo-600 transition-colors">
            {product.category}
          </Link>
          <ChevronRight size={14} />
          <span className="text-slate-700 truncate max-w-[180px]">{product.title}</span>
        </div>

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft size={15} /> Back to listings
        </button>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Left: Gallery + Description */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Image */}
            <div className="relative aspect-[4/3] bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm group">
              {activeImage ? (
                <ProductImage
                  src={activeImage}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-slate-100 via-indigo-50/30 to-slate-200 flex flex-col items-center justify-center text-slate-400 p-8">
                  <div className="w-16 h-16 rounded-3xl bg-white/90 shadow-md border border-slate-200/80 flex items-center justify-center text-slate-400 mb-2">
                    <ImageOff size={32} className="text-slate-400" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    No Images Provided
                  </span>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wide border ${conditionColor(product.condition)} bg-white/95 backdrop-blur-md shadow-md`}>
                  {product.condition}
                </span>
                {product.isFeatured && (
                  <span className="px-3.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md flex items-center gap-1.5 w-fit">
                    <Sparkles size={12} /> Featured
                  </span>
                )}
                {product.status === "sold" && (
                  <span className="px-3.5 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-md">
                    SOLD
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  type="button"
                  onClick={handleFavorite}
                  disabled={favoriteLoading}
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-rose-500 flex items-center justify-center shadow-md transition-all hover:scale-110 disabled:opacity-60"
                >
                  <Heart size={18} className={isFavorited ? "fill-rose-500 text-rose-500" : ""} />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-indigo-600 flex items-center justify-center shadow-md transition-all hover:scale-110"
                >
                  <Share2 size={16} />
                </button>
              </div>

              {/* Image counter */}
              {product.images?.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {activeImageIndex + 1} / {product.images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={img.publicId || index}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === index
                        ? "border-indigo-600 shadow-md scale-105"
                        : "border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-300"
                    }`}
                  >
                    <img src={img.url} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-slate-900">Seller Description</h2>
              <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </div>

              {/* Specifications Grid */}
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">
                  Item Specifications
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-[11px] text-slate-400 font-bold block">Category</span>
                    <span className="text-xs font-black text-slate-800">{product.category}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-[11px] text-slate-400 font-bold block">Condition</span>
                    <span className={`text-xs font-black ${conditionColor(product.condition).split(" ")[1]}`}>
                      {product.condition}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-[11px] text-slate-400 font-bold block">Stock</span>
                    <span className="text-xs font-black text-slate-800">{product.stock ?? 1} Unit(s)</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-[11px] text-slate-400 font-bold block">Meetup</span>
                    <span className="text-xs font-black text-slate-800">{product.meetupPreference || "Both"}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-[11px] text-slate-400 font-bold block">Negotiable</span>
                    <span className={`text-xs font-black ${product.negotiable ? "text-emerald-600" : "text-slate-500"}`}>
                      {product.negotiable ? "Yes" : "Fixed Price"}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-[11px] text-slate-400 font-bold block">Location</span>
                    <span className="text-xs font-black text-slate-800">{product.location?.city}</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <Tag size={12} /> Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Seller Full Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <UserIcon size={18} className="text-indigo-600" /> Seller Information
              </h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-xl overflow-hidden shadow-lg">
                    {product.sellerInfo?.photo ? (
                      <img src={product.sellerInfo.photo} alt={product.sellerInfo.name} className="w-full h-full object-cover" />
                    ) : (
                      product.sellerInfo?.name?.[0]?.toUpperCase()
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle2 size={10} className="text-white" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-slate-900">{product.sellerInfo?.name}</h3>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                      Verified Seller
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <div className="flex items-center gap-1">
                      <StarRating rating={product.sellerInfo?.rating || 0} size={12} />
                      <span className="text-xs font-bold text-slate-700">
                        {product.sellerInfo?.rating ? Number(product.sellerInfo.rating).toFixed(1) : "5.0"}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-medium">
                      {product.sellerInfo?.totalSales || 0} sales completed
                    </span>
                    {product.sellerInfo?.location?.city && (
                      <>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                          <MapPin size={11} className="text-indigo-500" />
                          {product.sellerInfo.location.city}
                        </span>
                      </>
                    )}
                  </div>
                  {product.sellerInfo?.phone && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                      <Phone size={12} className="text-indigo-500" />
                      <span>{product.sellerInfo.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black text-slate-900">Buyer Reviews</h2>
                {ratingStats && ratingStats.count > 0 && (
                  <span className="text-xs text-slate-400 font-medium">{ratingStats.count} reviews</span>
                )}
              </div>

              {reviewsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex gap-3">
                      <div className="w-10 h-10 bg-slate-200 rounded-full shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-slate-200 rounded w-1/3" />
                        <div className="h-3 bg-slate-200 rounded w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <Package size={36} className="mx-auto mb-3 opacity-40" />
                  <p className="text-sm font-semibold">No reviews yet</p>
                  <p className="text-xs mt-1">Be the first to review this product after purchase.</p>
                </div>
              ) : (
                <>
                  {/* Rating Summary */}
                  {ratingStats && (
                    <div className="flex flex-col sm:flex-row gap-8 pb-6 mb-6 border-b border-slate-100">
                      <div className="text-center sm:text-left">
                        <div className="text-5xl font-black text-slate-900">
                          {ratingStats.avgRating.toFixed(1)}
                        </div>
                        <StarRating rating={ratingStats.avgRating} size={18} />
                        <p className="text-xs text-slate-400 mt-1">{ratingStats.count} reviews</p>
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <RatingBar label="5" count={ratingStats.rating5} total={ratingStats.count} />
                        <RatingBar label="4" count={ratingStats.rating4} total={ratingStats.count} />
                        <RatingBar label="3" count={ratingStats.rating3} total={ratingStats.count} />
                        <RatingBar label="2" count={ratingStats.rating2} total={ratingStats.count} />
                        <RatingBar label="1" count={ratingStats.rating1} total={ratingStats.count} />
                      </div>
                    </div>
                  )}

                  {/* Review List */}
                  <div className="space-y-5">
                    {reviews.map((review) => (
                      <div key={review._id} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 overflow-hidden">
                          {review.reviewerInfo.photo ? (
                            <img src={review.reviewerInfo.photo} alt={review.reviewerInfo.name} className="w-full h-full object-cover" />
                          ) : (
                            review.reviewerInfo.name?.[0]?.toUpperCase()
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-black text-slate-900">{review.reviewerInfo.name}</span>
                            {review.isVerifiedPurchase && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 size={9} /> Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <StarRating rating={review.rating} size={12} />
                            <span className="text-[11px] text-slate-400">{timeAgo(review.createdAt)}</span>
                          </div>
                          <p className="text-sm text-slate-600 mt-2 leading-relaxed">{review.comment}</p>
                          {review.sellerReply?.comment && (
                            <div className="mt-3 pl-4 border-l-2 border-indigo-200 bg-indigo-50/50 p-3 rounded-xl">
                              <span className="text-xs font-black text-indigo-700 flex items-center gap-1 mb-1">
                                <ShieldCheck size={12} /> Seller Reply
                              </span>
                              <p className="text-xs text-slate-600">{review.sellerReply.comment}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: Buy Box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6 sticky top-24">
              {/* Category & Time */}
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

              {/* Location & Views */}
              <div className="flex items-center gap-4 text-xs text-slate-500 pb-4 border-b border-slate-100">
                <span className="flex items-center gap-1 font-semibold text-slate-600">
                  <MapPin size={14} className="text-indigo-600" />
                  {product.location?.city}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold">
                  <Eye size={14} className="text-slate-400" /> {product.views} views
                </span>
                {product.favoritesCount !== undefined && product.favoritesCount > 0 && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-rose-500">
                      <Heart size={13} fill="currentColor" /> {product.favoritesCount}
                    </span>
                  </>
                )}
              </div>

              {/* Pricing */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {formatCurrency(product.price)}
                  </span>
                  {discountPct > 0 && product.originalPrice && (
                    <>
                      <span className="text-base text-slate-400 line-through font-semibold">
                        {formatCurrency(product.originalPrice)}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                        {discountPct}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  {product.negotiable ? "Price is negotiable • Open to offers" : "Fixed price • No negotiation"}
                </p>
              </div>

              {/* Stock warning */}
              {product.stock !== undefined && product.stock <= 3 && product.stock > 0 && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-amber-700">
                  <ThumbsUp size={14} /> Only {product.stock} left in stock!
                </div>
              )}

              {/* CTAs */}
              {product.status === "active" ? (
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
                    <span>Chat with Seller</span>
                  </button>
                </div>
              ) : (
                <div className="py-4 text-center rounded-2xl bg-slate-100 border border-slate-200">
                  <span className="text-sm font-black text-slate-500">
                    {product.status === "sold" ? "This item has been sold" : "This listing is not available"}
                  </span>
                </div>
              )}

              {/* Escrow Guarantee */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-100 space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-900 font-black text-xs">
                  <ShieldCheck size={16} className="text-indigo-600" /> ReSell Hub Escrow Guarantee
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Your payment is held securely until you confirm receipt and item condition.
                </p>
              </div>

              {/* Seller Mini Card */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm overflow-hidden">
                    {product.sellerInfo?.photo ? (
                      <img src={product.sellerInfo.photo} alt={product.sellerInfo.name} className="w-full h-full object-cover" />
                    ) : (
                      product.sellerInfo?.name?.[0]?.toUpperCase()
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{product.sellerInfo?.name}</h4>
                    <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                      <Star size={11} fill="#f59e0b" />
                      {product.sellerInfo?.rating ? Number(product.sellerInfo.rating).toFixed(1) : "5.0"} ({product.sellerInfo?.totalSales || 0} sales)
                    </div>
                  </div>
                </div>
                <span className="badge badge-success text-[10px] font-bold py-0.5">Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-10 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Similar Listings</h2>
                <p className="text-xs text-slate-500 mt-0.5">From the same category</p>
              </div>
              <Link href={`/listings?category=${product.category}`} className="text-xs font-black text-indigo-600 hover:text-indigo-800">
                Browse all in {product.category} →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
