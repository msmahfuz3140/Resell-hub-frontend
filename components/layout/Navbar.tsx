"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Search, Bell, Heart, Menu, X,
  ChevronDown, User, Package, ShoppingCart,
  Settings, LogOut, Plus, LayoutDashboard,
  Home, Grid3X3, Tag,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// ─── Nav Links ────────────────────────────────────
const NAV_LINKS = [
  { href: "/",          label: "Home",       icon: Home },
  { href: "/listings",  label: "Products",   icon: Package },
  { href: "/categories",label: "Categories", icon: Grid3X3 },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Scroll detection ──────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Close dropdown on outside click ──────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Close mobile nav on route change ─────────
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    toast.success("Logged out successfully!");
    router.push("/");
  };

  // Is hero page (transparent navbar)
  const isHeroPage = pathname === "/";

  return (
    <>
      <nav
        className={`navbar ${scrolled || !isHeroPage ? "navbar-scrolled" : "navbar-transparent"}`}
      >
        <div className="container" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* ── Logo ── */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}>
            <div
              style={{
                width: "36px", height: "36px",
                background: "var(--gradient-primary)",
                borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px rgba(99,102,241,0.35)",
                flexShrink: 0,
              }}
            >
              <ShoppingBag size={20} color="white" strokeWidth={2.5} />
            </div>
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                color: scrolled || !isHeroPage ? "var(--text-primary)" : "white",
                transition: "color 0.2s",
              }}
            >
              ReSell<span style={{ color: "var(--color-primary)" }}>Hub</span>
            </span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`nav-link ${pathname === href ? "active" : ""}`}
                style={{
                  color: scrolled || !isHeroPage
                    ? pathname === href ? "var(--color-primary)" : "var(--text-secondary)"
                    : pathname === href ? "white" : "rgba(255,255,255,0.8)",
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* ── Right Controls ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>

            {/* Search */}
            <Link
              href="/listings"
              className="hide-mobile"
              style={{
                width: "38px", height: "38px", borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: scrolled || !isHeroPage ? "var(--bg-tertiary)" : "rgba(255,255,255,0.12)",
                border: "1px solid",
                borderColor: scrolled || !isHeroPage ? "var(--border-color)" : "rgba(255,255,255,0.15)",
                color: scrolled || !isHeroPage ? "var(--text-secondary)" : "rgba(255,255,255,0.85)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <Search size={17} />
            </Link>

            {isAuthenticated ? (
              <>
                {/* Wishlist */}
                <Link
                  href="/dashboard"
                  className="hide-mobile"
                  style={{
                    width: "38px", height: "38px", borderRadius: "10px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: scrolled || !isHeroPage ? "var(--bg-tertiary)" : "rgba(255,255,255,0.12)",
                    border: "1px solid",
                    borderColor: scrolled || !isHeroPage ? "var(--border-color)" : "rgba(255,255,255,0.15)",
                    color: scrolled || !isHeroPage ? "var(--text-secondary)" : "rgba(255,255,255,0.85)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <Heart size={17} />
                </Link>

                {/* User dropdown */}
                <div ref={dropdownRef} style={{ position: "relative" }}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.5rem",
                      padding: "0.375rem 0.625rem 0.375rem 0.375rem",
                      borderRadius: "10px",
                      background: scrolled || !isHeroPage ? "var(--bg-tertiary)" : "rgba(255,255,255,0.12)",
                      border: "1.5px solid",
                      borderColor: scrolled || !isHeroPage ? "var(--border-color)" : "rgba(255,255,255,0.2)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {/* Avatar */}
                    <div
                      style={{
                        width: "28px", height: "28px", borderRadius: "50%",
                        background: "var(--gradient-primary)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.75rem", fontWeight: 700, color: "white",
                        overflow: "hidden",
                      }}
                    >
                      {user?.photo?.url ? (
                        <img src={user.photo.url} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        user?.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span
                      className="hide-mobile"
                      style={{
                        fontSize: "0.875rem", fontWeight: 600,
                        color: scrolled || !isHeroPage ? "var(--text-primary)" : "white",
                        maxWidth: "80px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}
                    >
                      {user?.name?.split(" ")[0]}
                    </span>
                    <ChevronDown
                      size={14}
                      style={{
                        color: scrolled || !isHeroPage ? "var(--text-muted)" : "rgba(255,255,255,0.7)",
                        transform: dropdownOpen ? "rotate(180deg)" : "rotate(0)",
                        transition: "transform 0.2s",
                      }}
                    />
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        className="dropdown"
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                      >
                        {/* User info */}
                        <div style={{ padding: "0.875rem 1rem 0.75rem", borderBottom: "1px solid var(--border-color)" }}>
                          <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-primary)" }}>{user?.name}</div>
                          <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "0.125rem" }}>{user?.email}</div>
                          <div style={{ marginTop: "0.5rem" }}>
                            <span className="badge badge-primary" style={{ fontSize: "0.7rem" }}>
                              {user?.role?.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div style={{ padding: "0.375rem 0" }}>
                          <Link href="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                            <LayoutDashboard size={16} /> Dashboard
                          </Link>
                          <Link href="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                            <User size={16} /> My Profile
                          </Link>
                          <Link href="/my-orders" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                            <ShoppingCart size={16} /> My Orders
                          </Link>
                          {(user?.role === "seller" || user?.role === "admin") && (
                            <>
                              <div className="dropdown-divider" />
                              <Link href="/add-product" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                <Plus size={16} /> Add Listing
                              </Link>
                              <Link href="/my-products" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                <Package size={16} /> My Listings
                              </Link>
                            </>
                          )}
                          <div className="dropdown-divider" />
                          <Link href="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                            <Settings size={16} /> Settings
                          </Link>
                          <button className="dropdown-item danger" style={{ width: "100%", border: "none", background: "none", textAlign: "left" }} onClick={handleLogout}>
                            <LogOut size={16} /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              // Not logged in
              <div className="hide-mobile" style={{ display: "flex", gap: "0.5rem" }}>
                <Link
                  href="/login"
                  style={{
                    padding: "0.5rem 1.125rem",
                    borderRadius: "0.625rem",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: scrolled || !isHeroPage ? "var(--text-primary)" : "white",
                    transition: "all 0.2s",
                    border: "1.5px solid",
                    borderColor: scrolled || !isHeroPage ? "var(--border-color)" : "rgba(255,255,255,0.25)",
                    background: scrolled || !isHeroPage ? "transparent" : "rgba(255,255,255,0.08)",
                  }}
                >
                  Login
                </Link>
                <Link href="/register" className="btn btn-primary btn-sm">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="hide-tablet-up"
              style={{
                width: "38px", height: "38px", borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: scrolled || !isHeroPage ? "var(--bg-tertiary)" : "rgba(255,255,255,0.12)",
                border: "1px solid",
                borderColor: scrolled || !isHeroPage ? "var(--border-color)" : "rgba(255,255,255,0.2)",
                color: scrolled || !isHeroPage ? "var(--text-primary)" : "white",
                cursor: "pointer",
              }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Nav Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="mobile-nav open">
            <motion.div
              className="mobile-nav-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="mobile-nav-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              {/* Panel header */}
              <div style={{ padding: "1.25rem 1.25rem 1rem", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 800, fontSize: "1.125rem" }}>
                  ReSell<span style={{ color: "var(--color-primary)" }}>Hub</span>
                </span>
                <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}>
                  <X size={22} />
                </button>
              </div>

              {/* User info (if logged in) */}
              {isAuthenticated && (
                <div style={{ padding: "1rem 1.25rem", background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)" }}>
                  <div style={{ fontWeight: 700 }}>{user?.name}</div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{user?.email}</div>
                  <span className="badge badge-primary" style={{ marginTop: "0.375rem", fontSize: "0.7rem" }}>
                    {user?.role?.toUpperCase()}
                  </span>
                </div>
              )}

              {/* Nav items */}
              <nav style={{ padding: "0.75rem 0", flex: 1 }}>
                {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.875rem",
                      padding: "0.875rem 1.25rem",
                      color: pathname === href ? "var(--color-primary)" : "var(--text-primary)",
                      fontWeight: pathname === href ? 700 : 500,
                      fontSize: "0.9375rem",
                      background: pathname === href ? "var(--color-primary-50)" : "transparent",
                      transition: "all 0.15s",
                    }}
                  >
                    <Icon size={18} /> {label}
                  </Link>
                ))}

                {isAuthenticated && (
                  <>
                    <div className="divider" style={{ margin: "0.5rem 0" }} />
                    <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.875rem 1.25rem", color: "var(--text-primary)", fontWeight: 500, fontSize: "0.9375rem" }}>
                      <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link href="/my-orders" style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.875rem 1.25rem", color: "var(--text-primary)", fontWeight: 500, fontSize: "0.9375rem" }}>
                      <ShoppingCart size={18} /> My Orders
                    </Link>
                    {(user?.role === "seller" || user?.role === "admin") && (
                      <Link href="/add-product" style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.875rem 1.25rem", color: "var(--text-primary)", fontWeight: 500, fontSize: "0.9375rem" }}>
                        <Plus size={18} /> Add Listing
                      </Link>
                    )}
                  </>
                )}
              </nav>

              {/* Bottom actions */}
              <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid var(--border-color)" }}>
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                      gap: "0.5rem", padding: "0.75rem",
                      background: "rgba(239,68,68,0.08)", color: "var(--color-danger)",
                      border: "1.5px solid rgba(239,68,68,0.2)", borderRadius: "0.75rem",
                      fontWeight: 600, cursor: "pointer", fontSize: "0.9375rem",
                    }}
                  >
                    <LogOut size={18} /> Logout
                  </button>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                    <Link href="/login" className="btn btn-secondary" style={{ width: "100%", justifyContent: "center" }}>Login</Link>
                    <Link href="/register" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>Get Started Free</Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
