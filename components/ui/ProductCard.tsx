"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Sparkles, Star, ShieldCheck, ArrowUpRight, ImageOff } from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency, timeAgo } from "@/lib/utils";
import ProductImage from "@/components/ui/ProductImage";
import type { Product } from "@/types";
import { toast } from "sonner";

import { isLocalFavorite, toggleLocalFavorite } from "@/lib/favorites";

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

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    null;

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="premium-card group"
    >
      <Link href={`/listings/${product._id}`} className="block">
        {/* ── Image & Badges Frame ── */}
        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
          {primaryImage ? (
            <ProductImage
              src={primaryImage}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-slate-100 via-indigo-50/30 to-slate-200 flex flex-col items-center justify-center text-slate-400 p-4">
              <div className="w-12 h-12 rounded-2xl bg-white/90 shadow-xs border border-slate-200/80 flex items-center justify-center text-slate-400 mb-1.5 group-hover:scale-105 transition-transform">
                <ImageOff size={22} className="text-slate-400" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                No Image Available
              </span>
            </div>
          )}

          {/* Condition & Featured Pills */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold tracking-wide uppercase bg-white/90 backdrop-blur-md text-slate-800 shadow-sm border border-white/50">
              {product.condition}
            </span>
            {product.isFeatured && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md flex items-center gap-1 w-fit">
                <Sparkles size={11} /> Featured
              </span>
            )}
          </div>

          {/* Favorite Wishlist Button */}
          <button
            type="button"
            onClick={handleFavClick}
            className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
              fav
                ? "bg-rose-500 text-white scale-110"
                : "bg-white/90 backdrop-blur-md text-slate-600 hover:text-rose-500 hover:bg-white hover:scale-105"
            }`}
            aria-label="Save item"
          >
            <Heart size={16} className={fav ? "fill-white" : ""} />
          </button>

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
              <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1 group-hover:text-indigo-600 transition-colors leading-snug">
                {product.title}
              </h3>
              <ArrowUpRight
                size={16}
                className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5"
              />
            </div>

            {/* Location & Time */}
            <div className="flex items-center justify-between text-xs text-slate-400 mt-1.5">
              <span className="flex items-center gap-1 truncate max-w-[140px] font-medium text-slate-500">
                <MapPin size={12} className="text-indigo-500 shrink-0" />
                {product.location?.city || "Bangladesh"}
              </span>
              <span className="text-[11px] text-slate-400">{timeAgo(product.createdAt)}</span>
            </div>
          </div>

          {/* Price & Seller Verification */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Seller Rating Pill */}
            <div className="flex items-center gap-1 text-[11px] font-bold bg-slate-50 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/80">
              <Star size={11} className="text-amber-500 fill-amber-500" />
              <span>{product.sellerInfo?.rating ? Number(product.sellerInfo.rating).toFixed(1) : "5.0"}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
