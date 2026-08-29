"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Heart,
  MapPin,
  Sparkles,
  Star,
  ShieldCheck,
  ArrowUpRight,
  ImageOff,
  Scale,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency, timeAgo } from "@/lib/utils";
import ProductImage from "@/components/ui/ProductImage";
import type { Product } from "@/types";
import { toast } from "sonner";
import { isLocalFavorite, toggleLocalFavorite } from "@/lib/favorites";
import { useCompare } from "@/contexts/CompareContext";

interface ProductCardProps {
  product: Product;
  onFavoriteToggle?: (id: string) => void;
  isFavorite?: boolean;
}

export default function ProductCard({
  product,
  onFavoriteToggle,
  isFavorite,
}: ProductCardProps) {
  const { toggleCompare, isInCompare } = useCompare();
  const isCompared = isInCompare(product._id);

  const [fav, setFav] = useState(() => {
    if (typeof isFavorite === "boolean") return isFavorite;
    return isLocalFavorite(product._id);
  });

  const handleFavClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = toggleLocalFavorite(product);
    setFav(res.isFavorited);
    if (onFavoriteToggle) {
      onFavoriteToggle(product._id);
    }
    toast.success(res.isFavorited ? "Saved to wishlist! ❤️" : "Removed from wishlist");
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(product);
  };

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    null;

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const sellerId = product.sellerInfo?.sellerId || product.seller?._id || "seller-1";
  const isSellerVerified =
    Boolean(product.seller?.isVerifiedSeller) ||
    Boolean(product.sellerInfo?.isVerifiedSeller) ||
    Number(product.sellerInfo?.rating || 0) >= 4.8;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="premium-card group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl"
    >
      <Link href={`/listings/${product._id}`} className="block">
        {/* ── Image & Badges Frame ── */}
        <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden">
          {primaryImage ? (
            <ProductImage
              src={primaryImage}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-slate-100 via-indigo-50/30 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 flex flex-col items-center justify-center text-slate-400 p-4">
              <div className="w-12 h-12 rounded-2xl bg-white/90 dark:bg-slate-800 shadow-xs border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-400 mb-1.5 group-hover:scale-105 transition-transform">
                <ImageOff size={22} className="text-slate-400" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                No Image Available
              </span>
            </div>
          )}

          {/* Condition & Featured Pills */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold tracking-wide uppercase bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-200 shadow-sm border border-white/50 dark:border-slate-700">
              {product.condition}
            </span>
            {product.isFeatured && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md flex items-center gap-1 w-fit">
                <Sparkles size={11} /> Featured
              </span>
            )}
          </div>

          {/* Action Buttons: Wishlist & Compare */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
            {/* Compare Toggle Button */}
            <button
              type="button"
              onClick={handleCompareClick}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                isCompared
                  ? "bg-indigo-600 text-white scale-105 ring-2 ring-indigo-300 dark:ring-indigo-700"
                  : "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-105"
              }`}
              title={isCompared ? "Remove from comparison" : "Add to comparison"}
              aria-label="Compare item"
            >
              {isCompared ? <Check size={15} /> : <Scale size={15} />}
            </button>

            {/* Favorite Wishlist Button */}
            <button
              type="button"
              onClick={handleFavClick}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                fav
                  ? "bg-rose-500 text-white scale-105"
                  : "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:scale-105"
              }`}
              aria-label="Save item"
            >
              <Heart size={16} className={fav ? "fill-white" : ""} />
            </button>
          </div>

          {/* Category Chip */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="text-[11px] font-bold bg-slate-950/70 text-white backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
              {product.category}
            </span>
          </div>

          {/* Discount Tag */}
          {discount && (
            <div className="absolute bottom-3 right-3 z-10">
              <span className="text-[11px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-md shadow-sm">
                -{discount}%
              </span>
            </div>
          )}
        </div>

        {/* ── Card Content ── */}
        <div className="p-4 sm:p-5 flex flex-col justify-between gap-3">
          <div>
            {/* Title & Quick Arrow */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                {product.title}
              </h3>
              <ArrowUpRight
                size={16}
                className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5"
              />
            </div>

            {/* Location & Time */}
            <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mt-1.5">
              <span className="flex items-center gap-1 truncate max-w-[140px] font-medium text-slate-500 dark:text-slate-400">
                <MapPin size={12} className="text-indigo-500 shrink-0" />
                {product.location?.city || "Bangladesh"}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">{timeAgo(product.createdAt)}</span>
            </div>
          </div>

          {/* Price & Seller Verification */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Seller Pill with Verification Badge */}
            <div className="flex items-center gap-1.5">
              {isSellerVerified && (
                <span
                  title="Verified Seller"
                  className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                >
                  <ShieldCheck size={12} />
                </span>
              )}
              <div className="flex items-center gap-1 text-[11px] font-bold bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700">
                <Star size={11} className="text-amber-500 fill-amber-500" />
                <span>{product.sellerInfo?.rating ? Number(product.sellerInfo.rating).toFixed(1) : "5.0"}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
