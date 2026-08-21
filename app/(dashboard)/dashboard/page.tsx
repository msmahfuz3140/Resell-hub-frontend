import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - ReSell Hub",
  description: "Manage your listings and account",
};

export default function DashboardPage() {
  return (
    <div className="container" style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1.5rem" }}>
        Dashboard
      </h1>
      <p style={{ color: "var(--text-muted)" }}>
        Dashboard — Phase 4
      </p>
    </div>
  );
}
