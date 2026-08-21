"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  action?: { href: string; label: string };
  className?: string;
}

export default function SectionHeader({
  label,
  title,
  subtitle,
  align = "left",
  action,
  className,
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className={cn(
        "mb-10",
        centered ? "text-center max-w-2xl mx-auto" : "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4",
        className
      )}
    >
      <div className={centered ? "" : "space-y-2"}>
        {label && (
          <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-[0.14em] text-brand bg-brand/8 px-3.5 py-1.5 rounded-full border border-brand/15">
            {label}
          </span>
        )}
        <h2
          className={cn(
            "text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal tracking-tight leading-tight",
            label && "mt-2"
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p className={cn("text-[#717171] text-sm sm:text-base leading-relaxed", centered ? "mt-3" : "max-w-xl mt-1")}>
            {subtitle}
          </p>
        )}
      </div>

      {action && !centered && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-1 text-sm font-bold text-brand hover:text-brand-dark transition-colors group shrink-0"
        >
          {action.label}
          <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </motion.div>
  );
}
