"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Package,
  TrendingUp,
  DollarSign,
  Clock,
  PlusCircle,
  Search,
  X,
  Truck,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit3,
  Trash2,
  Loader2,
  ChevronRight,
  Filter,
  Star,
  Users,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, timeAgo } from "@/lib/utils";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Pagination from "@/components/ui/Pagination";
import { UserGrowthChart, MonthlyOrderChart, CategoryChart } from "./AnalyticsCharts";
import { orderService } from "@/services/orderService";
import { productService } from "@/services/productService";
import type { Order, Product, User } from "@/types";

// ─── Status Badge Styling ──────────────────────────
function orderStatusBadge(status: string) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    placed: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", label: "New Placed" },
    confirmed: { bg: "bg-indigo-50 border-indigo-200", text: "text-indigo-700", label: "Confirmed" },
    processing: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", label: "Processing" },
    shipped: { bg: "bg-purple-50 border-purple-200", text: "text-purple-700", label: "Shipped" },
    delivered: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", label: "Delivered" },
    completed: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", label: "Completed" },
    cancelled: { bg: "bg-rose-50 border-rose-200", text: "text-rose-700", label: "Cancelled" },
    disputed: { bg: "bg-orange-50 border-orange-200", text: "text-orange-700", label: "Disputed" },
  };
  return map[status] || { bg: "bg-slate-100 border-slate-200", text: "text-slate-700", label: status };
}

// ─── Update Order Status Modal (Fulfillment) ───────
function UpdateFulfillmentModal({
  order,
  onClose,
  onSuccess,
}: {
  order: Order;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [status, setStatus] = useState(order.orderStatus);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
  const [sellerNote, setSellerNote] = useState(order.sellerNote || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const data = await orderService.updateOrderStatus(order._id, {
        status,
        trackingNumber: trackingNumber.trim() || undefined,
        sellerNote: sellerNote.trim() || undefined,
      });
      if (data.success) {
        toast.success("Order fulfillment updated!");
        onSuccess();
        onClose();
      } else {
        toast.error(data.message || "Failed to update order");
      }
    } catch {
      toast.error("Failed to update order");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
        >
          <X size={15} />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-black uppercase text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
            Fulfillment
          </span>
          <span className="text-xs font-bold text-slate-400">#{order.orderNumber}</span>
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-6">Update Order Status</h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              Fulfillment Step
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Order["orderStatus"])}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-500"
            >
              <option value="placed">Placed (Pending confirmation)</option>
              <option value="confirmed">Confirmed (Accepted by seller)</option>
              <option value="processing">Processing & Packaging</option>
              <option value="shipped">Shipped (Handed to courier)</option>
              <option value="delivered">Delivered to buyer</option>
              <option value="completed">Completed & Released</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              Carrier / Tracking Number
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. STEADFAST-108293, REDX-4912"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              Seller Note to Buyer
            </label>
            <textarea
              value={sellerNote}
              onChange={(e) => setSellerNote(e.target.value)}
              placeholder="e.g. Package dispatched via courier, will arrive in 2 days."
              rows={3}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="flex-1 btn-shiny-primary py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 disabled:opacity-70"
          >
            {isUpdating ? <><Loader2 size={13} className="animate-spin" /> Saving...</> : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Seller Dashboard ─────────────────────────
export default function SellerDashboard({ user }: { user: User | null }) {
  const [activeTab, setActiveTab] = useState<"analytics" | "orders" | "products">("analytics");

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersMeta, setOrdersMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false });
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderPage, setOrderPage] = useState(1);
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState<Order | null>(null);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [productsMeta, setProductsMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false });
  const [productsLoading, setProductsLoading] = useState(true);
  const [productPage, setProductPage] = useState(1);
  const [deleteProductTarget, setDeleteProductTarget] = useState<Product | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);

  // Fetch seller orders
  const fetchSellerOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const data = await orderService.getSellerOrders({
        status: orderStatusFilter !== "all" ? orderStatusFilter : undefined,
        search: orderSearch || undefined,
        page: orderPage,
        limit: 10,
      });
      setOrders(data.data || []);
      setOrdersMeta(data.meta);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, [orderStatusFilter, orderSearch, orderPage]);

  // Fetch seller products
  const fetchSellerProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const data = await productService.getMyProducts({ page: productPage, limit: 10 });
      setProducts(data.data || []);
      setProductsMeta(data.meta);
    } catch {
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  }, [productPage]);

  useEffect(() => {
    fetchSellerOrders();
    fetchSellerProducts();
  }, [fetchSellerOrders, fetchSellerProducts]);

  const handleDeleteProduct = async () => {
    if (!deleteProductTarget) return;
    setIsDeletingProduct(true);
    try {
      const data = await productService.deleteProduct(deleteProductTarget._id);
      if (data.success) {
        toast.success("Product deleted successfully");
        setDeleteProductTarget(null);
        fetchSellerProducts();
      } else {
        toast.error(data.message || "Failed to delete product");
      }
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setIsDeletingProduct(false);
    }
  };

  const activePaidOrders = orders.filter(
    (o) =>
      (o.paymentStatus === "paid" || ["completed", "delivered", "shipped"].includes(o.orderStatus)) &&
      o.orderStatus !== "cancelled" &&
      o.paymentStatus !== "refunded"
  );
  const pendingOrdersCount = orders.filter(
    (o) => ["placed", "confirmed", "processing"].includes(o.orderStatus) && o.paymentStatus !== "refunded"
  ).length;
  const totalRevenue = activePaidOrders.reduce(
    (acc, o) => acc + (o.sellerAmount || o.amount * 0.95),
    0
  );
  const totalSalesCount = activePaidOrders.length;

  // Analytics chart mock series based on seller stats
  const sampleOrderTrend = [
    { month: "Mar", orders: 4, revenue: 14000 },
    { month: "Apr", orders: 7, revenue: 26000 },
    { month: "May", orders: 9, revenue: 38000 },
    { month: "Jun", orders: 12, revenue: 54000 },
    { month: "Jul", orders: 16, revenue: 68000 },
    { month: "Aug", orders: Math.max(ordersMeta.total, 8), revenue: Math.max(totalRevenue, 45000) },
  ];

  const categoryShare = [
    { _id: "Electronics", count: 18 },
    { _id: "Vehicles", count: 6 },
    { _id: "Furniture", count: 5 },
    { _id: "Clothing", count: 4 },
  ];

  return (
    <div className="space-y-8">
      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-base sm:text-xl lg:text-2xl font-black text-slate-900 block truncate">{productsMeta.total}</span>
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 block truncate">Listed Products</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-base sm:text-xl lg:text-2xl font-black text-slate-900 block truncate">{totalSalesCount || ordersMeta.total}</span>
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 block truncate">Active Sales</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-base sm:text-xl lg:text-2xl font-black text-slate-900 block truncate" title={formatCurrency(totalRevenue)}>
              {formatCurrency(totalRevenue)}
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 block truncate">Net Earnings</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-base sm:text-xl lg:text-2xl font-black text-slate-900 block truncate">{pendingOrdersCount}</span>
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 block truncate">Pending Orders</span>
          </div>
        </div>
      </div>

      {/* ── Sub Navigation Tabs & Post Ad Action ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-1 overflow-x-auto scrollbar-none max-w-full">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-black shrink-0 transition-all whitespace-nowrap ${
              activeTab === "analytics" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <TrendingUp size={14} /> Analytics & Revenue
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-black shrink-0 transition-all whitespace-nowrap ${
              activeTab === "orders" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Truck size={14} /> Manage Orders ({ordersMeta.total})
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-black shrink-0 transition-all whitespace-nowrap ${
              activeTab === "products" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Package size={14} /> Inventory ({productsMeta.total})
          </button>
          <Link
            href="/messages"
            className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-black shrink-0 text-slate-600 hover:bg-slate-100 transition-all whitespace-nowrap"
          >
            <MessageSquare size={14} /> Inbox / Messages
          </Link>
        </div>

        <Link
          href="/add-product"
          className="btn-shiny-amber px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md self-start sm:self-auto"
        >
          <PlusCircle size={15} /> Add New Product
        </Link>
      </div>

      {/* ── Tab 1: Analytics ── */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <MonthlyOrderChart data={sampleOrderTrend} />
            </div>
            <div className="lg:col-span-5">
              <CategoryChart data={categoryShare} />
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 2: Manage Orders ── */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search orders by buyer name or order number..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              {["all", "placed", "processing", "shipped", "delivered", "completed"].map((st) => (
                <button
                  key={st}
                  onClick={() => { setOrderStatusFilter(st); setOrderPage(1); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                    orderStatusFilter === st ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {ordersLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 animate-pulse h-24" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
              <Truck size={36} className="text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-black text-slate-900 mb-1">No Orders Yet</h3>
              <p className="text-xs text-slate-500">When buyers purchase your products, orders will appear here for fulfillment.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const badge = orderStatusBadge(order.orderStatus);

                return (
                  <div
                    key={order._id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between shadow-xs hover:border-indigo-200 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                        {order.productSnapshot?.image ? (
                          <img src={order.productSnapshot.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Package size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${badge.bg} ${badge.text}`}>
                            {badge.label}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 font-bold">#{order.orderNumber}</span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900">{order.productSnapshot?.title}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-2">
                          <span>Buyer: {order.buyerInfo?.name}</span>
                          <span>•</span>
                          <span className="font-bold text-slate-900">{formatCurrency(order.sellerAmount || order.amount * 0.95)} Net</span>
                          <span>•</span>
                          <span>{timeAgo(order.createdAt)}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => setSelectedOrderForStatus(order)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md transition-all"
                      >
                        <CheckCircle2 size={13} /> Update Status
                      </button>
                    </div>
                  </div>
                );
              })}

              <Pagination
                page={ordersMeta.page}
                totalPages={ordersMeta.totalPages}
                total={ordersMeta.total}
                limit={ordersMeta.limit}
                onPageChange={setOrderPage}
              />
            </div>
          )}
        </div>
      )}

      {/* ── Tab 3: Inventory ── */}
      {activeTab === "products" && (
        <div className="space-y-4">
          {productsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 animate-pulse h-24" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
              <Package size={36} className="text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-black text-slate-900 mb-1">No Listed Products</h3>
              <p className="text-xs text-slate-500 mb-6">List an item for sale in under 2 minutes.</p>
              <Link href="/add-product" className="btn-shiny-amber px-6 py-2.5 rounded-xl text-xs font-bold">
                Post an Ad
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between shadow-xs hover:border-indigo-200 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                      <img src={p.images?.[0]?.url || ""} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          p.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}>
                          {p.status}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          {p.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 truncate max-w-sm">{p.title}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-2">
                        <span className="font-bold text-slate-900">{formatCurrency(p.price)}</span>
                        <span>•</span>
                        <span>Stock: {p.stock ?? 1}</span>
                        <span>•</span>
                        <span>{p.views || 0} views</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Link
                      href={`/listings/${p._id}`}
                      className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all"
                      title="View"
                    >
                      <Eye size={14} />
                    </Link>
                    <Link
                      href="/my-products"
                      className="w-8 h-8 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-all"
                      title="Edit in Manager"
                    >
                      <Edit3 size={14} />
                    </Link>
                    <button
                      onClick={() => setDeleteProductTarget(p)}
                      className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-all"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              <Pagination
                page={productsMeta.page}
                totalPages={productsMeta.totalPages}
                total={productsMeta.total}
                limit={productsMeta.limit}
                onPageChange={setProductPage}
              />
            </div>
          )}
        </div>
      )}

      {/* Fulfillment Modal */}
      {selectedOrderForStatus && (
        <UpdateFulfillmentModal
          order={selectedOrderForStatus}
          onClose={() => setSelectedOrderForStatus(null)}
          onSuccess={fetchSellerOrders}
        />
      )}

      {/* Delete Product Confirmation */}
      <ConfirmModal
        isOpen={!!deleteProductTarget}
        title="Delete Listing?"
        message={`Are you sure you want to delete "${deleteProductTarget?.title}"?`}
        confirmLabel="Delete"
        variant="danger"
        isLoading={isDeletingProduct}
        onConfirm={handleDeleteProduct}
        onCancel={() => setDeleteProductTarget(null)}
      />
    </div>
  );
}
