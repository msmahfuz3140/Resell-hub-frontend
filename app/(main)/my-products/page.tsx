"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  PlusCircle,
  Search,
  X,
  Edit3,
  Trash2,
  Eye,
  Heart,
  TrendingUp,
  Clock,
  Filter,
  AlertCircle,
  RefreshCw,
  Loader2,
  CheckCircle2,
  ImagePlus,
  ChevronRight,
  Star,
  DollarSign,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Pagination from "@/components/ui/Pagination";
import { useAuth } from "@/contexts/AuthContext";
import { productService } from "@/services/productService";
import { formatCurrency, timeAgo } from "@/lib/utils";
import ProductImage from "@/components/ui/ProductImage";
import { CATEGORIES } from "@/lib/constants";
import type { Product } from "@/types";

const CONDITIONS = ["New", "Like New", "Good", "Fair", "Poor"] as const;
const BD_CITIES = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Rangpur", "Mymensingh", "Narayanganj", "Gazipur", "Comilla", "Jessore", "Bogura", "Dinajpur", "Cox's Bazar"];
const STATUS_OPTIONS = [
  { value: "all", label: "All Listings" },
  { value: "active", label: "Active" },
  { value: "sold", label: "Sold" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

function statusColor(status: string) {
  const map: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    sold: "bg-purple-100 text-purple-700 border-purple-200",
    draft: "bg-slate-100 text-slate-600 border-slate-200",
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    rejected: "bg-rose-100 text-rose-600 border-rose-200",
    archived: "bg-slate-100 text-slate-500 border-slate-200",
  };
  return map[status] || "bg-slate-100 text-slate-600 border-slate-200";
}

// ─── Edit Modal ────────────────────────────────────
interface EditModalProps {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}

function EditModal({ product, onClose, onSuccess }: EditModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: product.title,
    description: product.description,
    category: product.category,
    condition: product.condition,
    price: String(product.price),
    originalPrice: product.originalPrice ? String(product.originalPrice) : "",
    stock: String(product.stock ?? 1),
    negotiable: product.negotiable ?? false,
    city: product.location?.city ?? "",
    meetupPreference: product.meetupPreference ?? "Both",
    status: product.status,
  });
  const [newImages, setNewImages] = useState<{ file: File; preview: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageAdd = (files: FileList) => {
    const arr = Array.from(files).slice(0, 8);
    setNewImages(arr.map((f) => ({ file: f, preview: URL.createObjectURL(f) })));
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.price) {
      toast.error("Title and price are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("category", form.category);
      formData.append("condition", form.condition);
      formData.append("price", form.price);
      if (form.originalPrice) formData.append("originalPrice", form.originalPrice);
      formData.append("stock", form.stock);
      formData.append("negotiable", String(form.negotiable));
      formData.append("meetupPreference", form.meetupPreference);
      formData.append("status", form.status);
      formData.append("location", JSON.stringify({ city: form.city, country: "Bangladesh" }));
      newImages.forEach((img) => formData.append("images", img.file));

      const data = await productService.updateProduct(product._id, formData);
      if (data.success) {
        toast.success("Product updated successfully!");
        onSuccess();
        onClose();
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch {
      toast.error("Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-8 py-6 border-b border-slate-100 flex items-center justify-between rounded-t-3xl">
          <div>
            <h2 className="text-xl font-black text-slate-900">Edit Listing</h2>
            <p className="text-xs text-slate-500 mt-0.5">Update your product details</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Images */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">Product Images</label>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                <Upload size={13} /> Replace Images
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleImageAdd(e.target.files)} />

            {newImages.length > 0 ? (
              <div className="grid grid-cols-4 gap-2">
                {newImages.map((img, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden border border-slate-200">
                    <img src={img.preview} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((img, i) => (
                  <div key={i} className={`aspect-square rounded-xl overflow-hidden border-2 ${i === 0 ? "border-indigo-400" : "border-slate-200"}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">Title</label>
            <input
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Category + Condition */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">Category</label>
              <select
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 transition-all"
              >
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">Condition</label>
              <select
                value={form.condition}
                onChange={(e) => handleChange("condition", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 transition-all"
              >
                {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Price + Original Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">Price (৳)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-800 outline-none focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">Original Price (৳)</label>
              <input
                type="number"
                value={form.originalPrice}
                onChange={(e) => handleChange("originalPrice", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Stock + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">Stock</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => handleChange("stock", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">Status</label>
              <select
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 transition-all"
              >
                {["active", "draft", "archived"].map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>

          {/* City + Negotiable */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">City</label>
              <select
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 transition-all"
              >
                {BD_CITIES.map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">Negotiable</label>
              <div className="flex gap-3">
                {[true, false].map((val) => (
                  <button
                    key={String(val)}
                    type="button"
                    onClick={() => handleChange("negotiable", val)}
                    className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${form.negotiable === val ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                  >
                    {val ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-8 py-5 flex gap-3 rounded-b-3xl">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-700 font-black text-sm hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 btn-shiny-primary py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : <><CheckCircle2 size={16} /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Product Row Card ──────────────────────────────
interface ProductRowProps {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}

function ProductRow({ product, onEdit, onDelete }: ProductRowProps) {
  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md hover:border-indigo-200/60 transition-all group">
      {/* Image */}
      <Link href={`/listings/${product._id}`} className="shrink-0">
        <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-slate-100">
          <ProductImage
            src={primaryImage?.url}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            iconSize={20}
          />
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${statusColor(product.status)}`}>
                {product.status}
              </span>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {product.category}
              </span>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {product.condition}
              </span>
            </div>
            <Link href={`/listings/${product._id}`}>
              <h3 className="font-black text-slate-900 text-sm line-clamp-2 hover:text-indigo-600 transition-colors">
                {product.title}
              </h3>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onEdit(product)}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-indigo-100 text-slate-500 hover:text-indigo-600 flex items-center justify-center transition-all"
              title="Edit"
            >
              <Edit3 size={14} />
            </button>
            <Link
              href={`/listings/${product._id}`}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all"
              title="View"
            >
              <Eye size={14} />
            </Link>
            <button
              onClick={() => onDelete(product)}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 flex items-center justify-center transition-all"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 mt-2 flex-wrap">
          <div className="flex items-center gap-1">
            <span className="text-base font-black text-slate-900">{formatCurrency(product.price)}</span>
            {discount > 0 && (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">
                -{discount}%
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Eye size={12} className="text-slate-400" /> {product.views}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Heart size={12} className="text-rose-400" /> {product.favorites?.length || 0}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
            <Clock size={12} /> {timeAgo(product.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────
function MyProductsContent() {
  const { user } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 12, total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isSeller = user?.role === "seller" || user?.role === "admin";

  const fetchProducts = useCallback(async () => {
    if (!isSeller) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.getMyProducts({
        search: search || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        page,
        limit: 12,
      });
      if (data.data && data.data.length > 0) {
        setProducts(data.data);
        setMeta(data.meta);
        return;
      }
      throw new Error("No remote products");
    } catch {
      // Fallback: Read locally added products + default sample products
      let custom: Product[] = [];
      try {
        custom = JSON.parse(localStorage.getItem("resellhub_custom_products") || "[]");
      } catch {
        custom = [];
      }

      const sampleProducts: Product[] = [
        {
          _id: "prod-sample-1",
          title: "iPhone 15 Pro Max 256GB - Natural Titanium",
          description: "Battery health 98%. Authentic invoice included.",
          price: 94000,
          originalPrice: 125000,
          category: "Electronics",
          condition: "Like New",
          images: [{ url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80", isPrimary: true, publicId: "" }],
          status: "active",
          views: 420,
          favorites: ["u1", "u2"],
          location: { city: "Dhaka", country: "Bangladesh" },
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "prod-sample-2",
          title: "Sony WH-1000XM5 Wireless Headphones",
          description: "Used 2 months. All original accessories with box.",
          price: 28500,
          originalPrice: 36000,
          category: "Electronics",
          condition: "Like New",
          images: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80", isPrimary: true, publicId: "" }],
          status: "active",
          views: 310,
          favorites: ["u3"],
          location: { city: "Chittagong", country: "Bangladesh" },
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const merged = [...custom, ...sampleProducts];
      const filtered = merged.filter((p) => {
        const matchesSearch = search ? p.title.toLowerCase().includes(search.toLowerCase()) : true;
        const matchesStatus = statusFilter !== "all" ? p.status === statusFilter : true;
        return matchesSearch && matchesStatus;
      });

      setProducts(filtered);
      setMeta({ page: 1, limit: 12, total: filtered.length, totalPages: 1, hasNextPage: false, hasPrevPage: false });
    } finally {
      setIsLoading(false);
    }
  }, [isSeller, search, statusFilter, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const data = await productService.deleteProduct(deleteTarget._id);
      if (data.success) {
        toast.success("Product deleted successfully");
        setDeleteTarget(null);
        fetchProducts();
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isSeller) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 max-w-md text-center shadow-xl border border-slate-200">
          <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Sellers Only</h2>
          <p className="text-slate-500 text-sm mb-6">This page is for sellers. Upgrade your account to start selling.</p>
          <button onClick={() => router.push("/dashboard")} className="btn-shiny-primary px-6 py-3 rounded-xl font-black text-sm">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Listings",
      value: meta.total,
      icon: Package,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Active",
      value: products.filter((p) => p.status === "active").length,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Total Views",
      value: products.reduce((acc, p) => acc + (p.views || 0), 0),
      icon: Eye,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Favorites",
      value: products.reduce((acc, p) => acc + (p.favorites?.length || 0), 0),
      icon: Heart,
      color: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Seller Portal
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Products</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage your active listings</p>
          </div>
          <Link
            href="/add-product"
            className="btn-shiny-amber px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg self-start sm:self-auto"
          >
            <PlusCircle size={16} /> Post New Ad
          </Link>
        </div>

        {/* Stats Cards */}
        {!isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {statCards.map((card) => (
              <div key={card.label} className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-3 shadow-sm">
                <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center shrink-0`}>
                  <card.icon size={18} />
                </div>
                <div>
                  <div className="text-xl font-black text-slate-900">{card.value.toLocaleString()}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{card.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm mb-6 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your listings..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`px-3 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                  statusFilter === opt.value
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center mb-6">
            <AlertCircle size={24} className="text-rose-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700 mb-4">{error}</p>
            <button onClick={fetchProducts} className="btn-shiny-primary px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 mx-auto">
              <RefreshCw size={13} /> Retry
            </button>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-4 animate-pulse">
                <div className="w-28 h-28 bg-slate-200 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                  <div className="h-3 bg-slate-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && products.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-400 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <Package size={36} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">
              {search || statusFilter !== "all" ? "No listings match your filters" : "No listings yet"}
            </h3>
            <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto">
              {search || statusFilter !== "all"
                ? "Try clearing your search or changing the status filter."
                : "Start selling by creating your first product listing today."}
            </p>
            {!(search || statusFilter !== "all") && (
              <Link href="/add-product" className="btn-shiny-amber px-8 py-3.5 rounded-2xl font-black text-sm inline-flex items-center gap-2 shadow-lg">
                <PlusCircle size={18} /> Post Your First Ad
              </Link>
            )}
          </div>
        )}

        {/* Products List */}
        {!isLoading && !error && products.length > 0 && (
          <>
            <div className="space-y-3">
              {products.map((product) => (
                <ProductRow
                  key={product._id}
                  product={product}
                  onEdit={setEditProduct}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>

            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              total={meta.total}
              limit={meta.limit}
              onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            />
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editProduct && (
        <EditModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSuccess={fetchProducts}
        />
      )}

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Listing?"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This action cannot be undone and will also remove all associated images.`}
        confirmLabel="Delete Permanently"
        cancelLabel="Keep Listing"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default function MyProductsPage() {
  return (
    <ProtectedRoute>
      <MyProductsContent />
    </ProtectedRoute>
  );
}
