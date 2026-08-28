"use client";

import React from "react";

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-[4/3] bg-slate-200" />

      <div className="p-4 space-y-3">
        {/* Category + condition badges */}
        <div className="flex gap-2">
          <div className="h-5 w-20 bg-slate-200 rounded-full" />
          <div className="h-5 w-16 bg-slate-200 rounded-full" />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <div className="h-4 bg-slate-200 rounded-lg w-full" />
          <div className="h-4 bg-slate-200 rounded-lg w-3/4" />
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-1">
          <div className="h-6 w-24 bg-slate-200 rounded-lg" />
          <div className="h-5 w-16 bg-slate-200 rounded-lg" />
        </div>

        {/* Seller */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
          <div className="w-7 h-7 bg-slate-200 rounded-full" />
          <div className="h-3 w-24 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
