"use client";

import { Loader2 } from "lucide-react";

interface SpinnerProps {
  size?: number;
  color?: string;
  fullScreen?: boolean;
}

export default function Spinner({
  size = 24,
  color = "var(--color-primary)",
  fullScreen = false,
}: SpinnerProps) {
  if (fullScreen) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(4px)",
          zIndex: 9999,
        }}
      >
        <Loader2
          size={48}
          style={{ color: "var(--color-primary)", animation: "spin 1s linear infinite" }}
        />
      </div>
    );
  }

  return (
    <Loader2
      size={size}
      style={{ color, animation: "spin 1s linear infinite" }}
    />
  );
}
