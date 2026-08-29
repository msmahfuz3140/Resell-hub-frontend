"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, X, ArrowRight, Trash2 } from "lucide-react";
import { useCompare } from "@/contexts/CompareContext";
import ProductImage from "@/components/ui/ProductImage";
import { formatCurrency } from "@/lib/utils";

export default function CompareFloatingBar() {
  const { compareItems, removeFromCompare, clearCompare, count } = useCompare();

  if (count === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-4xl"
      >
        <div className="bg-slate-900/95 dark:bg-slate-900/98 backdrop-blur-2xl text-white p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left Title & Counter */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/80 text-white flex items-center justify-center shadow-xs">
                <Scale size={16} />
              </div>
              <div>
                <span className="text-xs font-black tracking-tight text-white block">
                  Product Comparison
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {count} of 4 items selected
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={clearCompare}
              className="sm:hidden text-slate-400 hover:text-rose-400 p-1"
              title="Clear all"
            >
              <Trash2 size={15} />
            </button>
          </div>

          {/* Center: Selected Products Thumbnails */}
          <div className="flex items-center gap-2.5 overflow-x-auto max-w-full py-1">
            {compareItems.map((item) => {
              const imgUrl = item.images?.[0]?.url || "";
              return (
                <div
                  key={item._id}
                  className="relative group shrink-0 flex items-center gap-2 bg-slate-800/90 border border-slate-700 rounded-xl p-1.5 pr-3"
                >
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-950 shrink-0 relative">
                    {imgUrl ? (
                      <ProductImage
                        src={imgUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-800" />
                    )}
                  </div>
                  <div className="min-w-0 max-w-[100px] sm:max-w-[130px]">
                    <p className="text-[11px] font-bold text-white truncate">{item.title}</p>
                    <p className="text-[10px] font-extrabold text-emerald-400">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCompare(item._id)}
                    className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 rounded-md transition-colors"
                    title="Remove from comparison"
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right Action CTA */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={clearCompare}
              className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-rose-400 px-2.5 py-2 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <Trash2 size={13} />
              <span>Clear</span>
            </button>

            <Link
              href="/compare"
              className="w-full sm:w-auto btn-shiny-primary px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>Compare Now ({count})</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
