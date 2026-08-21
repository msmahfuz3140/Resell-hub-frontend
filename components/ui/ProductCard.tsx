"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Sparkles, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency, timeAgo } from "@/lib/utils";
import type { Product } from "@/types";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  onFavoriteToggle?: (id: string) => void;
  isFavorite?: boolean;
}

export default function ProductCard({
  product,
  onFavoriteToggle,
  isFavorite = false,
}: ProductCardProps) {
  const [fav, setFav] = useState(isFavorite);

  const handleFavClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFav(!fav);
    if (onFavoriteToggle) {
      onFavoriteToggle(product._id);
    } else {
      toast.success(fav ? "Removed from wishlist" : "Added to wishlist! ❤️");
    }
  };

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";

  const conditionClass =
    product.condition === "New"
      ? "condition-new"
      : product.condition === "Like New"
      ? "condition-like-new"
      : product.condition === "Good"
      ? "condition-good"
      : "condition-fair";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="product-card group"
    >
      <Link href={`/listings/${product._id}`} className="block">
        {/* Image Container */}
        <div className="product-card-image">
          <img
            src={primaryImage}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Condition Badge */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            <span
              className={`badge ${conditionClass} font-semibold backdrop-blur-md shadow-sm`}
            >
              {product.condition}
            </span>
            {product.isFeatured && (
              <span className="badge badge-warning flex items-center gap-1 shadow-sm backdrop-blur-md">
                <Sparkles size={11} /> Featured
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            type="button"
            onClick={handleFavClick}
            className={`favorite-btn ${fav ? "active text-red-500" : "text-slate-400"}`}
            aria-label="Save to wishlist"
          >
            <Heart size={18} className={fav ? "fill-red-500 stroke-red-500" : ""} />
          </button>

          {/* Category Tag */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="text-[11px] font-medium bg-black/60 text-white backdrop-blur-md px-2.5 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col justify-between">
          <div>
            {/* Title */}
            <h3 className="font-semibold text-slate-800 text-[15px] line-clamp-1 group-hover:text-indigo-600 transition-colors">
              {product.title}
            </h3>

            {/* Location & Time */}
            <div className="flex items-center justify-between text-xs text-slate-500 mt-1.5 mb-2.5">
              <span className="flex items-center gap-1 truncate max-w-[130px]">
                <MapPin size={12} className="text-slate-400 shrink-0" />
                {product.location?.city || "Bangladesh"}
              </span>
              <span className="shrink-0">{timeAgo(product.createdAt)}</span>
            </div>
          </div>

          {/* Price & Action */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-lg font-extrabold text-slate-900">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through ml-1.5">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Seller Avatar / Trust info */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                {product.sellerInfo?.name?.[0] || "S"}
              </span>
              <span className="truncate max-w-[70px]">
                {product.sellerInfo?.name?.split(" ")[0] || "Seller"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
