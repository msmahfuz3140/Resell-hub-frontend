import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Top Header Placeholder Spacer */}
      <div className="h-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero / Banner Skeleton */}
        <div className="w-full h-56 sm:h-72 rounded-3xl bg-slate-200/70 dark:bg-slate-800/60 animate-pulse mb-8 sm:mb-12 relative overflow-hidden flex flex-col justify-end p-6 sm:p-10">
          <div className="w-36 h-6 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse mb-3" />
          <div className="w-3/4 max-w-md h-10 rounded-2xl bg-slate-300 dark:bg-slate-700 animate-pulse mb-4" />
          <div className="w-1/2 max-w-sm h-4 rounded-lg bg-slate-300 dark:bg-slate-700 animate-pulse" />
        </div>

        {/* Filter Pills Skeleton */}
        <div className="flex items-center gap-2 mb-8 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-28 rounded-xl bg-slate-200/80 dark:bg-slate-800 animate-pulse shrink-0"
            />
          ))}
        </div>

        {/* Product Cards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Image Placeholder */}
                <div className="w-full aspect-[4/3] rounded-2xl bg-slate-200/80 dark:bg-slate-800 animate-pulse mb-4" />
                {/* Category & Badge */}
                <div className="flex justify-between items-center mb-2.5">
                  <div className="w-20 h-4 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="w-14 h-4 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
                </div>
                {/* Title */}
                <div className="w-full h-5 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse mb-2" />
                <div className="w-2/3 h-5 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse mb-3" />
              </div>
              {/* Footer / Price */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div className="w-24 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
