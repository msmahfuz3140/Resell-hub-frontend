"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Search,
  ExternalLink,
  ShieldCheck,
  MapPin,
  Calendar,
  AlertCircle,
  Loader2,
  FileText,
  X,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Pagination from "@/components/ui/Pagination";
import { orderService } from "@/services/orderService";
import { formatCurrency, formatDate, timeAgo } from "@/lib/utils";
import type { Order } from "@/types";

const statusConfig: Record<string, { color: string; label: string; icon: typeof CheckCircle2 }> = {
  placed: { color: "text-amber-700 bg-amber-50 border-amber-200", label: "Placed", icon: Clock },
  confirmed: { color: "text-indigo-700 bg-indigo-50 border-indigo-200", label: "Confirmed", icon: CheckCircle2 },
  processing: { color: "text-amber-700 bg-amber-50 border-amber-200", label: "Processing", icon: Clock },
  shipped: { color: "text-blue-700 bg-blue-50 border-blue-200", label: "Shipped", icon: Truck },
  delivered: { color: "text-teal-700 bg-teal-50 border-teal-200", label: "Delivered", icon: CheckCircle2 },
  completed: { color: "text-emerald-700 bg-emerald-50 border-emerald-200", label: "Completed", icon: CheckCircle2 },
  cancelled: { color: "text-rose-700 bg-rose-50 border-rose-200", label: "Cancelled", icon: XCircle },
  disputed: { color: "text-purple-700 bg-purple-50 border-purple-200", label: "Disputed", icon: AlertCircle },
};

// ─── Shipment Tracking Modal ───────────────────────
function TrackingModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const steps = [
    { title: "Order Placed & Escrow Secured", desc: "Payment locked safely in Escrow", done: true, date: order.createdAt },
    { title: "Seller Confirmed", desc: "Seller preparing item for dispatch", done: ["confirmed", "processing", "shipped", "delivered", "completed"].includes(order.orderStatus), date: order.confirmedAt },
    { title: "Handed to Courier", desc: order.trackingNumber ? `Courier tracking: ${order.trackingNumber}` : "In transit with courier", done: ["shipped", "delivered", "completed"].includes(order.orderStatus), date: order.shippedAt },
    { title: "Delivered & Verified", desc: "Package delivered to your doorstep", done: ["delivered", "completed"].includes(order.orderStatus), date: order.deliveredAt },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95">
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition cursor-pointer">
          <X size={16} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Truck size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Live Escrow Shipment Tracking</h3>
            <p className="text-xs text-slate-500 font-mono">Order #{order.orderNumber}</p>
          </div>
        </div>

        {/* Product Snapshot */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 mb-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 relative">
            {order.productSnapshot?.image ? (
              <img src={order.productSnapshot.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <Package size={20} />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-slate-900 truncate">{order.productSnapshot?.title}</h4>
            <p className="text-xs font-black text-indigo-600">{formatCurrency(order.amount)}</p>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 pl-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              <div
                className={`absolute -left-8 top-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs transition-all ${
                  step.done
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                    : "bg-white border-slate-300 text-slate-300"
                }`}
              >
                {step.done ? <CheckCircle2 size={13} /> : idx + 1}
              </div>
              <div>
                <h5 className={`text-xs font-black ${step.done ? "text-slate-900" : "text-slate-400"}`}>{step.title}</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                {step.date && (
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{formatDate(step.date)}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition cursor-pointer"
        >
          Close Tracking
        </button>
      </div>
    </div>
  );
}

function MyOrdersContent() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersMeta, setOrdersMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false });
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [trackingTarget, setTrackingTarget] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getMyOrders({
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchQuery || undefined,
        page,
        limit: 10,
      });
      setOrders(data.data || []);
      setOrdersMeta(data.meta || { page: 1, limit: 10, total: (data.data || []).length, totalPages: 1, hasNextPage: false, hasPrevPage: false });
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
            >
              <ArrowLeft size={15} /> Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Orders & Purchases
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Track all your escrow-protected marketplace orders and receipts in real time.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="self-start sm:self-auto px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <RefreshCw size={13} className={isLoading ? "animate-spin text-indigo-600" : ""} />
            <span>Refresh Ledger</span>
          </button>
        </div>

        {/* Filter & Search Controls */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order # or product title..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full sm:w-auto">
            {["all", "placed", "confirmed", "shipped", "delivered", "completed", "cancelled"].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition cursor-pointer capitalize ${
                  statusFilter === st
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {st === "all" ? "All Orders" : st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">Retrieving your verified purchases...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900">No Orders Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven&apos;t placed any orders matching your filter criteria yet. Explore our verified listings!
            </p>
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md shadow-indigo-200 transition"
            >
              Explore Marketplace
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const config = statusConfig[order.orderStatus] || statusConfig.placed;
              const StatusIcon = config.icon;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 hover:shadow-md hover:border-indigo-200/80 transition-all space-y-4"
                >
                  {/* Card Header: Order Number & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-black text-xs sm:text-sm text-slate-900">
                        #{order.orderNumber}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-medium text-slate-400">
                        {formatDate(order.createdAt)} ({timeAgo(order.createdAt)})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 size={10} /> {order.paymentStatus === "paid" ? "Paid" : order.paymentStatus}
                      </span>

                      <span className={`flex items-center gap-1.5 text-[11px] font-black px-3 py-1 rounded-full border ${config.color}`}>
                        <StatusIcon size={12} />
                        {config.label}
                      </span>
                    </div>
                  </div>

                  {/* Product Details Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 relative">
                        {order.productSnapshot?.image ? (
                          <img
                            src={order.productSnapshot.image}
                            alt={order.productSnapshot.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Package size={24} />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 inline-block">
                          {order.productSnapshot?.category || "Listing"}
                        </span>
                        <h3 className="text-sm font-black text-slate-900 line-clamp-1">
                          {order.productSnapshot?.title}
                        </h3>
                        <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span>Condition: <strong className="text-slate-700">{order.productSnapshot?.condition}</strong></span>
                          <span>•</span>
                          <span>Seller: <strong className="text-slate-700">{order.sellerInfo?.name || "Seller"}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Amount & Actions */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div>
                        <span className="text-lg font-black text-indigo-600 block sm:text-right">
                          {formatCurrency(order.amount)}
                        </span>
                        <span className="text-[10px] text-slate-400 block sm:text-right font-medium">
                          Escrow Protected
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setTrackingTarget(order)}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Truck size={13} />
                          <span>Track</span>
                        </button>

                        <Link
                          href={`/payment/success?orderId=${order._id}`}
                          className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <FileText size={13} />
                          <span>Receipt</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <Pagination
              page={ordersMeta.page}
              totalPages={ordersMeta.totalPages}
              total={ordersMeta.total}
              limit={ordersMeta.limit}
              onPageChange={setPage}
            />
          </div>
        )}

        {/* Tracking Modal */}
        {trackingTarget && (
          <TrackingModal order={trackingTarget} onClose={() => setTrackingTarget(null)} />
        )}
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
