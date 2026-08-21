"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ShoppingBag, Package, ShoppingCart, Heart,
  Star, Settings, LogOut, Plus, TrendingUp, Users
} from "lucide-react";
import Link from "next/link";

// ─── Stat Card ────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      className="card"
      style={{
        padding: "1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "14px",
          background: `${color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)" }}>
          {value}
        </div>
        <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          {label}
        </div>
      </div>
    </div>
  );
}

// ─── Quick Action ─────────────────────────────────
function QuickAction({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="card"
      style={{
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.625rem",
        textDecoration: "none",
        textAlign: "center",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #4f46e5, #6366f1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: "white" }}>{icon}</span>
      </div>
      <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>
        {label}
      </span>
    </Link>
  );
}

// ─── Dashboard Content ────────────────────────────
function DashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    router.push("/");
  };

  const isSeller = user?.role === "seller" || user?.role === "admin";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-secondary)" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
          padding: "2rem 0",
          marginBottom: "2rem",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                Welcome back,
              </p>
              <h1 style={{ color: "white", fontSize: "1.75rem", fontWeight: 800 }}>
                {user?.name} 👋
              </h1>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "9999px",
                  padding: "0.25rem 0.75rem",
                  marginTop: "0.5rem",
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.75rem", fontWeight: 600, textTransform: "capitalize" }}>
                  {user?.role}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "white",
                padding: "0.625rem 1.25rem",
                borderRadius: "0.75rem",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.875rem",
              }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <StatCard icon={<ShoppingCart size={24} />} label="My Orders" value="0" color="#4f46e5" />
          <StatCard icon={<Heart size={24} />} label="Favorites" value="0" color="#ef4444" />
          {isSeller && (
            <>
              <StatCard icon={<Package size={24} />} label="My Listings" value="0" color="#10b981" />
              <StatCard icon={<TrendingUp size={24} />} label="Total Sales" value="৳0" color="#f59e0b" />
            </>
          )}
          <StatCard icon={<Star size={24} />} label="Rating" value={`${user?.rating?.average ?? 0}/5`} color="#f59e0b" />
        </div>

        {/* Quick Actions */}
        <div
          className="card"
          style={{ padding: "1.5rem", marginBottom: "2rem" }}
        >
          <h2 style={{ fontWeight: 700, marginBottom: "1.25rem", fontSize: "1.125rem" }}>
            Quick Actions
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
              gap: "0.875rem",
            }}
          >
            <QuickAction href="/listings" icon={<ShoppingBag size={22} />} label="Browse" />
            <QuickAction href="/my-orders" icon={<ShoppingCart size={22} />} label="My Orders" />
            <QuickAction href="/profile" icon={<Users size={22} />} label="Profile" />
            <QuickAction href="/settings" icon={<Settings size={22} />} label="Settings" />
            {isSeller && (
              <>
                <QuickAction href="/add-product" icon={<Plus size={22} />} label="Add Listing" />
                <QuickAction href="/my-products" icon={<Package size={22} />} label="My Listings" />
              </>
            )}
          </div>
        </div>

        {/* Account Info */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <h2 style={{ fontWeight: 700, marginBottom: "1.25rem", fontSize: "1.125rem" }}>
            Account Details
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {[
              { label: "Name", value: user?.name },
              { label: "Email", value: user?.email },
              { label: "Role", value: user?.role?.toUpperCase() },
              { label: "Status", value: user?.status?.toUpperCase() },
              { label: "Member Since", value: new Date(user?.createdAt || "").toLocaleDateString("en-BD") },
              { label: "Provider", value: user?.provider?.toUpperCase() },
            ].map(({ label, value }) => (
              <div key={label} style={{ padding: "0.875rem", background: "var(--bg-secondary)", borderRadius: "0.75rem" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>
                  {label}
                </div>
                <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9375rem" }}>
                  {value || "—"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
