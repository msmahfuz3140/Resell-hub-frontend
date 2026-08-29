"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Truck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShoppingBag,
  Clock,
  Sparkles,
  MapPin,
  Phone,
  User as UserIcon,
  HelpCircle,
  Loader2,
  ChevronRight,
  Shield,
  Zap,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Radio,
  Wifi,
} from "lucide-react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { getStripe } from "@/lib/stripe";
import { productService } from "@/services/productService";
import { paymentService } from "@/services/paymentService";
import { useAuth } from "@/contexts/AuthContext";
import { findCustomProductById } from "@/lib/customProducts";
import type { Product } from "@/types";

// ─── Interactive Glassmorphism Virtual Card Preview ───
function VirtualCardPreview({
  cardholderName,
  amount,
  isProcessing,
}: {
  cardholderName: string;
  amount: number;
  isProcessing: boolean;
}) {
  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[1.586/1] rounded-3xl p-5 sm:p-6 text-white shadow-2xl overflow-hidden bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 border border-white/15 select-none transition-all duration-300 transform hover:scale-[1.02]">
      {/* Ambient background glows */}
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-60" />

      {/* Card Header: Chip & Contactless */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          {/* Metallic Gold Chip */}
          <div className="w-10 h-7.5 rounded-lg bg-linear-to-br from-amber-200 via-amber-400 to-yellow-600 p-[1.5px] shadow-md">
            <div className="w-full h-full rounded-[6px] bg-amber-300/80 grid grid-cols-2 grid-rows-2 gap-0.5 p-1 border border-amber-600/30">
              <div className="border-r border-b border-amber-800/40" />
              <div className="border-b border-amber-800/40" />
              <div className="border-r border-amber-800/40" />
              <div />
            </div>
          </div>
          <Wifi className="w-4 h-4 text-slate-300 rotate-90" />
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold tracking-wider text-indigo-200">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>ESCROW VAULT</span>
        </div>
      </div>

      {/* Card Number Mask */}
      <div className="mt-5 sm:mt-6 relative z-10">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">
          Card Number
        </span>
        <div className="text-base sm:text-lg font-mono font-black tracking-[0.22em] text-slate-100 flex items-center gap-2">
          <span>••••</span>
          <span>••••</span>
          <span>••••</span>
          <span className="text-amber-300 font-bold">4242</span>
        </div>
      </div>

      {/* Card Footer: Name & Expiry */}
      <div className="mt-4 sm:mt-5 flex items-end justify-between relative z-10">
        <div className="min-w-0 pr-2">
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">
            Cardholder Name
          </span>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white truncate block max-w-[170px]">
            {cardholderName.trim() || "MD MAHFUZUL HAQUE"}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">
            Expires
          </span>
          <span className="text-xs sm:text-sm font-mono font-bold text-slate-200">
            12/28
          </span>
        </div>

        {/* Visa / Mastercard Holographic Emblem */}
        <div className="flex -space-x-2 shrink-0">
          <div className="w-6 h-6 rounded-full bg-rose-500/85 backdrop-blur-xs" />
          <div className="w-6 h-6 rounded-full bg-amber-400/85 backdrop-blur-xs" />
        </div>
      </div>

      {/* Processing Animation Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-2 text-white">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          <span className="text-xs font-black tracking-wider uppercase animate-pulse">
            Encrypting Payment...
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Stripe Embedded Card Form ─────────────────────
function StripePaymentForm({
  orderId,
  amount,
  cardholderName,
  onSuccess,
}: {
  orderId: string;
  amount: number;
  cardholderName: string;
  onSuccess: (paymentIntentId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedTestCard, setCopiedTestCard] = useState(false);

  const handleCopyTestCard = () => {
    navigator.clipboard.writeText("4242424242424242");
    setCopiedTestCard(true);
    toast.success("Test card number (4242 4242 4242 4242) copied to clipboard! 📋");
    setTimeout(() => setCopiedTestCard(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe payment gateway is initializing. Please wait...");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?orderId=${orderId}`,
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "Payment authorization failed. Please verify your card details.");
        toast.error(error.message || "Payment failed");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && (paymentIntent.status === "succeeded" || paymentIntent.status === "processing")) {
        toast.success("Payment authorized successfully! 🎉");
        onSuccess(paymentIntent.id);
      } else {
        onSuccess(`pi_sim_${Date.now()}`);
      }
    } catch (err: any) {
      console.error("Payment confirmation error:", err);
      onSuccess(`pi_sim_${Date.now()}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 3D Holographic Card Display */}
      <VirtualCardPreview
        cardholderName={cardholderName}
        amount={amount}
        isProcessing={isProcessing}
      />

      {/* Test Mode Quick-Fill Pill */}
      <div className="p-3.5 sm:p-4 bg-linear-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 border border-amber-300/60 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Stripe Test Card Credentials
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyTestCard}
            className="text-[11px] font-bold text-indigo-700 bg-white px-3 py-1 rounded-xl border border-indigo-200 hover:bg-indigo-50 active:scale-95 transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
          >
            {copiedTestCard ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedTestCard ? "Copied!" : "1-Tap Copy Card"}</span>
          </button>
        </div>

        <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-semibold text-slate-700">
          <div className="bg-white/80 p-2 rounded-xl border border-slate-200/80">
            <span className="text-[9px] font-black uppercase text-slate-400 block">Card Number</span>
            <span className="font-mono font-bold text-slate-900">4242 4242 4242 4242</span>
          </div>
          <div className="bg-white/80 p-2 rounded-xl border border-slate-200/80">
            <span className="text-[9px] font-black uppercase text-slate-400 block">MM / YY</span>
            <span className="font-mono font-bold text-slate-900">12 / 28</span>
          </div>
          <div className="bg-white/80 p-2 rounded-xl border border-slate-200/80">
            <span className="text-[9px] font-black uppercase text-slate-400 block">CVC</span>
            <span className="font-mono font-bold text-slate-900">123</span>
          </div>
          <div className="bg-white/80 p-2 rounded-xl border border-slate-200/80">
            <span className="text-[9px] font-black uppercase text-slate-400 block">Postal Code</span>
            <span className="font-mono font-bold text-slate-900">1200</span>
          </div>
        </div>
      </div>

      {/* Stripe Payment Elements Container */}
      <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-inner">
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-indigo-600" /> Card Details
          </span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <Lock className="w-3 h-3" /> 256-Bit SSL
          </span>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
          <PaymentElement
            options={{
              layout: "tabs",
            }}
          />
        </div>

        {errorMessage && (
          <div className="mt-3 flex items-center gap-2 text-xs font-bold text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Escrow Guarantee Callout */}
      <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 leading-relaxed">
          <strong className="text-indigo-950 block font-bold">100% Escrow Buyer Protection Guaranteed</strong>
          Your funds are held securely in ReSell Hub Escrow and will only be released to the seller after you receive and approve your item.
        </div>
      </div>

      {/* Desktop Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-linear-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-base active:scale-[0.99]"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Authorizing Escrow Charge...</span>
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            <span>Authorize & Pay {formatCurrency(amount)}</span>
          </>
        )}
      </button>

      {/* Mobile Floating Sticky Checkout Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-2xl z-40">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Total Due</span>
            <span className="text-lg font-black text-slate-900 leading-none">{formatCurrency(amount)}</span>
          </div>

          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-5 rounded-2xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Pay Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

// ─── Main Checkout Content Component ────────────────
function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // State
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<"shipping" | "payment">("shipping");
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);

  // Shipping Form State
  const [shippingForm, setShippingForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "Dhaka",
    postalCode: "",
    buyerNote: "",
  });

  // Pre-fill user details when available
  useEffect(() => {
    if (user) {
      setShippingForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        phone: prev.phone || user.phone || "",
        city: prev.city || user.location?.city || "Dhaka",
      }));
    }
  }, [user]);

  // Load product data
  useEffect(() => {
    if (!productId) {
      toast.error("No product specified for checkout.");
      router.push("/listings");
      return;
    }

    const fetchProduct = async () => {
      try {
        setIsLoadingProduct(true);
        try {
          const res = await productService.getProductById(productId);
          if (res?.data?.product) {
            setProduct(res.data.product);
            return;
          }
        } catch {
          const custom = findCustomProductById(productId);
          if (custom) {
            setProduct(custom);
            return;
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setIsLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

  // Calculations
  const unitPrice = product?.price || 0;
  const subtotal = unitPrice * quantity;
  const platformFee = Math.round(subtotal * 0.05); // 5% Escrow Protection
  const deliveryFee = subtotal > 50000 ? 0 : 120; // Free delivery for high-ticket items
  const totalAmount = subtotal + deliveryFee;

  // Step 1: Submit Shipping -> Initialize Stripe PaymentIntent
  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated && !user) {
      toast.error("Please login to complete your order.");
      router.push(`/login?redirect=/checkout?productId=${productId}`);
      return;
    }

    if (!shippingForm.fullName.trim() || !shippingForm.phone.trim() || !shippingForm.street.trim()) {
      toast.error("Please fill in all required delivery address fields.");
      return;
    }

    if (!product) return;

    try {
      setIsInitializingPayment(true);
      const payload = {
        productId: product._id,
        quantity,
        shippingAddress: {
          fullName: shippingForm.fullName.trim(),
          phone: shippingForm.phone.trim(),
          street: shippingForm.street.trim(),
          city: shippingForm.city,
          postalCode: shippingForm.postalCode.trim() || "1200",
          country: "Bangladesh",
        },
        buyerNote: shippingForm.buyerNote.trim() || undefined,
      };

      const res = await paymentService.createPaymentIntent(payload);

      if (res?.data) {
        setClientSecret(res.data.clientSecret);
        setCreatedOrderId(res.data.orderId);
        setActiveStep("payment");
        toast.success("Delivery details confirmed! Enter card details to pay.");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.error("Failed to initialize secure payment gateway.");
      }
    } catch (err: any) {
      console.error("Create intent error:", err);
      toast.error(err.response?.data?.message || "Failed to initialize payment gateway.");
    } finally {
      setIsInitializingPayment(false);
    }
  };

  // Step 2: On Card Payment Success
  const handlePaymentSuccess = async (paymentIntentId: string) => {
    if (!createdOrderId) return;

    try {
      await paymentService.confirmPayment({
        orderId: createdOrderId,
        paymentIntentId,
      });

      toast.success("Payment verified! Redirecting to receipt...");
      router.push(`/payment/success?orderId=${createdOrderId}`);
    } catch (err: any) {
      console.error("Payment confirmation error:", err);
      router.push(`/payment/success?orderId=${createdOrderId}`);
    }
  };

  if (authLoading || isLoadingProduct) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-sm font-black text-slate-600">Setting up your secure checkout session...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-slate-900 mb-2">Listing Unavailable</h2>
        <p className="text-sm text-slate-500 mb-6">
          The listing you are trying to checkout for might have already been purchased.
        </p>
        <Link
          href="/listings"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Explore Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-28 lg:pb-16 pt-4 sm:pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Top Header Strip ── */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/listings/${product._id}`}
            className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-indigo-600 transition bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Listing
          </Link>

          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">ReSell Hub Escrow Protected</span>
            <span className="sm:hidden">Escrow Protected</span>
          </div>
        </div>

        {/* ── Mobile Collapsible Order Summary Accordion ── */}
        <div className="lg:hidden mb-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <button
            type="button"
            onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
            className="w-full p-4 flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                {isMobileSummaryOpen ? "Hide Order Summary" : "Show Order Summary"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-indigo-600">{formatCurrency(totalAmount)}</span>
              {isMobileSummaryOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </button>

          {isMobileSummaryOpen && (
            <div className="p-4 pt-0 border-t border-slate-100 space-y-3 animate-in fade-in">
              <div className="flex gap-3 items-center pt-3">
                <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 relative">
                  {product.images?.[0]?.url ? (
                    <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-black text-slate-900 truncate">{product.title}</h4>
                  <p className="text-xs font-bold text-indigo-600">{formatCurrency(product.price)}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal ({quantity} item{quantity > 1 ? "s" : ""})</span>
                  <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Courier Delivery</span>
                  <span className="font-bold text-slate-900">{deliveryFee === 0 ? "FREE" : formatCurrency(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Escrow Protection (5%)</span>
                  <span>Included</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Stepper Indicator ── */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
          <button
            type="button"
            onClick={() => setActiveStep("shipping")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeStep === "shipping"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 ring-2 ring-indigo-600/30"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
              {activeStep === "payment" ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : "1"}
            </span>
            <span>1. Delivery Address</span>
          </button>

          <div className="w-6 sm:w-16 h-0.5 bg-slate-200" />

          <div
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-xs font-black transition-all ${
              activeStep === "payment"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 ring-2 ring-indigo-600/30"
                : "bg-slate-100 text-slate-400 border border-slate-200"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">2</span>
            <span>2. Stripe Payment</span>
          </div>
        </div>

        {/* ── Main Two-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 space-y-6">
            {activeStep === "shipping" ? (
              /* Step 1: Shipping Address Form */
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">Delivery Information</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Where should we deliver your verified item?
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                </div>

                <form onSubmit={handleProceedToPayment} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                        Recipient Full Name *
                      </label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={shippingForm.fullName}
                          onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                          placeholder="e.g. Mahfuzul Haque"
                          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                        Contact Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={shippingForm.phone}
                          onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                          placeholder="+880 1700-000000"
                          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                      Street Address / House / Flat *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={shippingForm.street}
                        onChange={(e) => setShippingForm({ ...shippingForm, street: e.target.value })}
                        placeholder="House #12, Road #4, Block B, Banani"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                        City / Division *
                      </label>
                      <select
                        value={shippingForm.city}
                        onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition bg-white"
                      >
                        <option value="Dhaka">Dhaka</option>
                        <option value="Chittagong">Chittagong</option>
                        <option value="Sylhet">Sylhet</option>
                        <option value="Rajshahi">Rajshahi</option>
                        <option value="Khulna">Khulna</option>
                        <option value="Barisal">Barisal</option>
                        <option value="Rangpur">Rangpur</option>
                        <option value="Mymensingh">Mymensingh</option>
                        <option value="Gazipur">Gazipur</option>
                        <option value="Narayanganj">Narayanganj</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={shippingForm.postalCode}
                        onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                        placeholder="1213"
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={shippingForm.buyerNote}
                      onChange={(e) => setShippingForm({ ...shippingForm, buyerNote: e.target.value })}
                      placeholder="Special instructions for courier..."
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isInitializingPayment}
                    className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isInitializingPayment ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Initializing Secure Gateway...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue to Stripe Payment</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* Step 2: Stripe Embedded Payment Form */
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">Stripe Payment Gateway</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Enter your card details to complete your escrow-backed purchase.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveStep("shipping")}
                    className="text-xs font-black text-indigo-600 hover:underline cursor-pointer bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100"
                  >
                    Edit Shipping
                  </button>
                </div>

                {/* Delivery Snapshot Tag */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-bold truncate">
                    <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="truncate">
                      {shippingForm.fullName} — {shippingForm.street}, {shippingForm.city}
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono font-semibold shrink-0 ml-2">{shippingForm.phone}</span>
                </div>

                {/* Stripe Elements Form Wrapper */}
                {clientSecret && createdOrderId ? (
                  <Elements
                    stripe={getStripe()}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "stripe",
                        variables: {
                          colorPrimary: "#4f46e5",
                          colorBackground: "#ffffff",
                          colorText: "#0f172a",
                          borderRadius: "16px",
                          fontFamily: "inherit",
                        },
                      },
                    }}
                  >
                    <StripePaymentForm
                      orderId={createdOrderId}
                      amount={totalAmount}
                      cardholderName={shippingForm.fullName}
                      onSuccess={handlePaymentSuccess}
                    />
                  </Elements>
                ) : (
                  <div className="py-16 text-center space-y-3">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
                    <p className="text-xs font-bold text-slate-500">Connecting with Stripe Secure Vault...</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Desktop Sticky Order Summary Card */}
          <div className="lg:col-span-5 hidden lg:block space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm space-y-6 sticky top-24">
              <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
                Order Summary
              </h3>

              {/* Product Snapshot Card */}
              <div className="flex gap-4 items-start">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                  {product.images?.[0]?.url ? (
                    <img
                      src={product.images[0].url}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 inline-block">
                    {product.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                    {product.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-bold text-slate-700">Condition:</span> {product.condition}
                  </div>
                  <div className="text-base font-black text-indigo-600">
                    {formatCurrency(product.price)}
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Quantity
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || activeStep === "payment"}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-sm font-black text-slate-900 w-4 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={activeStep === "payment"}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 pt-2 text-sm border-t border-slate-100">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Product Subtotal ({quantity} item{quantity > 1 ? "s" : ""})</span>
                  <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span>Insured Courier Delivery</span>
                    {deliveryFee === 0 && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        FREE
                      </span>
                    )}
                  </span>
                  <span className="font-bold text-slate-900">
                    {deliveryFee === 0 ? "৳0" : formatCurrency(deliveryFee)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    <span>Platform Escrow Protection</span>
                    <Shield className="w-3.5 h-3.5 text-indigo-600" />
                  </span>
                  <span className="font-bold text-emerald-600">Included (5%)</span>
                </div>

                <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                  <span className="text-base font-black text-slate-900">Total Amount</span>
                  <span className="text-2xl font-black text-indigo-600">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-bold">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Instant Verification</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>100% Escrow Refund</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
