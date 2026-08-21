"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Headphones,
} from "lucide-react";
import { toast } from "sonner";

const FAQS = [
  {
    q: "How does payment protection work on ReSell Hub?",
    a: "When you buy using our online checkout, funds are held securely in escrow via Stripe until you meet the seller, inspect the product, and confirm satisfaction. Only then are funds released to the seller.",
  },
  {
    q: "Is it free to list products for sale?",
    a: "Yes! Listing standard items on ReSell Hub is 100% free with zero upfront charges. We only charge a nominal 2% service fee on completed escrow purchases.",
  },
  {
    q: "What should I do if a product is not as described?",
    a: "If you used Escrow payment, you can flag a dispute within 48 hours of delivery. Our customer safety team will freeze the payout, review evidence, and initiate a full refund if the item does not match.",
  },
  {
    q: "Where is ReSell Hub based in Bangladesh?",
    a: "Our headquarters is situated in Gulshan-1, Dhaka, with localized community safety representatives covering Chittagong, Sylhet, and major university hubs.",
  },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thank you! Your inquiry has been dispatched to our support team.");
      setName("");
      setEmail("");
      setMessage("");
    }, 1000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
            24/7 Assistance
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 mt-3 mb-4 tracking-tight">
            How Can We Assist You?
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">
            Have questions about an ad, escrow payment, or dispute? Our Dhaka-based support team is here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* ── Left Column: Contact Methods (5 Cols) ── */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                  <Headphones size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Direct Channels</h2>
                  <span className="text-xs text-indigo-300">Fast response guaranteed</span>
                </div>
              </div>

              <div className="space-y-4 pt-2 text-xs">
                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <Mail size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-indigo-300 font-bold block">Email Support</span>
                    <span className="text-sm font-bold text-white">support@resellhub.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <Phone size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-indigo-300 font-bold block">Helpline Number</span>
                    <span className="text-sm font-bold text-white">+880 1700-000000</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <MapPin size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-indigo-300 font-bold block">Headquarters</span>
                    <span className="text-xs font-semibold text-white leading-relaxed">
                      House 42, Road 11, Block D, Gulshan-1, Dhaka 1212
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <Clock size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-indigo-300 font-bold block">Support Availability</span>
                    <span className="text-xs font-semibold text-white">
                      Saturday – Thursday: 9:00 AM – 10:00 PM BST
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Chat prompt */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <MessageSquare size={22} />
                </div>
                <div>
                  <h4 className="font-black text-xs text-slate-900">Need Immediate Help?</h4>
                  <span className="text-[11px] text-slate-500 font-medium">Average chat reply: &lt; 5 minutes</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toast.info("Opening 24/7 Live Support widget...")}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition-colors"
              >
                Chat Now
              </button>
            </div>
          </div>

          {/* ── Right Column: Message Form (7 Cols) ── */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-1">Send us an Inquiry</h2>
            <p className="text-slate-500 text-xs sm:text-sm mb-8 font-normal">
              Our support team reviews each message and responds within 24 business hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mahfuzul Haque"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                  Subject Category
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                >
                  <option>General Inquiry & Questions</option>
                  <option>Escrow Payment & Payouts</option>
                  <option>Dispute / Defective Product Report</option>
                  <option>Seller Badge Verification</option>
                  <option>Partnership & Advertising</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide all relevant details, item IDs, or questions..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-shiny-primary w-full py-4 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
              >
                {isSubmitting ? (
                  <span>Sending inquiry...</span>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Submit Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* ── FAQ ACCORDION ── */}
        <div className="max-w-3xl mx-auto pt-10 border-t border-slate-200">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-500 text-xs mt-1">Instant answers to standard marketplace questions</p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-sm text-slate-900 flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? "rotate-180 text-indigo-600" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-50 pt-3 font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
