"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Copy,
  Check,
  Package,
  Calendar,
  CreditCard,
  Truck,
  ArrowRight,
  ShieldCheck,
  Download,
  ShoppingBag,
  ExternalLink,
  MapPin,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/utils";
import { paymentService } from "@/services/paymentService";
import { orderService } from "@/services/orderService";
import type { Order, Payment } from "@/types";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedTxn, setCopiedTxn] = useState(false);

  useEffect(() => {
    if (!orderId) {
      toast.error("No order ID provided.");
      router.push("/dashboard");
      return;
    }

    const fetchReceipt = async () => {
      try {
        setIsLoading(true);
        // Fetch payment and order details
        try {
          const res = await paymentService.getPaymentByOrder(orderId);
          if (res?.data) {
            setPayment(res.data.payment);
            setOrder(res.data.order);
            return;
          }
        } catch {
          // Fallback to order service
          const orderRes = await orderService.getOrderById(orderId);
          if (orderRes?.data?.order) {
            setOrder(orderRes.data.order);
          }
        }
      } catch (err) {
        console.error("Error fetching receipt:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceipt();
  }, [orderId, router]);

  const copyTransactionId = (txnId: string) => {
    navigator.clipboard.writeText(txnId);
    setCopiedTxn(true);
    toast.success("Transaction ID copied to clipboard!");
    setTimeout(() => setCopiedTxn(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-sm font-bold text-slate-500">Generating your official payment receipt...</p>
      </div>
    );
  }

  const transactionId = payment?.transactionId || `TXN-${order?.orderNumber || "RSH-9842"}`;
  const amountPaid = payment?.amount || order?.amount || 0;
  const paymentDate = payment?.paymentDate || order?.confirmedAt || order?.createdAt || new Date().toISOString();

  return (
    <div className="min-h-screen bg-slate-50/60 py-8 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* ── Success Celebration Card ── */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden mb-8">
          {/* Header Ambient Glow */}
          <div className="bg-linear-to-br from-emerald-600 via-teal-600 to-indigo-700 p-8 sm:p-10 text-white text-center relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-10 -top-10 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

            <div className="w-20 h-20 bg-white rounded-3xl shadow-xl mx-auto flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Payment Successful
            </span>

            <h1 className="text-2xl sm:text-4xl font-black mb-2 tracking-tight">
              Order Confirmed & Protected!
            </h1>
            <p className="text-sm text-emerald-50 max-w-md mx-auto font-medium">
              Thank you! Your payment is safely held in ReSell Hub Escrow. The seller has been notified to dispatch your item.
            </p>
          </div>

          {/* Receipt Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Key Payment Meta Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Amount Paid
                </span>
                <span className="text-xl font-black text-slate-900 block mt-0.5">
                  {formatCurrency(amountPaid)}
                </span>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Paid via Stripe
                </span>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Payment Date
                </span>
                <span className="text-sm font-bold text-slate-900 block mt-1">
                  {formatDate(paymentDate)}
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">
                  Status: Completed
                </span>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Transaction ID
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs font-mono font-bold text-indigo-600 truncate max-w-[130px]">
                    {transactionId}
                  </span>
                  <button
                    onClick={() => copyTransactionId(transactionId)}
                    className="p-1 text-slate-400 hover:text-indigo-600 rounded-md transition cursor-pointer"
                    title="Copy Transaction ID"
                  >
                    {copiedTxn ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">
                  Order #{order?.orderNumber || "N/A"}
                </span>
              </div>
            </div>

            {/* Product Summary */}
            {order?.productSnapshot && (
              <div className="border border-slate-200/80 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden relative shrink-0 border border-slate-200">
                  {order.productSnapshot.image ? (
                    <img
                      src={order.productSnapshot.image}
                      alt={order.productSnapshot.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 inline-block mb-1">
                    {order.productSnapshot.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {order.productSnapshot.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                    <span>Condition: <strong className="text-slate-700">{order.productSnapshot.condition}</strong></span>
                    <span>•</span>
                    <span>Seller: <strong className="text-slate-700">{order.sellerInfo?.name || "Verified Seller"}</strong></span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-black text-slate-900 block">
                    {formatCurrency(order.amount)}
                  </span>
                </div>
              </div>
            )}

            {/* Delivery Address & Escrow Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <span>Delivery Destination</span>
                </div>
                <div className="text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-900 block font-bold">
                    {order?.shippingAddress?.fullName || order?.buyerInfo?.name}
                  </strong>
                  <div>{order?.shippingAddress?.street || "Standard Address"}</div>
                  <div>
                    {order?.shippingAddress?.city || "Dhaka"}, Bangladesh {order?.shippingAddress?.postalCode}
                  </div>
                  <div className="text-slate-400 mt-1 font-mono">
                    {order?.shippingAddress?.phone || order?.buyerInfo?.phone}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-900">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Next Steps (Escrow Protected)</span>
                </div>
                <ol className="text-xs text-slate-600 space-y-1.5 list-decimal list-inside leading-relaxed">
                  <li>Seller fulfills and ships your item.</li>
                  <li>Live tracking updates on your dashboard.</li>
                  <li>Inspect upon delivery & confirm release.</li>
                </ol>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={handlePrint}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download / Print Receipt
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/listings"
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-slate-700 hover:bg-slate-50 transition text-center"
                >
                  Explore More
                </Link>
                <Link
                  href="/my-orders"
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  <span>View in My Orders</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
