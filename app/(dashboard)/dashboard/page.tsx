"use client";

import React from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

function DashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success("Successfully logged out.");
    router.push("/");
  };

  const isSeller = user?.role === "seller" || user?.role === "admin";

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Banner with Ambient Gradient */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-10 rounded-3xl shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-[2px] shadow-lg">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-xl text-white overflow-hidden">
                  {user?.photo?.url ? (
                    <img src={user.photo.url} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.[0]?.toUpperCase()
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                    {user?.name}
                  </h1>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {user?.role}
                  </span>
                </div>
                <p className="text-xs text-indigo-200 mt-1 flex items-center gap-2">
                  <span>{user?.email}</span>
                  <span>•</span>
                  <span>Member since {new Date(user?.createdAt || "").getFullYear() || 2024}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isSeller && (
                <Link
                  href="/add-product"
                  className="btn-shiny-amber px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
                >
                  <PlusCircle size={16} />
                  <span>Post New Ad</span>
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-rose-500/20 text-white hover:text-rose-300 border border-white/15 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Metric Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black shrink-0">
              <ShoppingCart size={24} />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 block">0 Orders</span>
              <span className="text-xs font-bold text-slate-400">Total Purchases</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black shrink-0">
              <Heart size={24} />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 block">0 Saved</span>
              <span className="text-xs font-bold text-slate-400">Wishlist Items</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black shrink-0">
              <Package size={24} />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 block">0 Ads</span>
              <span className="text-xs font-bold text-slate-400">Active Listings</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black shrink-0">
              <Star size={24} />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 block">5.0 / 5</span>
              <span className="text-xs font-bold text-slate-400">Trust Score</span>
            </div>
          </div>
        </div>

        {/* ── Quick Actions Grid ── */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm mb-8 space-y-6">
          <h2 className="text-lg font-black text-slate-900">
            Quick Actions & Shortcuts
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              href="/listings"
              className="p-5 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 text-center transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-white text-slate-700 group-hover:text-indigo-600 flex items-center justify-center mx-auto mb-2 shadow-xs">
                <ShoppingBag size={20} />
              </div>
              <span className="text-xs font-black text-slate-800 group-hover:text-indigo-600">
                Browse Marketplace
              </span>
            </Link>

            <Link
              href="/my-orders"
              className="p-5 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 text-center transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-white text-slate-700 group-hover:text-indigo-600 flex items-center justify-center mx-auto mb-2 shadow-xs">
                <ShoppingCart size={20} />
              </div>
              <span className="text-xs font-black text-slate-800 group-hover:text-indigo-600">
                My Purchases
              </span>
            </Link>

            <Link
              href="/profile"
              className="p-5 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 text-center transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-white text-slate-700 group-hover:text-indigo-600 flex items-center justify-center mx-auto mb-2 shadow-xs">
                <UserIcon size={20} />
              </div>
              <span className="text-xs font-black text-slate-800 group-hover:text-indigo-600">
                Account Settings
              </span>
            </Link>

            <Link
              href="/add-product"
              className="p-5 rounded-2xl bg-amber-50/60 hover:bg-amber-100/60 border border-amber-100 hover:border-amber-200 text-center transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-white text-amber-600 flex items-center justify-center mx-auto mb-2 shadow-xs">
                <PlusCircle size={20} />
              </div>
              <span className="text-xs font-black text-amber-900">
                Post an Ad Free
              </span>
            </Link>
          </div>
        </div>
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
