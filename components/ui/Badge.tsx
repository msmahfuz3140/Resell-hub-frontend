"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "danger" | "default";
  className?: string;
}

const variantStyles = {
  primary: "badge badge-primary",
  success: "badge badge-success",
  warning: "badge badge-warning",
  danger: "badge",
  default: "badge",
};

const dangerStyle = {
  background: "rgba(239, 68, 68, 0.1)",
  color: "#ef4444",
};

const defaultStyle = {
  background: "var(--bg-tertiary)",
  color: "var(--text-secondary)",
};

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(variantStyles[variant], className)}
      style={
        variant === "danger"
          ? dangerStyle
          : variant === "default"
            ? defaultStyle
            : undefined
      }
    >
      {children}
    </span>
  );
}
