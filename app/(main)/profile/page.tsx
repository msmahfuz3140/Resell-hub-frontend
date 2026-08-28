"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, User, Camera, Star, MapPin, Calendar, Package, ShoppingCart, ShieldCheck, Edit3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { formatCurrency } from "@/lib/utils";

function ProfileContent() {
  const { user } = useAuth();

  const stats = [
    { label: "Total Sales", value: user?.totalSales || 0, icon: Package },
    { label: "Purchases", value: user?.totalPurchases || 0, icon: ShoppingCart },
    { label: "Rating", value: typeof user?.rating === "number" ? user.rating : user?.rating?.average || 5.0, icon: Star },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Dashboard
        </Link>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-xl">
                <div className="w-full h-full rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-3xl font-black overflow-hidden">
                  {user?.photo?.url ? (
                    <img src={user.photo.url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.[0]?.toUpperCase() || "U"
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="pt-16 px-8 pb-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-black text-slate-900">{user?.name}</h1>
                <p className="text-sm text-slate-500">{user?.email}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                    {user?.role}
                  </span>
                  {user?.isVerified && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                      <ShieldCheck size={11} /> Verified
                    </span>
                  )}
                  {user?.location?.city && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                      <MapPin size={11} /> {user.location.city}
                    </span>
                  )}
                </div>
              </div>
              <Link
                href="/settings"
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                <Edit3 size={13} /> Edit Profile
              </Link>
            </div>

            {user?.bio && (
              <p className="text-sm text-slate-600 leading-relaxed">{user.bio}</p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-slate-50 rounded-2xl border border-slate-100 p-4 text-center">
                  <s.icon size={18} className="mx-auto text-indigo-600 mb-1.5" />
                  <span className="text-xl font-black text-slate-900 block">{s.value}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Member Since */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 pt-4 border-t border-slate-100">
              <Calendar size={13} />
              Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
