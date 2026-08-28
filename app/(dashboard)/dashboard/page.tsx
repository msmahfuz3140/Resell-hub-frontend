"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Package,
  ShoppingCart,
  Heart,
  Star,
  Settings,
  LogOut,
  PlusCircle,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  Clock,
  CheckCircle2,
  DollarSign,
  User as UserIcon,
  Shield,
  Layers,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import BuyerDashboard from "@/components/dashboard/BuyerDashboard";
import SellerDashboard from "@/components/dashboard/SellerDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

function DashboardContent() {
  const { user, logout, refreshUser } = useAuth();
  const router = useRouter();

  // Role detection
  const isSeller = user?.role === "seller" || user?.role === "admin";
  const isAdmin = user?.role === "admin";

  // Active View mode (defaults to user's highest role)
  const [activeRoleView, setActiveRoleView] = useState<"buyer" | "seller" | "admin">("buyer");

  useEffect(() => {
    if (user?.role === "admin") {
      setActiveRoleView("admin");
    } else if (user?.role === "seller") {
      setActiveRoleView("seller");
    } else {
      setActiveRoleView("buyer");
    }
  }, [user?.role]);

  const handleLogout = async () => {
    await logout();
    toast.success("Successfully logged out.");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Breadcrumb / Back to Home ── */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 bg-white hover:bg-indigo-50 border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-xs transition-all"
          >
            <span>← Back to Home</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Link href="/" className="hover:text-slate-700">Home</Link>
            <span>/</span>
            <span className="text-slate-700 font-bold">Dashboard</span>
          </div>
        </div>

        {/* ── Top Header Banner with Ambient Dark Glow ── */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white p-6 sm:p-10 rounded-3xl shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-10 left-1/3 w-64 h-64 bg-cyan-500/15 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* Avatar Frame */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-[2px] shadow-lg shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-2xl text-white overflow-hidden">
                  {user?.photo?.url ? (
                    <img src={user.photo.url} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.[0]?.toUpperCase()
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{user?.name}</h1>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                      user?.role === "admin"
                        ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                        : user?.role === "seller"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-blue-500/20 text-blue-300 border-blue-500/40"
                    }`}
                  >
                    {user?.role} Portal
                  </span>
                </div>
                <p className="text-xs text-indigo-200/80 mt-1 flex items-center gap-2 flex-wrap">
                  <span>{user?.email}</span>
                  <span>•</span>
                  <span>Member since {new Date(user?.createdAt || "").getFullYear() || 2024}</span>
                </p>
              </div>
            </div>

            {/* Top Right Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <Link
                href="/"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span>🏠 Home</span>
              </Link>
              <Link
                href="/listings"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <ShoppingBag size={14} />
                <span>Marketplace</span>
              </Link>
              {isSeller && (
                <Link
                  href="/add-product"
                  className="btn-shiny-amber px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
                >
                  <PlusCircle size={15} />
                  <span>Post Ad</span>
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Role Switcher Pill Bar (For Admin & Multi-role Users) ── */}
        {(isAdmin || isSeller) && (
          <div className="mb-8 bg-white p-2 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 px-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Dashboard Mode:
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              {isAdmin && (
                <button
                  onClick={() => setActiveRoleView("admin")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black transition-all ${
                    activeRoleView === "admin"
                      ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Shield size={14} /> Admin Overview
                </button>
              )}

              {isSeller && (
                <button
                  onClick={() => setActiveRoleView("seller")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black transition-all ${
                    activeRoleView === "seller"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <TrendingUp size={14} /> Seller Dashboard
                </button>
              )}

              <button
                onClick={() => setActiveRoleView("buyer")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black transition-all ${
                  activeRoleView === "buyer"
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ShoppingCart size={14} /> Buyer Dashboard
              </button>
            </div>
          </div>
        )}

        {/* ── Active Dashboard View ── */}
        {activeRoleView === "admin" && isAdmin && <AdminDashboard />}
        {activeRoleView === "seller" && isSeller && <SellerDashboard user={user} />}
        {activeRoleView === "buyer" && <BuyerDashboard user={user} onRefreshUser={refreshUser} />}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
