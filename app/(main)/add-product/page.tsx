"use client";

import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  X,
  ImagePlus,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Package,
  Tag,
  MapPin,
  DollarSign,
  Star,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { productService } from "@/services/productService";
import { CATEGORIES } from "@/lib/constants";

const CONDITIONS = ["New", "Like New", "Good", "Fair", "Poor"] as const;
const MEETUP_OPTIONS = ["In-person", "Delivery", "Both"] as const;
const BD_CITIES = [
  "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna",
  "Barishal", "Rangpur", "Mymensingh", "Narayanganj", "Gazipur",
  "Comilla", "Jessore", "Bogura", "Dinajpur", "Cox's Bazar",
];

interface ImagePreview {
  file: File;
  preview: string;
  isPrimary: boolean;
}

interface FormData {
  title: string;
  description: string;
  category: string;
  condition: string;
  price: string;
  originalPrice: string;
  stock: string;
  negotiable: boolean;
  city: string;
  meetupPreference: string;
  tags: string;
}

const INITIAL_FORM: FormData = {
  title: "",
  description: "",
  category: "",
  condition: "",
  price: "",
  originalPrice: "",
  stock: "1",
  negotiable: false,
  city: "",
  meetupPreference: "Both",
  tags: "",
};

const STEPS = [
  { id: 1, label: "Images", icon: ImagePlus },
  { id: 2, label: "Details", icon: Package },
  { id: 3, label: "Pricing & Location", icon: MapPin },
];

function AddProductContent() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(1);
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData | "images", string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Check seller role
  const isSeller = user?.role === "seller" || user?.role === "admin";

  // ── Image Handlers ─────────────────────────────────
  const addImages = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const remaining = 8 - images.length;
    if (remaining <= 0) {
      toast.error("Maximum 8 images allowed");
      return;
    }
    const toAdd = fileArray.slice(0, remaining);
    const newPreviews: ImagePreview[] = toAdd.map((file, i) => ({
      file,
      preview: URL.createObjectURL(file),
      isPrimary: images.length === 0 && i === 0,
    }));
    setImages((prev) => [...prev, ...newPreviews]);
    if (errors.images) setErrors((e) => ({ ...e, images: undefined }));
  }, [images.length, errors.images]);

  const removeImage = (index: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
        updated[0].isPrimary = true;
      }
      return updated;
    });
  };

  const setPrimary = (index: number) => {
    setImages((prev) => prev.map((img, i) => ({ ...img, isPrimary: i === index })));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addImages(e.dataTransfer.files);
  }, [addImages]);

  // ── Form Handlers ──────────────────────────────────
  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  // ── Validation ─────────────────────────────────────
  const validateStep = (s: number): boolean => {
    const errs: typeof errors = {};

    if (s === 1) {
      if (images.length === 0) errs.images = "At least 1 image is required";
    }
    if (s === 2) {
      if (!form.title.trim() || form.title.length < 5) errs.title = "Title must be at least 5 characters";
      if (!form.description.trim() || form.description.length < 20) errs.description = "Description must be at least 20 characters";
      if (!form.category) errs.category = "Please select a category";
      if (!form.condition) errs.condition = "Please select a condition";
    }
    if (s === 3) {
      if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) errs.price = "Enter a valid price";
      if (!form.city) errs.city = "Please select your city";
      if (form.stock && (isNaN(Number(form.stock)) || Number(form.stock) < 0)) errs.stock = "Stock must be a valid number";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, 3));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  // ── Submit ──────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("category", form.category);
      formData.append("condition", form.condition);
      formData.append("price", form.price);
      if (form.originalPrice) formData.append("originalPrice", form.originalPrice);
      formData.append("stock", form.stock || "1");
      formData.append("negotiable", String(form.negotiable));
      formData.append("meetupPreference", form.meetupPreference);
      formData.append("location", JSON.stringify({ city: form.city, country: "Bangladesh" }));

      // Parse tags
      const tagsArray = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      formData.append("tags", JSON.stringify(tagsArray));

      // Append images
      images.forEach((img) => formData.append("images", img.file));

      const data = await productService.createProduct(formData);
      if (data.success) {
        toast.success("🎉 Product listed successfully!");
        router.push("/my-products");
      } else {
        toast.error(data.message || "Failed to create listing");
      }
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message || "Failed to create product listing");
    } finally {
      setIsSubmitting(false);
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
          <p className="text-slate-500 text-sm mb-6">
            You need a seller account to list products. Please upgrade your account or contact support.
          </p>
          <button onClick={() => router.push("/dashboard")} className="btn-shiny-primary px-6 py-3 rounded-xl font-black text-sm">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100 mb-4">
            <Tag size={13} /> New Listing
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Post Your Ad</h1>
          <p className="text-slate-500 text-sm mt-2">Fill in the details to list your item for sale</p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => { if (s.id < step) setStep(s.id); }}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all ${
                    s.id === step
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110"
                      : s.id < step
                      ? "bg-emerald-500 text-white cursor-pointer hover:scale-105"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {s.id < step ? <CheckCircle2 size={18} /> : <s.icon size={16} />}
                </button>
                <span className={`text-[11px] font-bold mt-1.5 ${s.id === step ? "text-indigo-600" : s.id < step ? "text-emerald-600" : "text-slate-400"}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 w-16 sm:w-24 mx-1 mb-5 transition-all ${s.id < step ? "bg-emerald-400" : "bg-slate-200"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Step 1: Images */}
          {step === 1 && (
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-900 mb-1">Product Photos</h2>
                <p className="text-xs text-slate-500">Upload up to 8 photos. First photo is the cover.</p>
              </div>

              {/* Dropzone */}
              <div
                ref={dropzoneRef}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-50/60"
                    : errors.images
                    ? "border-rose-300 bg-rose-50/30"
                    : "border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30"
                }`}
              >
                <Upload size={32} className={`mx-auto mb-3 ${isDragging ? "text-indigo-600" : "text-slate-400"}`} />
                <p className="text-sm font-bold text-slate-600 mb-1">
                  {isDragging ? "Drop images here" : "Drag & drop or click to upload"}
                </p>
                <p className="text-xs text-slate-400">PNG, JPG, WEBP up to 5MB each • Max 8 photos</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && addImages(e.target.files)}
                />
              </div>
              {errors.images && <p className="text-xs text-rose-500 font-bold flex items-center gap-1"><AlertCircle size={13} />{errors.images}</p>}

              {/* Image Preview Grid */}
              {images.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-600">{images.length}/8 photos uploaded</span>
                    <span className="text-xs text-slate-400">Click ⭐ to set cover photo</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {images.map((img, i) => (
                      <div key={i} className={`relative aspect-square rounded-2xl overflow-hidden border-2 group ${img.isPrimary ? "border-indigo-600 shadow-lg shadow-indigo-100" : "border-slate-200"}`}>
                        <img src={img.preview} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />

                        {/* Primary badge */}
                        {img.isPrimary && (
                          <div className="absolute top-1.5 left-1.5 bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                            COVER
                          </div>
                        )}

                        {/* Overlay actions */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {!img.isPrimary && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setPrimary(i); }}
                              className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700"
                              title="Set as cover"
                            >
                              <Star size={14} />
                            </button>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                            className="w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600"
                            title="Remove"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add more */}
                    {images.length < 8 && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30 flex flex-col items-center justify-center gap-1 transition-all"
                      >
                        <ImagePlus size={20} className="text-slate-400" />
                        <span className="text-[10px] text-slate-400 font-bold">Add more</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-900 mb-1">Product Details</h2>
                <p className="text-xs text-slate-500">Describe your item clearly to attract buyers.</p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="e.g. iPhone 15 Pro 128GB – Like New Condition"
                  maxLength={150}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm font-semibold text-slate-800 outline-none focus:bg-white transition-all ${errors.title ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-indigo-500"}`}
                />
                <div className="flex justify-between mt-1">
                  {errors.title ? (
                    <p className="text-xs text-rose-500 font-bold flex items-center gap-1"><AlertCircle size={12} />{errors.title}</p>
                  ) : <span />}
                  <span className="text-[11px] text-slate-400">{form.title.length}/150</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Describe the product condition, history, included accessories, and any relevant details..."
                  rows={6}
                  maxLength={3000}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm font-semibold text-slate-800 outline-none focus:bg-white transition-all resize-none ${errors.description ? "border-rose-400" : "border-slate-200 focus:border-indigo-500"}`}
                />
                <div className="flex justify-between mt-1">
                  {errors.description ? (
                    <p className="text-xs text-rose-500 font-bold flex items-center gap-1"><AlertCircle size={12} />{errors.description}</p>
                  ) : <span />}
                  <span className="text-[11px] text-slate-400">{form.description.length}/3000</span>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-2 uppercase tracking-wide">
                  Category <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleChange("category", cat.id)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        form.category === cat.id
                          ? "border-indigo-600 bg-indigo-50 shadow-sm"
                          : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-lg block mb-1">{cat.icon}</span>
                      <span className={`text-[10px] font-black ${form.category === cat.id ? "text-indigo-600" : "text-slate-600"}`}>
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
                {errors.category && <p className="text-xs text-rose-500 font-bold mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.category}</p>}
              </div>

              {/* Condition */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-2 uppercase tracking-wide">
                  Condition <span className="text-rose-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {CONDITIONS.map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => handleChange("condition", cond)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                        form.condition === cond
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
                {errors.condition && <p className="text-xs text-rose-500 font-bold mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.condition}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Pricing & Location */}
          {step === 3 && (
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-900 mb-1">Pricing & Location</h2>
                <p className="text-xs text-slate-500">Set your price and tell buyers where you are.</p>
              </div>

              {/* Price Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Selling Price (৳) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                      placeholder="0"
                      min={0}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-2xl text-sm font-black text-slate-800 outline-none focus:bg-white transition-all ${errors.price ? "border-rose-400" : "border-slate-200 focus:border-indigo-500"}`}
                    />
                  </div>
                  {errors.price && <p className="text-xs text-rose-500 font-bold mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Original Price (৳) <span className="text-slate-400 font-medium normal-case">(optional)</span>
                  </label>
                  <div className="relative">
                    <DollarSign size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      value={form.originalPrice}
                      onChange={(e) => handleChange("originalPrice", e.target.value)}
                      placeholder="Market / retail price"
                      min={0}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Stock & Negotiable */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => handleChange("stock", e.target.value)}
                    min={1}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Price Negotiable?
                  </label>
                  <div className="flex gap-3">
                    {[true, false].map((val) => (
                      <button
                        key={String(val)}
                        type="button"
                        onClick={() => handleChange("negotiable", val)}
                        className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${
                          form.negotiable === val
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {val ? "Yes" : "No"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Your City <span className="text-rose-500">*</span>
                </label>
                <select
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm font-semibold text-slate-800 outline-none focus:bg-white transition-all cursor-pointer ${errors.city ? "border-rose-400" : "border-slate-200 focus:border-indigo-500"}`}
                >
                  <option value="">Select your city</option>
                  {BD_CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && <p className="text-xs text-rose-500 font-bold mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.city}</p>}
              </div>

              {/* Meetup Preference */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-2 uppercase tracking-wide">
                  Meetup Preference
                </label>
                <div className="flex gap-3">
                  {MEETUP_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleChange("meetupPreference", opt)}
                      className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${
                        form.meetupPreference === opt
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Tags <span className="text-slate-400 font-medium normal-case">(optional, comma separated)</span>
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => handleChange("tags", e.target.value)}
                  placeholder="e.g. apple, smartphone, 5g, unlocked"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                />
                <p className="text-[11px] text-slate-400 mt-1">Tags help buyers discover your listing</p>
              </div>

              {/* Preview summary */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
                <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-3">Listing Preview</h3>
                <div className="flex gap-4">
                  {images[0] && (
                    <img src={images[0].preview} alt="cover" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-black text-slate-900 line-clamp-2">{form.title || "Your product title"}</p>
                    <p className="text-xs text-indigo-600 font-bold mt-0.5">{form.category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {form.price && <span className="text-sm font-black text-slate-900">৳ {Number(form.price).toLocaleString()}</span>}
                      {form.originalPrice && <span className="text-xs text-slate-400 line-through">৳ {Number(form.originalPrice).toLocaleString()}</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Footer */}
          <div className="px-6 sm:px-8 pb-8 pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} /> Back
            </button>

            <div className="flex items-center gap-1.5">
              {STEPS.map((s) => (
                <div
                  key={s.id}
                  className={`w-2 h-2 rounded-full transition-all ${
                    s.id === step ? "bg-indigo-600 w-5" : s.id < step ? "bg-emerald-400" : "bg-slate-300"
                  }`}
                />
              ))}
            </div>

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn-shiny-primary flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs shadow-md"
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-shiny-amber flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs shadow-md disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Publishing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} /> Publish Listing
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AddProductPage() {
  return (
    <ProtectedRoute>
      <AddProductContent />
    </ProtectedRoute>
  );
}
