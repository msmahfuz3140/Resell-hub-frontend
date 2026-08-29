"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ShoppingCart,
  Heart,
  CreditCard,
  User as UserIcon,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  MapPin,
  Eye,
  X,
  Search,
  RotateCcw,
  Star,
  ChevronRight,
  Loader2,
  Trash2,
  Upload,
  ArrowUpRight,
  ShieldCheck,
  Ban,
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, timeAgo } from "@/lib/utils";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Pagination from "@/components/ui/Pagination";
import { orderService } from "@/services/orderService";
import { userService } from "@/services/userService";
import { getLocalFavorites } from "@/lib/favorites";
import type { Order, Product, User } from "@/types";

// ─── Status Badge Styling ──────────────────────────
function orderStatusBadge(status: string) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    placed: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", label: "Order Placed" },
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

// ─── Order Tracking Steps ──────────────────────────
const TRACKING_STEPS = [
  { key: "placed", label: "Placed", icon: Package },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { key: "processing", label: "Processing", icon: Clock },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: MapPin },
];

function getStepIndex(status: string) {
  if (status === "cancelled") return -1;
  const idx = TRACKING_STEPS.findIndex((s) => s.key === status);
  if (status === "completed") return 4;
  return idx >= 0 ? idx : 0;
}

// ─── Track Order Modal ─────────────────────────────
function TrackOrderModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const currentStep = getStepIndex(order.orderStatus);
  const isCancelled = order.orderStatus === "cancelled";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
        >
          <X size={15} />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-black uppercase text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
            Live Tracker
          </span>
          <span className="text-xs font-bold text-slate-400">#{order.orderNumber}</span>
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-6">Order Status Tracking</h2>

        {/* Product Snapshot */}
        <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-200 shrink-0">
            {order.productSnapshot?.image ? (
              <img src={order.productSnapshot.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <Package size={20} />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black text-slate-900 truncate">{order.productSnapshot?.title}</h4>
            <p className="text-[11px] text-slate-500 font-medium">Seller: {order.sellerInfo?.name}</p>
            <p className="text-xs font-black text-indigo-600 mt-0.5">{formatCurrency(order.amount)}</p>
          </div>
        </div>

        {/* Progress Tracker Steps */}
        {isCancelled ? (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-center mb-6">
            <Ban size={24} className="text-rose-500 mx-auto mb-1.5" />
            <h4 className="text-sm font-black text-rose-800">Order Cancelled</h4>
            <p className="text-xs text-rose-600 mt-1">Reason: {order.cancelReason || "Cancelled by user"}</p>
          </div>
        ) : (
          <div className="relative mb-8">
            <div className="flex items-center justify-between relative z-10">
              {TRACKING_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStep;
                const isCurrent = idx === currentStep;
                const StepIcon = step.icon;

                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
                        isCurrent
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110"
                          : isPassed
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <StepIcon size={15} />
                    </div>
                    <span
                      className={`text-[10px] font-bold mt-1.5 ${
                        isCurrent
                          ? "text-indigo-600 font-black"
                          : isPassed
                          ? "text-emerald-700"
                          : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Connecting line */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-100 -z-0">
              <div
                className="h-full bg-emerald-400 transition-all duration-500"
                style={{ width: `${(currentStep / (TRACKING_STEPS.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Shipping details */}
        <div className="space-y-2 text-xs border-t border-slate-100 pt-4">
          <div className="flex justify-between">
            <span className="text-slate-400 font-bold">Delivery To:</span>
            <span className="font-bold text-slate-800 text-right">
              {order.shippingAddress?.street}, {order.shippingAddress?.city}
            </span>
          </div>
          {order.trackingNumber && (
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold">Tracking / Carrier ID:</span>
              <span className="font-mono font-bold text-indigo-600">{order.trackingNumber}</span>
            </div>
          )}
          {order.sellerNote && (
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold">Seller Note:</span>
              <span className="text-slate-600 font-medium">{order.sellerNote}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Cancel Order Modal ────────────────────────────
function CancelOrderModal({
  order,
  onClose,
  onSuccess,
}: {
  order: Order;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [reason, setReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      const data = await orderService.cancelOrder(order._id, reason || "Cancelled by buyer");
      if (data.success) {
        toast.success("Order cancelled successfully.");
        onSuccess();
        onClose();
      } else {
        toast.error(data.message || "Failed to cancel order");
      }
    } catch {
      toast.error("Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-1">Cancel Order?</h2>
        <p className="text-xs text-slate-500 mb-4">
          Are you sure you want to cancel order #{order.orderNumber}? If already paid, the escrow amount will be refunded.
        </p>

        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
            Cancellation Reason
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please tell us why you wish to cancel..."
            rows={3}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 outline-none focus:border-rose-400 focus:bg-white resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
          >
            Keep Order
          </button>
          <button
            onClick={handleCancel}
            disabled={isCancelling}
            className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-lg shadow-rose-200 flex items-center justify-center gap-1.5 disabled:opacity-70"
          >
            {isCancelling ? <><Loader2 size={13} className="animate-spin" /> Cancelling...</> : "Cancel Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Update Tab Component ──────────────────
function ProfileUpdateTab({ user, onUserUpdated }: { user: User | null; onUserUpdated: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [city, setCity] = useState(user?.location?.city || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [photoPreview, setPhotoPreview] = useState<string | null>(user?.photo?.url || null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      if (phone) formData.append("phone", phone.trim());
      if (bio) formData.append("bio", bio.trim());
      formData.append("location", JSON.stringify({ city, country: "Bangladesh" }));
      if (photoFile) formData.append("photo", photoFile);

      const data = await userService.updateProfile(formData);
      if (data.success) {
        toast.success("Profile updated successfully!");
        onUserUpdated();
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
      <h3 className="text-lg font-black text-slate-900 mb-1">Edit Account Profile</h3>
      <p className="text-xs text-slate-500 mb-6">Manage your contact information and public avatar</p>

      <form onSubmit={handleSave} className="space-y-6 max-w-xl">
        {/* Avatar Upload */}
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-[2px] shadow-lg">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-white font-black text-2xl overflow-hidden">
              {photoPreview ? (
                <img src={photoPreview} alt="" className="w-full h-full object-cover" />
              ) : (
                user?.name?.[0]?.toUpperCase()
              )}
            </div>
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold text-xs border border-indigo-100 transition-all"
            >
              <Upload size={13} /> Change Photo
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
            <p className="text-[11px] text-slate-400 mt-1">PNG, JPG or WEBP under 2MB</p>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+880 1700-000000"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Dhaka, Chittagong, Sylhet"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">Bio / Notes</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="A short note about yourself..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="btn-shiny-primary px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 disabled:opacity-70"
        >
          {isSaving ? <><Loader2 size={14} className="animate-spin" /> Saving Changes...</> : <><CheckCircle2 size={15} /> Save Changes</>}
        </button>
      </form>
    </div>
  );
}

// ─── Main Buyer Dashboard ──────────────────────────
export default function BuyerDashboard({ user, onRefreshUser }: { user: User | null; onRefreshUser: () => void }) {
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "payments" | "profile">("orders");

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersMeta, setOrdersMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false });
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderPage, setOrderPage] = useState(1);

  // Modals
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState<Order | null>(null);

  // Wishlist state
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const data = await orderService.getMyOrders({
        status: orderStatusFilter !== "all" ? orderStatusFilter : undefined,
        search: orderSearch || undefined,
        page: orderPage,
        limit: 10,
      });
      setOrders(data.data || []);
      setOrdersMeta(data.meta);
    } catch {
      // Fallback sample orders for demo preview if backend has none
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, [orderStatusFilter, orderSearch, orderPage]);

  // Fetch wishlist
  const fetchWishlist = useCallback(async () => {
    setWishlistLoading(true);
    try {
      const data = await userService.getMyFavorites(1, 12);
      if (data.data && data.data.length > 0) {
        setWishlist(data.data);
        return;
      }
      // Fallback to local storage favorites
      const localFavs = getLocalFavorites();
      setWishlist(localFavs);
    } catch {
      const localFavs = getLocalFavorites();
      setWishlist(localFavs);
    } finally {
      setWishlistLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleFavUpdate = () => {
      fetchWishlist();
    };
    window.addEventListener("resellhub_favorites_updated", handleFavUpdate);
    return () => {
      window.removeEventListener("resellhub_favorites_updated", handleFavUpdate);
    };
  }, [fetchWishlist]);

  useEffect(() => {
    if (activeTab === "orders" || activeTab === "payments") {
      fetchOrders();
    }
    if (activeTab === "wishlist") {
      fetchWishlist();
    }
  }, [activeTab, fetchOrders, fetchWishlist]);

  const totalSpent = orders
    .filter((o) => ["paid", "completed", "delivered", "shipped"].includes(o.orderStatus))
    .reduce((acc, o) => acc + o.amount, 0);

  return (
    <div className="space-y-8">
      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-base sm:text-xl lg:text-2xl font-black text-slate-900 block truncate">{ordersMeta.total}</span>
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 block truncate">Total Orders</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-base sm:text-xl lg:text-2xl font-black text-slate-900 block truncate">{wishlist.length}</span>
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 block truncate">Saved Wishlist</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-base sm:text-xl lg:text-2xl font-black text-slate-900 block truncate" title={formatCurrency(totalSpent)}>
              {formatCurrency(totalSpent)}
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 block truncate">Total Spent</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-base sm:text-xl lg:text-2xl font-black text-slate-900 block truncate">100%</span>
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 block truncate">Escrow Protected</span>
          </div>
        </div>
      </div>

      {/* ── Sub Navigation Tabs ── */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-1 overflow-x-auto scrollbar-none max-w-full">
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-black shrink-0 transition-all whitespace-nowrap ${
            activeTab === "orders" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Package size={14} /> My Orders ({ordersMeta.total})
        </button>
        <button
          onClick={() => setActiveTab("wishlist")}
          className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-black shrink-0 transition-all whitespace-nowrap ${
            activeTab === "wishlist" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Heart size={14} /> Saved Wishlist
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-black shrink-0 transition-all whitespace-nowrap ${
            activeTab === "payments" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <CreditCard size={14} /> Payment History
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-black shrink-0 transition-all whitespace-nowrap ${
            activeTab === "profile" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <UserIcon size={14} /> Profile Settings
        </button>
      </div>

      {/* ── Tab 1: My Orders ── */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {/* Filter / Search bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search orders by item or order number..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              {["all", "placed", "processing", "shipped", "delivered", "cancelled"].map((st) => (
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

          {/* Order List */}
          {ordersLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 animate-pulse flex gap-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-slate-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
              <Package size={36} className="text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-black text-slate-900 mb-1">No Orders Found</h3>
              <p className="text-xs text-slate-500 mb-6">Explore the marketplace and make your first verified purchase.</p>
              <Link href="/listings" className="btn-shiny-primary px-6 py-2.5 rounded-xl text-xs font-bold">
                Browse Marketplace
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const badge = orderStatusBadge(order.orderStatus);
                const canCancel = ["placed", "confirmed", "processing"].includes(order.orderStatus);

                return (
                  <div
                    key={order._id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between shadow-xs hover:border-indigo-200 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
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
                          <span>{formatCurrency(order.amount)}</span>
                          <span>•</span>
                          <span>Seller: {order.sellerInfo?.name}</span>
                          <span>•</span>
                          <span>{timeAgo(order.createdAt)}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => setTrackingOrder(order)}
                        className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold text-xs border border-indigo-100 flex items-center gap-1.5 transition-all"
                      >
                        <Truck size={13} /> Track Status
                      </button>
                      {canCancel && (
                        <button
                          onClick={() => setCancellingOrder(order)}
                          className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs border border-rose-100 transition-all"
                        >
                          Cancel
                        </button>
                      )}
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

      {/* ── Tab 2: Wishlist ── */}
      {activeTab === "wishlist" && (
        <div className="space-y-4">
          {wishlistLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 animate-pulse h-48" />
              ))}
            </div>
          ) : wishlist.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
              <Heart size={36} className="text-rose-300 mx-auto mb-3" />
              <h3 className="text-base font-black text-slate-900 mb-1">Your Wishlist is Empty</h3>
              <p className="text-xs text-slate-500 mb-6">Heart items while browsing to save them for later.</p>
              <Link href="/listings" className="btn-shiny-primary px-6 py-2.5 rounded-xl text-xs font-bold">
                Explore Deals
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlist.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col justify-between shadow-xs hover:border-indigo-200 transition-all group">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <img src={item.images?.[0]?.url || ""} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-indigo-600">{item.category}</span>
                      <h4 className="text-xs font-black text-slate-900 truncate">{item.title}</h4>
                      <p className="text-xs font-black text-slate-800 mt-1">{formatCurrency(item.price)}</p>
                    </div>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400">{item.location?.city}</span>
                    <Link
                      href={`/listings/${item._id}`}
                      className="text-xs font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      View Deal <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Tab 3: Payment History ── */}
      {activeTab === "payments" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-base font-black text-slate-900">Transaction & Escrow Payment History</h3>
            <p className="text-xs text-slate-400 mt-0.5">Summary of all orders and checkout payments</p>
          </div>
          {orders.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-xs font-semibold">
              No payment transactions recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Payment Status</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">#{ord.orderNumber}</td>
                      <td className="py-3.5 px-4 truncate max-w-[180px] font-semibold">{ord.productSnapshot?.title}</td>
                      <td className="py-3.5 px-4 uppercase font-bold text-slate-500">{ord.paymentMethod}</td>
                      <td className="py-3.5 px-4 font-black text-slate-900">{formatCurrency(ord.amount)}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          ord.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {ord.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{new Date(ord.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Tab 4: Profile Settings ── */}
      {activeTab === "profile" && <ProfileUpdateTab user={user} onUserUpdated={onRefreshUser} />}

      {/* Track Modal */}
      {trackingOrder && <TrackOrderModal order={trackingOrder} onClose={() => setTrackingOrder(null)} />}

      {/* Cancel Modal */}
      {cancellingOrder && (
        <CancelOrderModal
          order={cancellingOrder}
          onClose={() => setCancellingOrder(null)}
          onSuccess={fetchOrders}
        />
      )}
    </div>
  );
}
