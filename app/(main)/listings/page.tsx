import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Listings - ReSell Hub",
  description: "Browse thousands of second-hand items near you",
};

export default function ListingsPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-secondary)",
        padding: "2rem 0",
      }}
    >
      <div className="container">
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1.5rem" }}>
          Browse Listings
        </h1>
        {/* Product grid will be implemented in Phase 3 */}
        <p style={{ color: "var(--text-muted)" }}>
          Listings page — Phase 3
        </p>
      </div>
    </div>
  );
}
