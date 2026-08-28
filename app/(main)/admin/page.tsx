"use client";

import React from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Shield } from "lucide-react";

function AdminPageContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white hover:bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl shadow-xs transition-all"
          >
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-full font-black">
            <Shield size={14} />
            <span>Admin Control Panel • {user?.name || "Administrator"}</span>
          </div>
        </div>

        {/* Admin Dashboard */}
        <AdminDashboard />
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminPageContent />
    </ProtectedRoute>
  );
}
