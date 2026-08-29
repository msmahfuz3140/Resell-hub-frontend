"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User, Mail, Phone, MapPin, Camera, Save, ArrowLeft, Shield,
  Bell, Eye, Lock, Trash2, Loader2, Key, Globe, CreditCard,
  Monitor, Smartphone, Download, AlertTriangle, CheckCircle2,
  Sun, Moon, Languages, Wifi, BellOff, ShieldCheck, LogOut,
  Package, RefreshCw, Star, ChevronRight, Clock, Palette,
  UserCheck, Activity, QrCode, Fingerprint, Zap, MessageSquare
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

type TabId = "profile" | "security" | "notifications" | "appearance" | "billing" | "data";

const TABS: { id: TabId; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield, badge: "!" },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "billing", label: "Billing & Plan", icon: CreditCard },
  { id: "data", label: "Data & Privacy", icon: Download },
];

const ACTIVE_SESSIONS = [
  { device: "Chrome on Windows", location: "Dhaka, Bangladesh", time: "Now", current: true, icon: Monitor },
  { device: "Safari on iPhone", location: "Dhaka, Bangladesh", time: "2 hours ago", current: false, icon: Smartphone },
  { device: "Firefox on Ubuntu", location: "Chittagong, Bangladesh", time: "3 days ago", current: false, icon: Monitor },
];

const NOTIFICATION_GROUPS = [
  {
    group: "Transaction Alerts",
    items: [
      { id: "order_updates", label: "Order Updates", desc: "Status changes on your orders", enabled: true, priority: "high" },
      { id: "payment_received", label: "Payment Received", desc: "When buyers send payments", enabled: true, priority: "high" },
      { id: "escrow_release", label: "Escrow Release", desc: "When funds are released to you", enabled: true, priority: "high" },
    ]
  },
  {
    group: "Communication",
    items: [
      { id: "new_messages", label: "New Messages", desc: "Chat messages from buyers/sellers", enabled: true, priority: "medium" },
      { id: "offer_received", label: "Offer Received", desc: "When someone makes an offer", enabled: true, priority: "medium" },
      { id: "review_received", label: "New Review", desc: "When buyers leave a review", enabled: true, priority: "low" },
    ]
  },
  {
    group: "Marketplace",
    items: [
      { id: "price_drop", label: "Price Drop Alerts", desc: "Wishlisted items drop in price", enabled: false, priority: "low" },
      { id: "similar_listing", label: "Similar Listings", desc: "When similar items are listed", enabled: false, priority: "low" },
      { id: "promotional", label: "Promotions & Offers", desc: "Special deals and discounts", enabled: false, priority: "low" },
      { id: "weekly_digest", label: "Weekly Digest", desc: "Summary of marketplace activity", enabled: true, priority: "low" },
    ]
  },
];

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative w-10 h-6 rounded-full transition-colors duration-200 cursor-pointer focus:outline-none ${enabled ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"}`}
    >
      <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${enabled ? "translate-x-4" : "translate-x-0"}`} />
    </button>
  );
}

function SettingsContent() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [isSaving, setIsSaving] = useState(false);

  // Profile
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [city, setCity] = useState(user?.location?.city || "Dhaka");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [language, setLanguage] = useState("English");
  const [currency, setCurrency] = useState("BDT (৳)");

  // Notifications state
  const [notifs, setNotifs] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    NOTIFICATION_GROUPS.forEach(g => g.items.forEach(i => { init[i.id] = i.enabled; }));
    return init;
  });

  // Security
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [twoFaEnabled, setTwoFaEnabled] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 900));
    toast.success("Profile updated successfully ✅");
    setIsSaving(false);
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully. See you soon! 👋");
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-8 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/profile" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-4 transition-colors">
            <ArrowLeft size={15} /> Back to Profile
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Account Settings</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your account, privacy, and preferences</p>
            </div>
            {isSaving && (
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <Loader2 size={14} className="animate-spin" /> Saving...
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 space-y-1 sticky top-24">
              {/* User mini card */}
              <div className="flex items-center gap-3 p-3 mb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-sm overflow-hidden shrink-0">
                  {user?.photo?.url ? <img src={user.photo.url} alt="" className="w-full h-full object-cover" /> : user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-900 dark:text-white truncate">{user?.name}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>

              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === tab.id ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                >
                  <span className="flex items-center gap-2.5"><tab.icon size={15} />{tab.label}</span>
                  {tab.badge && activeTab !== tab.id && (
                    <span className="w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">{tab.badge}</span>
                  )}
                </button>
              ))}

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
                <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer">
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }} className="space-y-6">

                {/* ──── PROFILE TAB ──── */}
                {activeTab === "profile" && (
                  <>
                    {/* Avatar + Cover */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                      <div className="h-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 relative">
                        <button className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-black/30 hover:bg-black/50 text-white text-[11px] font-bold rounded-xl backdrop-blur-sm cursor-pointer transition-all">
                          <Camera size={11} /> Change Cover
                        </button>
                      </div>
                      <div className="px-6 pb-5 -mt-8 flex items-end gap-4">
                        <div className="relative shrink-0">
                          <div className="w-16 h-16 rounded-xl bg-white dark:bg-slate-800 p-1 shadow-lg ring-2 ring-white dark:ring-slate-900">
                            <div className="w-full h-full rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-lg font-black overflow-hidden">
                              {user?.photo?.url ? <img src={user.photo.url} alt="" className="w-full h-full object-cover" /> : user?.name?.[0]?.toUpperCase() || "U"}
                            </div>
                          </div>
                          <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center shadow cursor-pointer transition-colors">
                            <Camera size={11} />
                          </button>
                        </div>
                        <div className="pb-1">
                          <h2 className="font-black text-slate-900 dark:text-white">{user?.name}</h2>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60">
                            {user?.role} Account
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Personal Info */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <UserCheck size={15} className="text-indigo-600 dark:text-indigo-400" /> Personal Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { label: "Full Name", value: name, onChange: setName, icon: User, type: "text", placeholder: "Your full name" },
                          { label: "Email (read-only)", value: user?.email || "", onChange: () => {}, icon: Mail, type: "email", placeholder: "", readOnly: true },
                          { label: "Phone Number", value: phone, onChange: setPhone, icon: Phone, type: "text", placeholder: "+880 1XXX-XXXXXX" },
                          { label: "City / Location", value: city, onChange: setCity, icon: MapPin, type: "text", placeholder: "Your city" },
                        ].map((field) => (
                          <div key={field.label}>
                            <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">{field.label}</label>
                            <div className="relative">
                              <field.icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input
                                type={field.type}
                                value={field.value}
                                onChange={(e) => !field.readOnly && field.onChange(e.target.value)}
                                placeholder={field.placeholder}
                                readOnly={field.readOnly}
                                className={`w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm font-semibold outline-none transition-all ${field.readOnly ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed" : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:border-indigo-500 dark:focus:border-indigo-500"}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">Bio</label>
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows={3}
                          placeholder="Tell buyers about yourself, your specialty, and what you sell..."
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 resize-none"
                        />
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <Globe size={15} className="text-indigo-600 dark:text-indigo-400" /> Social & Web Presence
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { label: "Website URL", value: website, onChange: setWebsite, placeholder: "https://yourwebsite.com", prefix: "🌐" },
                          { label: "Twitter / X Handle", value: twitter, onChange: setTwitter, placeholder: "@username", prefix: "𝕏" },
                        ].map((f) => (
                          <div key={f.label}>
                            <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">{f.label}</label>
                            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800/60 focus-within:border-indigo-500 dark:focus-within:border-indigo-500 transition-all">
                              <span className="px-3 text-sm text-slate-400 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">{f.prefix}</span>
                              <input type="text" value={f.value} onChange={e => f.onChange(e.target.value)} placeholder={f.placeholder} className="flex-1 px-3 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200 bg-transparent outline-none" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Preferences */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <Languages size={15} className="text-indigo-600 dark:text-indigo-400" /> Regional Preferences
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">Language</label>
                          <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500">
                            <option>English</option>
                            <option>বাংলা (Bengali)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">Currency</label>
                          <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500">
                            <option>BDT (৳)</option>
                            <option>USD ($)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <button onClick={handleSaveProfile} disabled={isSaving} className="btn-shiny-primary px-8 py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md disabled:opacity-70 cursor-pointer">
                      {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      {isSaving ? "Saving..." : "Save All Changes"}
                    </button>
                  </>
                )}

                {/* ──── SECURITY TAB ──── */}
                {activeTab === "security" && (
                  <>
                    {/* Status Overview */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 mb-4 flex items-center gap-2">
                        <Activity size={15} className="text-indigo-600 dark:text-indigo-400" /> Security Overview
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: "Account Status", value: "Secure", icon: ShieldCheck, color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60" },
                          { label: "2FA", value: twoFaEnabled ? "On" : "Off", icon: Fingerprint, color: twoFaEnabled ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60" : "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60" },
                          { label: "Password", value: "Strong", icon: Key, color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60" },
                          { label: "Sessions", value: "3 Active", icon: Monitor, color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60" },
                        ].map((s) => (
                          <div key={s.label} className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-4 text-center">
                            <div className={`w-8 h-8 rounded-xl mx-auto flex items-center justify-center mb-2 ${s.color}`}>
                              <s.icon size={14} />
                            </div>
                            <div className="text-sm font-black text-slate-900 dark:text-white">{s.value}</div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">{s.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Change Password */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <Key size={15} className="text-indigo-600 dark:text-indigo-400" /> Change Password
                      </h3>
                      {["Current Password", "New Password", "Confirm New Password"].map((label) => (
                        <div key={label}>
                          <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">{label}</label>
                          <div className="relative">
                            <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="password" placeholder="••••••••" className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500" />
                          </div>
                        </div>
                      ))}
                      <button onClick={() => toast.success("Password updated successfully!")} className="btn-shiny-primary px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer">
                        <Key size={13} /> Update Password
                      </button>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <QrCode size={15} className="text-indigo-600 dark:text-indigo-400" /> Two-Factor Authentication
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">Add an extra layer of security. Enable 2FA with an authenticator app or SMS.</p>
                        </div>
                        <Toggle enabled={twoFaEnabled} onToggle={() => { setTwoFaEnabled(!twoFaEnabled); toast.info(twoFaEnabled ? "2FA disabled" : "2FA enabled — scan QR code in your authenticator app"); }} />
                      </div>
                      {twoFaEnabled && (
                        <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-800/60 flex items-center gap-3">
                          <QrCode size={40} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-indigo-800 dark:text-indigo-300">Scan this QR code with Google Authenticator</p>
                            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5">Or manually enter: JBSWY3DPEHPK3PXP</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Active Sessions */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <Wifi size={15} className="text-indigo-600 dark:text-indigo-400" /> Active Sessions
                        </h3>
                        <button onClick={() => toast.info("All other sessions terminated")} className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 transition-colors cursor-pointer">
                          Revoke All Others
                        </button>
                      </div>
                      <div className="space-y-3">
                        {ACTIVE_SESSIONS.map((s) => (
                          <div key={s.device} className={`flex items-center justify-between p-3 rounded-xl border ${s.current ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60" : "bg-slate-50 dark:bg-slate-800/60 border-slate-100 dark:border-slate-700/60"}`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.current ? "bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400" : "bg-slate-200 dark:bg-slate-700 text-slate-500"}`}>
                                <s.icon size={16} />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-900 dark:text-white">{s.device} {s.current && <span className="ml-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">Current</span>}</p>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500">{s.location} · {s.time}</p>
                              </div>
                            </div>
                            {!s.current && (
                              <button onClick={() => toast.info("Session revoked")} className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer">Revoke</button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-800/60 p-6 shadow-sm space-y-4">
                      <h3 className="text-sm font-black text-rose-600 dark:text-rose-400 pb-3 border-b border-rose-100 dark:border-rose-800/40 flex items-center gap-2">
                        <AlertTriangle size={15} /> Danger Zone
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">These actions are irreversible. Please proceed with caution.</p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button onClick={() => toast.info("Account deactivation request submitted")} className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs font-bold transition-all cursor-pointer">
                          <BellOff size={14} /> Deactivate Account
                        </button>
                        <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 rounded-xl text-xs font-bold transition-all cursor-pointer">
                          <Trash2 size={14} /> Delete Account
                        </button>
                      </div>
                      {showDeleteConfirm && (
                        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl space-y-3">
                          <p className="text-xs font-bold text-rose-700 dark:text-rose-300">Are you absolutely sure? All your data, listings, and transaction history will be permanently deleted.</p>
                          <div className="flex gap-2">
                            <button onClick={() => { toast.error("Account deletion confirmed. You will receive a confirmation email."); setShowDeleteConfirm(false); }} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-black cursor-pointer">Yes, Delete Everything</button>
                            <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold cursor-pointer">Cancel</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* ──── NOTIFICATIONS TAB ──── */}
                {activeTab === "notifications" && (
                  <>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-2">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <Bell size={15} className="text-indigo-600 dark:text-indigo-400" /> Notification Channels
                        </h3>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        {[
                          { label: "Push", icon: Zap, enabled: true },
                          { label: "Email", icon: Mail, enabled: true },
                          { label: "SMS", icon: Smartphone, enabled: false },
                        ].map(ch => (
                          <div key={ch.label} className={`p-4 rounded-xl border text-center transition-all ${ch.enabled ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800/60" : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"}`}>
                            <ch.icon size={20} className={`mx-auto mb-2 ${ch.enabled ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`} />
                            <p className={`text-xs font-black ${ch.enabled ? "text-indigo-700 dark:text-indigo-300" : "text-slate-500 dark:text-slate-400"}`}>{ch.label}</p>
                            <p className={`text-[10px] font-bold mt-0.5 ${ch.enabled ? "text-indigo-500" : "text-slate-400"}`}>{ch.enabled ? "Active" : "Disabled"}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {NOTIFICATION_GROUPS.map((group) => (
                      <div key={group.group} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-1">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 mb-2">{group.group}</h3>
                        {group.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between py-3 border-b border-slate-50 dark:border-slate-800/60 last:border-0">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.label}</h4>
                                {item.priority === "high" && <span className="text-[9px] font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded uppercase">High</span>}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.desc}</p>
                            </div>
                            <Toggle enabled={notifs[item.id]} onToggle={() => setNotifs(prev => ({ ...prev, [item.id]: !prev[item.id] }))} />
                          </div>
                        ))}
                      </div>
                    ))}
                  </>
                )}

                {/* ──── APPEARANCE TAB ──── */}
                {activeTab === "appearance" && (
                  <>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <Palette size={15} className="text-indigo-600 dark:text-indigo-400" /> Theme & Display
                      </h3>
                      <div>
                        <p className="text-[11px] font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3">Color Mode</p>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: "Light", icon: Sun, active: !isDark },
                            { label: "Dark", icon: Moon, active: isDark },
                            { label: "System", icon: Monitor, active: false },
                          ].map((opt) => (
                            <button
                              key={opt.label}
                              onClick={() => { if ((opt.label === "Dark" && !isDark) || (opt.label === "Light" && isDark)) toggleTheme(); }}
                              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${opt.active ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60" : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-600"}`}
                            >
                              <opt.icon size={20} className={opt.active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"} />
                              <span className={`text-xs font-bold ${opt.active ? "text-indigo-700 dark:text-indigo-300" : "text-slate-500 dark:text-slate-400"}`}>{opt.label}</span>
                              {opt.active && <CheckCircle2 size={12} className="text-indigo-600 dark:text-indigo-400" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-[11px] font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3">Accent Color</p>
                        <div className="flex gap-3">
                          {["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"].map((color) => (
                            <button key={color} style={{ backgroundColor: color }} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 shadow-md hover:scale-110 transition-transform cursor-pointer ring-2 ring-offset-1 ring-transparent hover:ring-current" />
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-[11px] font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3">Font Size</p>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-slate-400">A</span>
                          <input type="range" min={12} max={18} defaultValue={14} className="flex-1 accent-indigo-600" />
                          <span className="text-base text-slate-400">A</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <Monitor size={15} className="text-indigo-600 dark:text-indigo-400" /> Display Preferences
                      </h3>
                      {[
                        { label: "Compact Mode", desc: "Reduce spacing and show more content", enabled: false },
                        { label: "Animations", desc: "Enable smooth transitions and animations", enabled: true },
                        { label: "Show Price in BDT", desc: "Display all prices in Bangladeshi Taka", enabled: true },
                        { label: "Show Online Status", desc: "Let others see when you are online", enabled: true },
                      ].map((pref) => (
                        <div key={pref.label} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800/60 last:border-0">
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{pref.label}</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">{pref.desc}</p>
                          </div>
                          <Toggle enabled={pref.enabled} onToggle={() => toast.info(`${pref.label} toggled`)} />
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* ──── BILLING TAB ──── */}
                {activeTab === "billing" && (
                  <>
                    {/* Current Plan */}
                    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-500/20">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-200">Current Plan</span>
                          <h3 className="text-2xl font-black mt-1">Free Starter</h3>
                          <p className="text-sm text-indigo-200 mt-1">You are on the free plan. Upgrade to unlock premium features.</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                          <Star size={22} className="text-amber-300" fill="currentColor" />
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-3">
                        {[
                          { label: "Active Listings", used: 3, max: 5 },
                          { label: "Monthly Sales", used: 12, max: 20 },
                          { label: "Storage Used", used: 45, max: 100, unit: "MB" },
                        ].map((u) => (
                          <div key={u.label} className="bg-white/10 rounded-xl p-3">
                            <p className="text-[10px] font-bold text-indigo-200 mb-1">{u.label}</p>
                            <p className="text-sm font-black">{u.used}/{u.max}{u.unit || ""}</p>
                            <div className="w-full h-1 bg-white/20 rounded-full mt-1.5 overflow-hidden">
                              <div className="h-full bg-white rounded-full" style={{ width: `${(u.used / u.max) * 100}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Upgrade Plans */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">Choose Your Plan</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { name: "Starter", price: "Free", color: "border-slate-200 dark:border-slate-700", active: true, features: ["5 Active Listings", "20 Sales/month", "Basic Analytics", "Standard Support"] },
                          { name: "Pro Seller", price: "৳499/mo", color: "border-indigo-500 ring-2 ring-indigo-500/20", active: false, popular: true, features: ["Unlimited Listings", "Unlimited Sales", "Advanced Analytics", "Priority Support", "Featured Listings", "Verified Badge"] },
                          { name: "Business", price: "৳999/mo", color: "border-purple-500 ring-2 ring-purple-500/20", active: false, features: ["Everything in Pro", "API Access", "Dedicated Manager", "Custom Branding", "Bulk Import", "White-label"] },
                        ].map((plan) => (
                          <div key={plan.name} className={`rounded-xl border-2 p-5 relative ${plan.color} ${plan.active ? "bg-slate-50 dark:bg-slate-800/60" : "bg-white dark:bg-slate-900"}`}>
                            {plan.popular && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-black text-white bg-indigo-600 px-3 py-0.5 rounded-full">Most Popular</span>}
                            <h4 className="font-black text-slate-900 dark:text-white text-sm">{plan.name}</h4>
                            <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1 mb-3">{plan.price}</p>
                            <ul className="space-y-1.5 mb-4">
                              {plan.features.map((f) => (
                                <li key={f} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 font-semibold">
                                  <CheckCircle2 size={11} className="text-emerald-500 shrink-0" /> {f}
                                </li>
                              ))}
                            </ul>
                            <button onClick={() => toast.info(`Upgrade to ${plan.name} coming soon!`)} className={`w-full py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${plan.active ? "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-default" : "btn-shiny-primary"}`} disabled={plan.active}>
                              {plan.active ? "Current Plan" : "Upgrade Now"}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <CreditCard size={15} className="text-indigo-600 dark:text-indigo-400" /> Payment Methods
                      </h3>
                      <div className="flex flex-col gap-3">
                        {[
                          { method: "Visa ending in 4242", type: "Visa", expiry: "12/26", default: true },
                          { method: "bKash (+880 17XX XXXXXX)", type: "bKash", expiry: "Active", default: false },
                        ].map((pm) => (
                          <div key={pm.method} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-7 bg-gradient-to-r from-slate-700 to-slate-900 rounded-md flex items-center justify-center">
                                <CreditCard size={14} className="text-white" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-900 dark:text-white">{pm.method}</p>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500">Expires {pm.expiry}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {pm.default && <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">Default</span>}
                              <button onClick={() => toast.info("Removed payment method")} className="text-[11px] font-bold text-rose-500 hover:underline cursor-pointer">Remove</button>
                            </div>
                          </div>
                        ))}
                        <button onClick={() => toast.info("Add payment method — coming soon!")} className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer">
                          <CreditCard size={14} /> Add Payment Method
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* ──── DATA & PRIVACY TAB ──── */}
                {activeTab === "data" && (
                  <>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <Eye size={15} className="text-indigo-600 dark:text-indigo-400" /> Privacy Controls
                      </h3>
                      {[
                        { label: "Profile Visibility", desc: "Who can see your profile information", value: "Public", options: ["Public", "Private", "Buyers Only"] },
                        { label: "Contact Info Visibility", desc: "Who can see your phone number and email", value: "After Purchase", options: ["Everyone", "After Purchase", "Nobody"] },
                        { label: "Online Status", desc: "Show when you were last active", value: "Everyone", options: ["Everyone", "Nobody"] },
                      ].map((p) => (
                        <div key={p.label} className="flex items-center justify-between py-3 border-b border-slate-50 dark:border-slate-800/60 last:border-0">
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{p.label}</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">{p.desc}</p>
                          </div>
                          <select defaultValue={p.value} className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 px-2.5 py-1 rounded-lg outline-none cursor-pointer">
                            {p.options.map(o => <option key={o}>{o}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <Download size={15} className="text-indigo-600 dark:text-indigo-400" /> Your Data
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Download a copy of all your data including profile, listings, messages, and transaction history.</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { label: "Export Profile Data", desc: "JSON / CSV format", icon: User },
                          { label: "Export Listings", desc: "All your listings", icon: Package },
                          { label: "Export Transactions", desc: "Purchase & sales history", icon: CreditCard },
                          { label: "Export Messages", desc: "Chat history archive", icon: MessageSquare },
                        ].map((e) => (
                          <button key={e.label} onClick={() => toast.info(`Preparing ${e.label}...`)} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all text-left cursor-pointer group">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                              <e.icon size={14} />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-slate-900 dark:text-white">{e.label}</p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500">{e.desc}</p>
                            </div>
                            <Download size={13} className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0 transition-colors" />
                          </button>
                        ))}
                      </div>
                      <button onClick={() => toast.info("Full account export request submitted. You will receive a download link via email within 24 hours.")} className="flex items-center gap-2 px-5 py-2.5 btn-shiny-primary rounded-xl text-xs font-black cursor-pointer">
                        <Download size={13} /> Request Full Data Export
                      </button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <RefreshCw size={15} className="text-indigo-600 dark:text-indigo-400" /> Data Preferences
                      </h3>
                      {[
                        { label: "Personalized Recommendations", desc: "Use my data to suggest relevant listings", enabled: true },
                        { label: "Analytics Tracking", desc: "Help improve ReSell Hub with usage data", enabled: true },
                        { label: "Cookie Preferences", desc: "Allow third-party cookies for better experience", enabled: false },
                      ].map((p) => (
                        <div key={p.label} className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-800/60 last:border-0">
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{p.label}</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">{p.desc}</p>
                          </div>
                          <Toggle enabled={p.enabled} onToggle={() => toast.info(`${p.label} preference updated`)} />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}



export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
