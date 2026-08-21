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
      toast.success("Thank you! Your message has been sent to support.");
      setName("");
      setEmail("");
      setMessage("");
    }, 1000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 mb-4 tracking-tight">
            We&apos;re Here to Help You
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">
            Have questions about a listing, payment, or partnership? Reach out to our 24/7 dedicated support team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          {/* ── Contact Info Cards (5 Cols) ── */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6">
              <h2 className="text-2xl font-bold">Contact Information</h2>
              <p className="text-indigo-200 text-xs sm:text-sm leading-relaxed">
                Connect directly with our team in Dhaka or drop us a query anytime.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-300 shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="text-xs text-indigo-300 block">Email Support</span>
                    <span className="text-sm font-semibold">support@resellhub.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-300 shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="text-xs text-indigo-300 block">Customer Helpline</span>
                    <span className="text-sm font-semibold">+880 1700-000000</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-300 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="text-xs text-indigo-300 block">Head Office</span>
                    <span className="text-sm font-semibold leading-relaxed">
                      House 42, Road 11, Block D, Gulshan-1, Dhaka 1212
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-300 shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="text-xs text-indigo-300 block">Support Hours</span>
                    <span className="text-sm font-semibold">
                      Saturday – Thursday: 9:00 AM – 10:00 PM
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Chat prompt */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Need Instant Help?</h4>
                  <span className="text-[11px] text-slate-500">Live chat average reply time: &lt; 5 mins</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toast.info("Opening Live Support chat widget...")}
                className="px-3.5 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Chat Now
              </button>
            </div>
          </div>

          {/* ── Contact Form (7 Cols) ── */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Send us a Message</h2>
            <p className="text-slate-500 text-xs sm:text-sm mb-6">
              Fill out the form below and a representative will get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mahfuzul Haque"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Subject Category
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:bg-white"
                >
                  <option>General Inquiry</option>
                  <option>Payment / Escrow Support</option>
                  <option>Report Fraud or Suspicious User</option>
                  <option>Seller Verification Request</option>
                  <option>Business Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue or feedback in detail..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full py-3.5 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Sending message...</span>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* ── FAQ Section ── */}
        <div className="max-w-3xl mx-auto pt-8 border-t border-slate-200">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-slate-500 text-xs mt-1">Quick answers to common inquiries</p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-sm text-slate-800 flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 shrink-0 transition-transform ${
                      openFaq === idx ? "rotate-180 text-indigo-600" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-50 pt-2">
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
