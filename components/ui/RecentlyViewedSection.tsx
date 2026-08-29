"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { History, Trash2, ArrowRight } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { getRecentlyViewed, clearRecentlyViewed } from "@/lib/recentlyViewed";
import type { Product } from "@/types";

interface RecentlyViewedSectionProps {
  currentProductId?: string;
  title?: string;
  limit?: number;
}

export default function RecentlyViewedSection({
  currentProductId,
  title = "Recently Viewed Items",
  limit = 4,
}: RecentlyViewedSectionProps) {
  const [items, setItems] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  const loadItems = () => {
    const list = getRecentlyViewed();
    const filtered = currentProductId ? list.filter((p) => p._id !== currentProductId) : list;
    setItems(filtered.slice(0, limit));
  };

  useEffect(() => {
    setMounted(true);
    loadItems();
  }, [currentProductId]);

  const handleClear = () => {
    clearRecentlyViewed();
    setItems([]);
  };

  if (!mounted || items.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-12 border-t border-slate-200/80 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <History size={18} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Items you checked out recently
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
          >
            <Trash2 size={13} />
            <span>Clear History</span>
          </button>
          <Link
            href="/listings"
            className="hidden sm:flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
          >
            <span>Explore more</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
