"use client";

import React from "react";
import Link from "next/link";
import {
  Scale,
  Trash2,
  ArrowLeft,
  Check,
  X,
  Star,
  Sparkles,
  MapPin,
  Tag,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import { useCompare } from "@/contexts/CompareContext";
import ProductImage from "@/components/ui/ProductImage";
import { formatCurrency, timeAgo } from "@/lib/utils";
import type { Product } from "@/types";

export default function ComparePage() {
  const { compareItems, removeFromCompare, clearCompare, count } = useCompare();

  // Find best metrics for highlighting
  const lowestPrice = compareItems.length > 0 ? Math.min(...compareItems.map((p) => p.price)) : 0;
  const highestRating =
    compareItems.length > 0
      ? Math.max(...compareItems.map((p) => Number(p.sellerInfo?.rating || 0)))
      : 0;

  if (count === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="text-center max-w-md bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-4">
            <Scale size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            No Products in Comparison
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6 leading-relaxed">
            Select up to 4 products from the marketplace or product pages to compare price, condition, category, and seller ratings side-by-side.
          </p>
          <Link
            href="/listings"
            className="btn-shiny-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider shadow-md"
          >
            <ShoppingBag size={15} />
            <span>Browse Marketplace</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 sm:py-12 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link
              href="/listings"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mb-2"
            >
              <ArrowLeft size={14} />
              <span>Back to Marketplace</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <Scale size={20} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Product Comparison
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Comparing {count} selected {count === 1 ? "item" : "items"} side-by-side
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={clearCompare}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 size={14} />
              <span>Clear All</span>
            </button>
            <Link
              href="/listings"
              className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
            >
              + Add More Items
            </Link>
          </div>
        </div>

        {/* Comparison Table Grid */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            {/* Top Product Showcase Row */}
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
                <th className="p-4 sm:p-6 w-44 sm:w-56 text-xs font-extrabold uppercase text-slate-400 dark:text-slate-500 tracking-wider align-top">
                  Product Overview
                </th>
                {compareItems.map((product) => {
                  const imgUrl = product.images?.[0]?.url || "";
                  return (
                    <th key={product._id} className="p-4 sm:p-6 align-top min-w-[220px]">
                      <div className="relative group">
                        <button
                          type="button"
                          onClick={() => removeFromCompare(product._id)}
                          className="absolute -top-2 -right-2 z-10 w-7 h-7 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 flex items-center justify-center shadow-md transition-colors"
                          title="Remove from comparison"
                        >
                          <X size={13} />
                        </button>

                        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-3 relative">
                          {imgUrl ? (
                            <ProductImage
                              src={imgUrl}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-200 dark:bg-slate-800" />
                          )}
                        </div>

                        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 mb-2 leading-snug">
                          {product.title}
                        </h3>

                        <div className="flex flex-col gap-1.5 mt-2">
                          <Link
                            href={`/listings/${product._id}`}
                            className="btn-shiny-primary w-full py-2 rounded-xl text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1"
                          >
                            <span>View Details</span>
                            <ExternalLink size={13} />
                          </Link>
                          <Link
                            href={`/checkout?productId=${product._id}`}
                            className="btn-shiny-amber w-full py-2 rounded-xl text-center text-xs font-black uppercase tracking-wider"
                          >
                            Purchase Now
                          </Link>
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
              {/* Price Row */}
              <tr>
                <td className="p-4 sm:p-5 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">
                  Price
                </td>
                {compareItems.map((product) => {
                  const isBest = product.price === lowestPrice && compareItems.length > 1;
                  return (
                    <td key={product._id} className="p-4 sm:p-5">
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-xl font-black text-slate-900 dark:text-white">
                          {formatCurrency(product.price)}
                        </span>
                        {isBest && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase">
                            Lowest Price
                          </span>
                        )}
                      </div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-slate-400 line-through block mt-0.5">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Condition Row */}
              <tr>
                <td className="p-4 sm:p-5 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">
                  Item Condition
                </td>
                {compareItems.map((product) => (
                  <td key={product._id} className="p-4 sm:p-5 font-bold">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
                      {product.condition}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Category Row */}
              <tr>
                <td className="p-4 sm:p-5 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">
                  Category
                </td>
                {compareItems.map((product) => (
                  <td key={product._id} className="p-4 sm:p-5 font-bold text-slate-800 dark:text-slate-200">
                    {product.category}
                  </td>
                ))}
              </tr>

              {/* Seller Name & Rating Row */}
              <tr>
                <td className="p-4 sm:p-5 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">
                  Seller & Rating
                </td>
                {compareItems.map((product) => {
                  const rating = Number(product.sellerInfo?.rating || 5.0);
                  const isTopRated = rating === highestRating && compareItems.length > 1;
                  return (
                    <td key={product._id} className="p-4 sm:p-5">
                      <p className="font-bold text-slate-900 dark:text-white">
                        {product.sellerInfo?.name || "Verified Seller"}
                      </p>
                      <div className="flex items-center gap-1 text-amber-500 font-extrabold text-xs mt-1">
                        <Star size={13} className="fill-amber-400" />
                        <span>{rating.toFixed(1)}</span>
                        <span className="text-slate-400 font-normal">
                          ({product.sellerInfo?.totalSales || 0} sales)
                        </span>
                        {isTopRated && (
                          <span className="ml-1 text-[10px] font-extrabold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                            Top Rated
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Location Row */}
              <tr>
                <td className="p-4 sm:p-5 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">
                  Location
                </td>
                {compareItems.map((product) => (
                  <td key={product._id} className="p-4 sm:p-5 text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-indigo-500 shrink-0" />
                      <span>{product.location?.city || "Bangladesh"}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Price Negotiable Row */}
              <tr>
                <td className="p-4 sm:p-5 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">
                  Price Negotiable
                </td>
                {compareItems.map((product) => (
                  <td key={product._id} className="p-4 sm:p-5">
                    {product.negotiable ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                        <Check size={14} /> Yes (Negotiable)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                        <X size={14} /> Fixed Price
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Meetup / Delivery Preference */}
              <tr>
                <td className="p-4 sm:p-5 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">
                  Delivery / Meetup
                </td>
                {compareItems.map((product) => (
                  <td key={product._id} className="p-4 sm:p-5 text-slate-700 dark:text-slate-300 font-medium">
                    {product.meetupPreference || "Both Courier & In-person"}
                  </td>
                ))}
              </tr>

              {/* Posted Date */}
              <tr>
                <td className="p-4 sm:p-5 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">
                  Listed Time
                </td>
                {compareItems.map((product) => (
                  <td key={product._id} className="p-4 sm:p-5 text-slate-500 dark:text-slate-400">
                    {timeAgo(product.createdAt)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
