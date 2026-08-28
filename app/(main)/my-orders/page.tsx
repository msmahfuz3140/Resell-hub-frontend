"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Package, Clock, CheckCircle2, XCircle, Truck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const DEMO_ORDERS = [
  { id: "ORD-2401", title: "iPhone 15 Pro", price: 94000, status: "delivered", date: "2 days ago", image: "📱" },
  { id: "ORD-2398", title: "Sony WH-1000XM5", price: 28500, status: "shipped", date: "5 days ago", image: "🎧" },
  { id: "ORD-2395", title: "MacBook Air M2", price: 108000, status: "processing", date: "1 week ago", image: "💻" },
  { id: "ORD-2390", title: "Canon EOS R50", price: 62000, status: "completed", date: "2 weeks ago", image: "📷" },
];

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle2 }> = {
  processing: { color: "text-amber-600 bg-amber-50 border-amber-200", icon: Clock },
  shipped: { color: "text-blue-600 bg-blue-50 border-blue-200", icon: Truck },
  delivered: { color: "text-emerald-600 bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
  completed: { color: "text-slate-600 bg-slate-50 border-slate-200", icon: CheckCircle2 },
  cancelled: { color: "text-rose-600 bg-rose-50 border-rose-200", icon: XCircle },
};

function MyOrdersContent() {
  const { user } = useAuth();

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 mb-4 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Orders</h1>
            <p className="text-sm text-slate-500 mt-1">{DEMO_ORDERS.length} orders found</p>
          </div>
        </div>

        <div className="space-y-4">
          {DEMO_ORDERS.map((order) => {
            const config = statusConfig[order.status] || statusConfig.processing;
            const StatusIcon = config.icon;
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-indigo-200/60 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">
                      {order.image}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold text-slate-400">#{order.id}</span>
                        <span className="text-[10px] text-slate-400">•</span>
                        <span className="text-[10px] font-medium text-slate-400">{order.date}</span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900">{order.title}</h3>
                      <p className="text-sm font-black text-indigo-600 mt-0.5">৳ {order.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border ${config.color}`}>
                      <StatusIcon size={12} />
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function MyOrdersPage() {
  return (
    <ProtectedRoute>
      <MyOrdersContent />
    </ProtectedRoute>
  );
}
