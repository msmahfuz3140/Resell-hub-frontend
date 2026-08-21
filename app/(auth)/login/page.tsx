"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, ShoppingBag, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// ─── Validation Schema ────────────────────────────
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ─── Google SVG ───────────────────────────────────
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

// ─── Animation Variants ───────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  // ─── Submit ─────────────────────────────────────
  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success("Welcome back! 👋");
      router.push(callbackUrl);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    }
  };

  // ─── Google Login ────────────────────────────────
  const handleGoogleLogin = async () => {
    toast.info("Google login — configure your Google Client ID in .env.local");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        background: "var(--bg-secondary)",
      }}
      className="auth-page"
    >
      {/* ── Left Panel ── */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6366f1 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem",
          position: "relative",
          overflow: "hidden",
        }}
        className="auth-left-panel"
      >
        {/* Background orbs */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
          }}
        />

        <div style={{ position: "relative", textAlign: "center", color: "white" }}>
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            style={{
              width: "80px",
              height: "80px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 2rem",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <ShoppingBag size={40} />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem" }}
          >
            ReSell Hub
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            style={{ fontSize: "1.125rem", opacity: 0.85, maxWidth: "320px", lineHeight: 1.6 }}
          >
            Bangladesh&apos;s trusted marketplace for buying and selling second-hand items.
          </motion.p>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            style={{
              display: "flex",
              gap: "2rem",
              marginTop: "3rem",
              justifyContent: "center",
            }}
          >
            {[
              { value: "50K+", label: "Listings" },
              { value: "25K+", label: "Users" },
              { value: "৳1M+", label: "Traded" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{stat.value}</div>
                <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Right Panel (Form) ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "white",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{ width: "100%", maxWidth: "420px" }}
        >
          {/* Header */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} style={{ marginBottom: "2rem" }}>
            <h1 style={{ fontSize: "1.875rem", fontWeight: 800, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
              Welcome back 👋
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>
              Sign in to your ReSell Hub account
            </p>
          </motion.div>

          {/* Google Button */}
          <motion.button
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              border: "1.5px solid var(--border-color)",
              borderRadius: "0.75rem",
              background: "white",
              cursor: "pointer",
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "1.5rem",
              transition: "all 0.2s",
            }}
          >
            <GoogleIcon />
            Continue with Google
          </motion.button>

          {/* Divider */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }} />
            <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }} />
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              style={{ marginBottom: "1rem" }}
            >
              <label
                htmlFor="email"
                style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--text-primary)" }}
              >
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={16}
                  style={{
                    position: "absolute",
                    left: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="input"
                  style={{
                    paddingLeft: "2.5rem",
                    borderColor: errors.email ? "#ef4444" : undefined,
                  }}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.375rem" }}>
                  {errors.email.message}
                </p>
              )}
            </motion.div>

            {/* Password */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={4}
              style={{ marginBottom: "0.75rem" }}
            >
              <label
                htmlFor="password"
                style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--text-primary)" }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={16}
                  style={{
                    position: "absolute",
                    left: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="input"
                  style={{
                    paddingLeft: "2.5rem",
                    paddingRight: "2.75rem",
                    borderColor: errors.password ? "#ef4444" : undefined,
                  }}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.375rem" }}>
                  {errors.password.message}
                </p>
              )}
            </motion.div>

            {/* Forgot Password */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={5}
              style={{ textAlign: "right", marginBottom: "1.5rem" }}
            >
              <Link
                href="/forgot-password"
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-primary)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Forgot password?
              </Link>
            </motion.div>

            {/* Submit */}
            <motion.button
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={6}
              type="submit"
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { scale: 1.01 } : {}}
              whileTap={!isSubmitting ? { scale: 0.99 } : {}}
              style={{
                width: "100%",
                padding: "0.875rem",
                background: isSubmitting
                  ? "var(--text-muted)"
                  : "linear-gradient(135deg, #4f46e5, #6366f1)",
                color: "white",
                border: "none",
                borderRadius: "0.75rem",
                fontSize: "0.9375rem",
                fontWeight: 700,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                boxShadow: isSubmitting ? "none" : "0 4px 15px rgba(99,102,241,0.4)",
                transition: "all 0.2s",
              }}
            >
              {isSubmitting ? (
                <>
                  <span
                    style={{
                      width: "18px",
                      height: "18px",
                      border: "2px solid rgba(255,255,255,0.4)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* Register link */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={7}
            style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-secondary)", fontSize: "0.9375rem" }}
          >
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              style={{
                color: "var(--color-primary)",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Create one free
            </Link>
          </motion.p>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .auth-page {
            grid-template-columns: 1fr !important;
          }
          .auth-left-panel {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
