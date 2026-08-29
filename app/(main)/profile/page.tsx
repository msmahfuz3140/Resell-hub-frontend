"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft, Star, MapPin, Calendar, Package, ShoppingCart,
  ShieldCheck, Edit3, TrendingUp, Award, Heart, Eye, Clock,
  BadgeCheck, Zap, BarChart2, MessageSquare, ThumbsUp,
  Globe, Copy, Share2,
  CheckCircle2, AlertCircle, Flame, Target, Gift, Users,
  ChevronRight, ExternalLink, Camera, Loader2, Upload, X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import api from "@/lib/axios";

// ── Brand Icons (not in lucide-react) ─────────────────
const TwitterIcon = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
  </svg>
);
const InstagramIcon = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const LinkedinIcon = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
  </svg>
);

// ── Demo Data ──────────────────────────────────────────
const DEMO_ACHIEVEMENTS = [
  { icon: Flame, label: "Hot Seller", desc: "5+ sales in 7 days", color: "from-orange-500 to-red-500", unlocked: true },
  { icon: ShieldCheck, label: "Trusted Trader", desc: "ID verified & escrow completed", color: "from-emerald-500 to-teal-500", unlocked: true },
  { icon: Zap, label: "Quick Responder", desc: "< 1 hr avg reply time", color: "from-amber-400 to-yellow-500", unlocked: true },
  { icon: Star, label: "Top Rated", desc: "4.8+ star rating maintained", color: "from-indigo-500 to-purple-600", unlocked: true },
  { icon: Target, label: "Deal Closer", desc: "Completed 10+ transactions", color: "from-cyan-500 to-blue-500", unlocked: false },
  { icon: Gift, label: "Community Hero", desc: "Referred 5+ new members", color: "from-pink-500 to-rose-500", unlocked: false },
];

const DEMO_ACTIVITY = [
  { icon: Package, label: "Listed \"iPhone 14 Pro 256GB\"", time: "2 hours ago", color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60" },
  { icon: ShoppingCart, label: "Completed sale of \"MacBook Air M2\"", time: "1 day ago", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60" },
  { icon: MessageSquare, label: "Received a new message from Tanvir", time: "2 days ago", color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-950/60" },
  { icon: ThumbsUp, label: "Got a 5-star review from Rahim", time: "3 days ago", color: "text-amber-500 bg-amber-50 dark:bg-amber-950/60" },
  { icon: Heart, label: "15 users wishlisted your listing", time: "4 days ago", color: "text-rose-500 bg-rose-50 dark:bg-rose-950/60" },
];

const DEMO_REVIEWS = [
  { name: "Rahim Chowdhury", avatar: "R", rating: 5, text: "Super smooth transaction. Product was exactly as described. Highly recommend!", date: "2 days ago" },
  { name: "Tanzid Ahmed", avatar: "T", rating: 5, text: "Very quick response and professional packaging. Will definitely buy again.", date: "1 week ago" },
  { name: "Sumaiya Begum", avatar: "S", rating: 4, text: "Good seller overall. Item was slightly delayed but in perfect condition.", date: "2 weeks ago" },
];

const DEMO_PORTFOLIO = [
  { title: "iPhone 14 Pro", price: "৳ 68,000", status: "Active", views: 342, image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=200&h=200&fit=crop" },
  { title: "MacBook Air M2", price: "৳ 110,000", status: "Sold", views: 521, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop" },
  { title: "Sony WH-1000XM5", price: "৳ 22,000", status: "Active", views: 189, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={12} fill={s <= Math.round(rating) ? "#f59e0b" : "none"} className={s <= Math.round(rating) ? "text-amber-400" : "text-slate-300"} />
      ))}
    </div>
  );
}

// ── Image Upload Modal ─────────────────────────────────
interface ImageUploadModalProps {
  type: "avatar" | "cover";
  onClose: () => void;
  onSuccess: (url: string) => void;
}

function ImageUploadModal({ type, onClose, onSuccess }: ImageUploadModalProps) {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (!f.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      toast.error("Only JPG, PNG, or WebP images are supported.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB.");
      return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, [handleFile]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      if (type === "avatar") {
        formData.append("photo", file);
        const res = await api.put("/users/me", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const updatedUser = res.data?.data?.user;
        onSuccess(updatedUser?.photo?.url || preview!);
      } else {
        formData.append("cover", file);
        const res = await api.put("/users/me/cover", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const updatedUser = res.data?.data?.user;
        onSuccess(updatedUser?.coverPhoto?.url || preview!);
      }
      toast.success(`${type === "avatar" ? "Profile photo" : "Cover photo"} updated! ✅`);
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        || "Upload failed. Please try again.";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const isAvatar = type === "avatar";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-black text-slate-900 dark:text-white text-base">
              {isAvatar ? "Update Profile Photo" : "Update Cover Photo"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              JPG, PNG or WebP · Max 5MB
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Preview */}
          {preview ? (
            <div className="relative">
              {isAvatar ? (
                <div className="flex justify-center">
                  <div className="relative w-32 h-32 rounded-2xl overflow-hidden ring-4 ring-indigo-500/30 shadow-xl">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => { setPreview(null); setFile(null); }}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden h-36 ring-2 ring-indigo-500/30 shadow-xl">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => { setPreview(null); setFile(null); }}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors"
                  >
                    <X size={13} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Drop Zone */
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all select-none ${isAvatar ? "h-44" : "h-36"} ${dragOver ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40" : "border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800/60"}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${dragOver ? "bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>
                <Upload size={22} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {dragOver ? "Drop it here!" : "Click or drag image here"}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">JPG, PNG, WebP up to 5MB</p>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer">
              Cancel
            </button>
            <button
              onClick={preview ? handleUpload : () => inputRef.current?.click()}
              disabled={uploading}
              className="flex-1 py-2.5 rounded-xl btn-shiny-primary text-xs font-black flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {uploading ? (
                <><Loader2 size={14} className="animate-spin" /> Uploading...</>
              ) : preview ? (
                <><Upload size={14} /> Save Photo</>
              ) : (
                <><Camera size={14} /> Choose Photo</>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Profile Content ───────────────────────────────
function ProfileContent() {
  const { user, refreshUser } = useAuth();
  const [copiedLink, setCopiedLink] = useState(false);
  const [activePortfolio, setActivePortfolio] = useState<"active" | "sold" | "all">("all");
  const [uploadModal, setUploadModal] = useState<"avatar" | "cover" | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const rating = typeof user?.rating === "number" ? user.rating : (user?.rating as { average?: number })?.average || 5.0;
  const trustScore = 94;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://resell-hub-frontend.vercel.app/seller/${user?._id || "demo"}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePhotoSuccess = async (url: string, type: "avatar" | "cover") => {
    if (type === "avatar") setAvatarPreview(url);
    else setCoverPreview(url);
    await refreshUser();
  };

  const currentAvatarUrl = avatarPreview || user?.photo?.url;
  const currentCoverUrl = coverPreview || user?.coverPhoto?.url;

  return (
    <>
      {/* Upload Modal */}
      <AnimatePresence>
        {uploadModal && (
          <ImageUploadModal
            type={uploadModal}
            onClose={() => setUploadModal(null)}
            onSuccess={(url) => handlePhotoSuccess(url, uploadModal)}
          />
        )}
      </AnimatePresence>

      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-8 transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Back + Share Row */}
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <ArrowLeft size={15} /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <button onClick={handleCopyLink} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer">
                {copiedLink ? <CheckCircle2 size={13} className="text-emerald-500" /> : <Copy size={13} />}
                {copiedLink ? "Copied!" : "Copy Link"}
              </button>
              <Link href="/settings" className="flex items-center gap-1.5 px-3 py-1.5 btn-shiny-primary rounded-xl text-xs font-bold">
                <Edit3 size={13} /> Edit Profile
              </Link>
            </div>
          </div>

          {/* ── Hero Card ── */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-sm">

            {/* ── Cover Photo ── */}
            <div className="relative h-44 sm:h-56 group overflow-hidden">
              {currentCoverUrl ? (
                <img
                  src={currentCoverUrl as string}
                  alt="Cover"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
                  <div className="absolute -bottom-10 left-1/3 w-60 h-60 bg-indigo-400/20 rounded-full blur-2xl" />
                  {/* Decorative mesh */}
                  <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 800 250" preserveAspectRatio="xMidYMid slice">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="800" height="250" fill="url(#grid)" />
                  </svg>
                </div>
              )}

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />

              {/* Change Cover Button */}
              <button
                onClick={() => setUploadModal("cover")}
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
                  <Camera size={22} className="text-white" />
                </div>
                <span className="text-white text-xs font-black tracking-wide uppercase bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                  Change Cover Photo
                </span>
              </button>

              {/* Always-visible cover btn (top-right) */}
              <button
                onClick={() => setUploadModal("cover")}
                className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/40 hover:bg-black/60 text-white text-[11px] font-bold rounded-xl backdrop-blur-sm border border-white/20 transition-all cursor-pointer z-10"
              >
                <Camera size={12} /> Change Cover
              </button>
            </div>

            {/* ── Avatar ── */}
            <div className="px-6 sm:px-8 pt-4 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14 sm:-mt-16 mb-5">
                {/* Avatar with edit button */}
                <div className="relative group w-fit">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white dark:bg-slate-800 p-1.5 shadow-xl ring-4 ring-white dark:ring-slate-900">
                    <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-3xl font-black">
                      {currentAvatarUrl ? (
                        <img
                          src={currentAvatarUrl}
                          alt={user?.name || "Profile"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user?.name?.[0]?.toUpperCase() || "U"
                      )}
                    </div>
                  </div>
                  {/* Edit overlay on avatar hover */}
                  <button
                    onClick={() => setUploadModal("avatar")}
                    className="absolute inset-0 rounded-2xl flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all cursor-pointer"
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center gap-1">
                      <Camera size={20} className="text-white" />
                      <span className="text-white text-[9px] font-black uppercase tracking-wider">Edit</span>
                    </div>
                  </button>
                  {/* Small camera badge */}
                  <button
                    onClick={() => setUploadModal("avatar")}
                    className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 cursor-pointer transition-colors z-10"
                  >
                    <Camera size={14} />
                  </button>
                </div>

                {/* Name + badges */}
                <div className="flex-1 sm:pb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{user?.name || "User"}</h1>
                    {user?.isVerified && (
                      <BadgeCheck size={22} className="text-indigo-600 dark:text-indigo-400" fill="currentColor" />
                    )}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60">
                      {user?.role || "buyer"} Account
                    </span>
                    {user?.isVerified && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-100 dark:border-emerald-800/60">
                        <ShieldCheck size={11} /> ID Verified
                      </span>
                    )}
                    {user?.location?.city && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        <MapPin size={11} className="text-indigo-500" /> {user.location.city}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      <Calendar size={11} /> Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-2 sm:pb-1 shrink-0">
                  {[
                    { icon: Globe, label: "Website" },
                    { icon: TwitterIcon, label: "Twitter" },
                    { icon: InstagramIcon, label: "Instagram" },
                    { icon: LinkedinIcon, label: "LinkedIn" },
                  ].map((s) => (
                    <a key={s.label} href="#" title={s.label} className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-all">
                      <s.icon size={14} />
                    </a>
                  ))}
                </div>
              </div>

              {user?.bio && (
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-5">
                  {user.bio}
                </p>
              )}

              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Total Sales", value: user?.totalSales || 0, icon: Package, color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60" },
                  { label: "Purchases", value: user?.totalPurchases || 0, icon: ShoppingCart, color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60" },
                  { label: "Rating", value: Number(rating).toFixed(1), icon: Star, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/60" },
                  { label: "Trust Score", value: `${trustScore}%`, icon: ShieldCheck, color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60" },
                ].map((s) => (
                  <div key={s.label} className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-4 text-center">
                    <div className={`w-9 h-9 rounded-xl ${s.color} mx-auto flex items-center justify-center mb-2`}>
                      <s.icon size={16} />
                    </div>
                    <span className="text-xl font-black text-slate-900 dark:text-white block">{s.value}</span>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Two Column Layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Trust Score */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-indigo-600 dark:text-indigo-400" /> Trust Score
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{trustScore}</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">Excellent</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${trustScore}%` }} />
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Identity Verified", done: true },
                    { label: "Phone Verified", done: true },
                    { label: "Email Verified", done: true },
                    { label: "Escrow History", done: true },
                    { label: "No Disputes", done: true },
                    { label: "Premium Member", done: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-xs">
                      <span className={`font-semibold ${item.done ? "text-slate-700 dark:text-slate-300" : "text-slate-400 dark:text-slate-500"}`}>{item.label}</span>
                      {item.done ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertCircle size={14} className="text-slate-300 dark:text-slate-600" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <BarChart2 size={16} className="text-indigo-600 dark:text-indigo-400" /> Performance
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Response Rate", value: "98%", w: 98, color: "bg-emerald-500" },
                    { label: "Completion Rate", value: "95%", w: 95, color: "bg-indigo-500" },
                    { label: "On-Time Delivery", value: "92%", w: 92, color: "bg-purple-500" },
                    { label: "Repeat Buyers", value: "67%", w: 67, color: "bg-cyan-500" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{item.label}</span>
                        <span className="text-[11px] font-black text-slate-900 dark:text-white">{item.value}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.w}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seller Level */}
              <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-6 rounded-3xl text-white shadow-lg shadow-indigo-500/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-200">Seller Level</span>
                  <Award size={20} className="text-amber-300" />
                </div>
                <div className="text-3xl font-black mb-1">Gold</div>
                <p className="text-xs text-indigo-200 mb-4">50 more sales to reach Platinum</p>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: "72%" }} />
                </div>
                <div className="flex items-center justify-between mt-2 text-[10px] text-indigo-200 font-bold">
                  <span>72 / 100 sales</span>
                  <span>Platinum →</span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Achievements */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Award size={16} className="text-amber-500" /> Achievements
                  </h3>
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">4 of 6 unlocked</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {DEMO_ACHIEVEMENTS.map((a) => (
                    <div key={a.label} className={`relative rounded-2xl p-4 border transition-all ${a.unlocked ? "border-slate-200/90 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60" : "border-dashed border-slate-200 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/30 opacity-50"}`}>
                      {a.unlocked && <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center"><CheckCircle2 size={10} className="text-white" /></div>}
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${a.color} flex items-center justify-center mb-2 shadow-sm`}>
                        <a.icon size={16} className="text-white" />
                      </div>
                      <h4 className="text-[11px] font-black text-slate-800 dark:text-slate-200 leading-tight">{a.label}</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{a.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Star size={16} className="text-amber-500" fill="#f59e0b" /> Recent Reviews
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{Number(rating).toFixed(1)}</span>
                    <StarRating rating={Number(rating)} />
                  </div>
                </div>
                <div className="space-y-4">
                  {DEMO_REVIEWS.map((r) => (
                    <div key={r.name} className="flex gap-3 pb-4 border-b border-slate-50 dark:border-slate-800 last:border-0 last:pb-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-sm shrink-0">{r.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900 dark:text-white">{r.name}</span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500">{r.date}</span>
                        </div>
                        <StarRating rating={r.rating} />
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">{r.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Feed */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                  <Clock size={16} className="text-indigo-600 dark:text-indigo-400" /> Recent Activity
                </h3>
                <div className="space-y-1">
                  {DEMO_ACTIVITY.map((a, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${a.color}`}>
                        <a.icon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">{a.label}</p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{a.time}</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 dark:text-slate-600 shrink-0 mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Portfolio ── */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Package size={16} className="text-indigo-600 dark:text-indigo-400" /> My Listings
              </h3>
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                {(["all", "active", "sold"] as const).map((t) => (
                  <button key={t} onClick={() => setActivePortfolio(t)} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${activePortfolio === t ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {DEMO_PORTFOLIO.filter(p => activePortfolio === "all" || p.status.toLowerCase() === activePortfolio).map((p) => (
                <div key={p.title} className="group rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-black ${p.status === "Active" ? "bg-emerald-500 text-white" : "bg-slate-700 text-white"}`}>{p.status}</div>
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">{p.title}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{p.price}</span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 font-medium"><Eye size={11} /> {p.views}</span>
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/add-product" className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-6 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-2">
                  <Package size={18} />
                </div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Add New Listing</span>
              </Link>
            </div>
          </div>

          {/* ── Analytics Banner ── */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg shadow-indigo-500/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={18} className="text-indigo-200" />
                  <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-200">Seller Analytics</span>
                </div>
                <h3 className="text-xl font-black">Your Store is Growing 🚀</h3>
                <p className="text-sm text-indigo-200 mt-1">15% increase in views this week. Upgrade to Pro for full insights.</p>
              </div>
              <Link href="/dashboard" className="flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-600 rounded-xl text-xs font-extrabold hover:bg-indigo-50 transition-colors shrink-0">
                View Dashboard <ExternalLink size={13} />
              </Link>
            </div>
          </div>

          {/* ── Referral ── */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Refer & Earn</h3>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">Invite friends to ReSell Hub and earn rewards on their first transaction!</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-600 dark:text-slate-300 truncate">
                    RESELL-{(user?._id || "DEMO12").toString().slice(0, 6).toUpperCase()}
                  </div>
                  <button onClick={handleCopyLink} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0">
                    <Share2 size={12} /> Share
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 shrink-0">
                {[{ label: "Referrals", value: "3" }, { label: "Earnings", value: "৳450" }, { label: "Pending", value: "৳150" }].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-sm font-black text-slate-900 dark:text-white">{s.value}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
