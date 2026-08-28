"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  ArrowLeft,
  Shield,
  Bell,
  Eye,
  Lock,
  Trash2,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function SettingsContent() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "privacy" | "notifications">("profile");
  const [isSaving, setIsSaving] = useState(false);

  // Profile form
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [city, setCity] = useState(user?.location?.city || "Dhaka");

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Profile updated successfully! ✅");
    setIsSaving(false);
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion request submitted. You'll receive a confirmation email.");
  };

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "privacy" as const, label: "Privacy & Security", icon: Shield },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 mb-4 transition-colors"
          >
            <ArrowLeft size={15} /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 p-2 space-y-1 sticky top-24">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-9">
            {/* ─── Profile Tab ─── */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* Avatar Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-2xl font-black overflow-hidden">
                      {user?.photo?.url ? (
                        <img src={user.photo.url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        user?.name?.[0]?.toUpperCase() || "U"
                      )}
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-md hover:bg-indigo-700">
                      <Camera size={13} />
                    </button>
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900">{user?.name}</h2>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100 mt-2 inline-block">
                      {user?.role} Account
                    </span>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                  <h3 className="text-sm font-black text-slate-900 pb-3 border-b border-slate-100">Personal Information</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">Full Name</label>
                      <div className="relative">
                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">Email (read-only)</label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          value={email}
                          readOnly
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 cursor-not-allowed"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">Phone</label>
                      <div className="relative">
                        <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+880 1XXX-XXXXXX"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">City</label>
                      <div className="relative">
                        <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      placeholder="Tell buyers a bit about yourself..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="btn-shiny-primary px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md disabled:opacity-70"
                  >
                    {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {/* ─── Privacy Tab ─── */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                  <h3 className="text-sm font-black text-slate-900 pb-3 border-b border-slate-100">Privacy & Security</h3>

                  {[
                    { icon: Eye, title: "Profile Visibility", desc: "Control who can see your profile", value: "Public" },
                    { icon: Lock, title: "Two-Factor Authentication", desc: "Add extra security to your account", value: "Disabled" },
                    { icon: Shield, title: "Login Alerts", desc: "Get notified about new login attempts", value: "Enabled" },
                  ].map((item) => (
                    <div key={item.title} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                          <item.icon size={16} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                          <p className="text-[11px] text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-2xl border border-rose-200 p-6 space-y-4">
                  <h3 className="text-sm font-black text-rose-600 pb-3 border-b border-rose-100">Danger Zone</h3>
                  <p className="text-xs text-slate-500">Once you delete your account, there is no going back. Please be certain.</p>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition-all"
                  >
                    <Trash2 size={14} />
                    Delete My Account
                  </button>
                </div>
              </div>
            )}

            {/* ─── Notifications Tab ─── */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                <h3 className="text-sm font-black text-slate-900 pb-3 border-b border-slate-100">Notification Preferences</h3>

                {[
                  { title: "Order Updates", desc: "Get notified about order status changes", enabled: true },
                  { title: "New Messages", desc: "Receive alerts for new buyer/seller messages", enabled: true },
                  { title: "Price Drop Alerts", desc: "Get alerted when wishlisted items drop in price", enabled: false },
                  { title: "Promotional Emails", desc: "Receive special deals and offers", enabled: false },
                  { title: "Weekly Digest", desc: "Summary of marketplace activity", enabled: true },
                ].map((item) => (
                  <div key={item.title} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                      <p className="text-[11px] text-slate-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                ))}
              </div>
            )}
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
