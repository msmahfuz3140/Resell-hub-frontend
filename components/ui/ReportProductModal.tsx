"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flag, X, AlertTriangle, ShieldCheck, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { reportService } from "@/services/reportService";
import { useAuth } from "@/contexts/AuthContext";
import type { Product } from "@/types";
import { useRouter } from "next/navigation";

interface ReportProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const REPORT_REASONS = [
  { id: "scam", label: "Scam or Fraudulent Activity", desc: "Suspicious seller behavior or requested off-platform advance payments" },
  { id: "counterfeit", label: "Counterfeit or Replica", desc: "Item claimed as original but appears fake or unauthorized copy" },
  { id: "inappropriate_content", label: "Inappropriate Images or Language", desc: "Explicit, offensive, or infringing media content" },
  { id: "wrong_category", label: "Wrong Category or Spam", desc: "Misleading category tags or duplicate spam listing" },
  { id: "prohibited_item", label: "Prohibited or Illegal Item", desc: "Restricted goods not allowed on ReSell Hub" },
  { id: "misleading_price", label: "Misleading or Fake Price", desc: "Price listed as 0 or wildly inaccurate to manipulate searches" },
  { id: "other", label: "Other Policy Violation", desc: "Other issues not covered in the categories above" },
];

export default function ReportProductModal({
  product,
  isOpen,
  onClose,
}: ReportProductModalProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [reason, setReason] = useState("scam");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to submit a product report.");
      router.push("/login");
      return;
    }

    if (!description.trim()) {
      toast.error("Please provide details explaining why you are reporting this listing.");
      return;
    }

    setIsSubmitting(true);
    try {
      await reportService.createReport({
        productId: product._id,
        reason,
        description: description.trim(),
      });
      setIsSubmitted(true);
      toast.success("Thank you. Report received for trust & safety review.");
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Report submission failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setDescription("");
    setReason("scam");
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 overflow-hidden my-8"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>

          {isSubmitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Report Submitted
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6 max-w-sm mx-auto">
                Our Trust & Safety moderators will investigate this listing for <strong>{product.title}</strong> within 24 hours.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="btn-shiny-primary px-6 py-2.5 rounded-xl font-bold text-xs uppercase"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-800">
                  <Flag size={20} />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    Report Listing
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {product.title}
                  </p>
                </div>
              </div>

              {/* Reason Selector */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Select Violation Reason
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {REPORT_REASONS.map((r) => (
                    <label
                      key={r.id}
                      className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                        reason === r.id
                          ? "bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200"
                          : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <input
                        type="radio"
                        name="reportReason"
                        value={r.id}
                        checked={reason === r.id}
                        onChange={(e) => setReason(e.target.value)}
                        className="mt-0.5 text-rose-600 focus:ring-rose-500"
                      />
                      <div className="text-xs">
                        <span className="font-bold block">{r.label}</span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5 block">
                          {r.desc}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Details Textarea */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Detailed Explanation <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide specific details (e.g. proof of counterfeit, seller requested outside bank transfer, duplicate images)..."
                  className="w-full text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500 outline-hidden"
                  required
                />
              </div>

              {/* Notice */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 flex items-start gap-2 text-[11px] text-amber-800 dark:text-amber-300">
                <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-600" />
                <span>
                  False reporting is a violation of Terms. All reports are logged with your user ID.
                </span>
              </div>

              {/* Submit / Cancel Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Flag size={14} />
                      <span>Submit Report</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
