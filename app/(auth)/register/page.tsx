"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ShoppingBag,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, "Must contain at least 1 letter and 1 number"),
  role: z.enum(["buyer", "seller"]),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

function RegisterContent() {
  const { register: authRegister, googleLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "buyer" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormData) => {
    await authRegister({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    });
    toast.success("Account created! Welcome to ReSell Hub 🎉");
    window.location.href = "/dashboard";
  };

  const handleGoogleClick = async () => {
    setIsGoogleLoading(true);
    await googleLogin();
    toast.success("Signed up with Google! 🎉");
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-900">
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white relative overflow-hidden border-r border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

        <Link href="/" className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <ShoppingBag size={22} className="text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight">
            ReSell<span className="text-indigo-400">Hub</span>
          </span>
        </Link>

        <div className="space-y-6 relative z-10">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Why Join the Hub?</span>
            <h2 className="text-3xl font-black leading-tight text-white">
              Buy & Sell second-hand items with complete confidence.
            </h2>
          </div>
          <div className="space-y-3 pt-2">
            {[
              "100% Escrow Protection on purchases",
              "0% listing fee on your first 3 posted ads",
              "Direct buyer-seller in-app chat",
              "Verified identity badges & trusted seller reviews",
            ].map((perk) => (
              <div key={perk} className="flex items-center gap-3 text-xs font-bold text-slate-200">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">✓</span>
                <span>{perk}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-400 relative z-10">© {new Date().getFullYear()} ReSell Hub. All rights reserved.</p>
      </div>

      {/* ── Right Form ── */}
      <div className="lg:col-span-7 bg-slate-50 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl space-y-6"
        >
          <div>
            <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-widest">
              Create Account
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">Join ReSell Hub Free</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Already have an account?{" "}
              <Link href="/login" className="font-extrabold text-indigo-600 hover:text-indigo-800">Sign in here</Link>
            </p>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={isGoogleLoading}
            className="w-full py-3.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-3 transition-all shadow-xs hover:border-slate-300"
          >
            {isGoogleLoading ? <Loader2 size={16} className="animate-spin text-indigo-600" /> : <GoogleIcon />}
            <span>Sign up with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider relative">Or with Details</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Role */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">I want to:</label>
              <div className="grid grid-cols-2 gap-2">
                {(["buyer", "seller"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setValue("role", r)}
                    className={`py-2.5 rounded-xl text-xs font-black transition-all border ${
                      selectedRole === r
                        ? r === "buyer"
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-indigo-600 text-white border-indigo-600"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {r === "buyer" ? "Buy Items" : "Sell Items"}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  {...register("name")}
                  placeholder="e.g. Mahfuzul Haque"
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:bg-white transition-all ${
                    errors.name ? "border-rose-400" : "border-slate-200 focus:border-indigo-500"
                  }`}
                />
              </div>
              {errors.name && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  {...register("email")}
                  placeholder="name@example.com"
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:bg-white transition-all ${
                    errors.email ? "border-rose-400" : "border-slate-200 focus:border-indigo-500"
                  }`}
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="At least 6 chars (letters & numbers)"
                  className={`w-full pl-11 pr-11 py-3 bg-slate-50 border rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:bg-white transition-all ${
                    errors.password ? "border-rose-400" : "border-slate-200 focus:border-indigo-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-shiny-primary py-3.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
            >
              {isSubmitting ? (
                <><Loader2 size={16} className="animate-spin" /> Creating Account...</>
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900" />}>
      <RegisterContent />
    </Suspense>
  );
}
