"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1.5rem",
        background: "var(--bg-secondary)",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          fontSize: "6rem",
          fontWeight: "800",
          background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1,
        }}
      >
        404
      </div>
      <h1 style={{ fontSize: "1.5rem", color: "var(--text-primary)" }}>
        Page Not Found
      </h1>
      <p style={{ color: "var(--text-secondary)", maxWidth: "400px" }}>
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="btn btn-primary">
        Go Back Home
      </Link>
    </div>
  );
}
