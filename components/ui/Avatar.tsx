"use client";

import Image from "next/image";
import { getInitials } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: number;
  className?: string;
}

export default function Avatar({ src, name = "U", size = 40, className }: AvatarProps) {
  if (src) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          overflow: "hidden",
          flexShrink: 0,
          position: "relative",
        }}
        className={className}
      >
        <Image
          src={src}
          alt={name}
          fill
          style={{ objectFit: "cover" }}
          sizes={`${size}px`}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: size * 0.38,
        fontWeight: 700,
        flexShrink: 0,
      }}
      className={className}
    >
      {getInitials(name)}
    </div>
  );
}
