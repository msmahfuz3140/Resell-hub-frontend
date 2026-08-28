"use client";

import React, { useState } from "react";
import { ImageOff, Package } from "lucide-react";

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
  iconSize?: number;
  showText?: boolean;
}

export default function ProductImage({
  src,
  alt,
  className = "w-full h-full object-cover",
  containerClassName = "",
  iconSize = 24,
  showText = true,
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-tr from-slate-100 via-indigo-50/30 to-slate-200 flex flex-col items-center justify-center text-slate-400 p-3 select-none ${containerClassName}`}
      >
        <div className="w-10 h-10 rounded-2xl bg-white/80 shadow-xs border border-slate-200/60 flex items-center justify-center text-slate-400 mb-1">
          <ImageOff size={iconSize} className="text-slate-400" />
        </div>
        {showText && (
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 text-center">
            No Image
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
