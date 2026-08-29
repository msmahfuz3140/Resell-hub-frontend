"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import type { User } from "@/types";
import authService from "@/services/authService";

// ─── Types ────────────────────────────────────────
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (partial: Partial<User>) => void;
}

// ─── Context ──────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Storage Keys ─────────────────────────────────
const TOKEN_KEY = "resellhub_token";
const USER_KEY = "resellhub_user";

function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem("accessToken", token);
}

function saveUser(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function getSavedUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getSavedToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem("accessToken");
}

function clearAll() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("accessToken");
  localStorage.removeItem(USER_KEY);
}

// ─── Helper: API call with 3-second timeout ───────
function withTimeout<T>(promise: Promise<T>, ms = 3000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), ms)
    ),
  ]);
}

// ─── Helper: Create a local demo user ─────────────
function createLocalUser(
  name: string,
  email: string,
  role: "buyer" | "seller" | "admin" = "buyer",
  provider: "local" | "google" = "local"
): User {
  return {
    _id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    email,
    role,
    provider,
    status: "active",
    location: { city: "Dhaka", country: "Bangladesh" },
    rating: { average: 4.9, count: 8 },
    totalSales: role === "seller" ? 12 : 0,
    totalPurchases: role === "buyer" ? 3 : 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ─── Provider ─────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef(false);

  // ── Init: restore session from localStorage INSTANTLY ──
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const savedUser = getSavedUser();
    const savedToken = getSavedToken();

    if (savedUser && savedToken) {
      // Instant restore — no API call needed to show the dashboard
      setUser(savedUser);
      setIsLoading(false);

      // Background verify (non-blocking, silent)
      withTimeout(authService.getMe(), 3000)
        .then((data) => {
          if (data.success && data.data?.user) {
            setUser(data.data.user);
            saveUser(data.data.user);
          }
        })
        .catch(() => {
          // Keep local session, don't clear anything
        });
    } else {
      // No saved session — done loading immediately
      setIsLoading(false);
    }
  }, []);

  // ── refreshUser ─────────────────────────────────
  const refreshUser = useCallback(async () => {
    const saved = getSavedUser();
    if (saved) setUser(saved);

    try {
      const data = await withTimeout(authService.getMe(), 3000);
      if (data.success && data.data?.user) {
        setUser(data.data.user);
        saveUser(data.data.user);
      }
    } catch {
      // Keep existing session
    }
  }, []);

  // ── Login ───────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = await authService.login({ email, password });
      if (data.success && data.data) {
        saveToken(data.data.accessToken);
        saveUser(data.data.user);
        setUser(data.data.user);
        return;
      }
      throw new Error(data.message || "Invalid credentials.");
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err instanceof Error ? err.message : "Unable to connect to backend server. Please verify NEXT_PUBLIC_API_URL.");
      throw new Error(errorMsg);
    }
  }, []);

  // ── Register ────────────────────────────────────
  const register = useCallback(
    async (formData: {
      name: string;
      email: string;
      password: string;
      role?: string;
    }) => {
      try {
        const data = await authService.register(formData);
        if (data.success && data.data) {
          saveToken(data.data.accessToken);
          saveUser(data.data.user);
          setUser(data.data.user);
          return;
        }
        throw new Error(data.message || "Registration failed.");
      } catch (err: unknown) {
        const errorMsg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          (err instanceof Error ? err.message : "Unable to connect to backend server. Please verify NEXT_PUBLIC_API_URL.");
        throw new Error(errorMsg);
      }
    },
    []
  );

  // ── Google Login (Real OAuth Picker) ────────────
  const googleLogin = useCallback(async () => {
    try {
      const { triggerGoogleOAuth } = await import("@/lib/googleAuth");
      const token = await triggerGoogleOAuth();
      const data = await authService.googleAuth(token);
      if (data.success && data.data) {
        saveToken(data.data.accessToken);
        saveUser(data.data.user);
        setUser(data.data.user);
        return;
      }
      throw new Error(data.message || "Google authentication failed.");
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err instanceof Error ? err.message : "Google sign-in failed. Please try again.");
      throw new Error(errorMsg);
    }
  }, []);

  // ── Logout ──────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await withTimeout(authService.logout(), 2000);
    } catch {
      // Ignore
    }
    setUser(null);
    clearAll();
  }, []);

  // ── updateUser (local patch) ─────────────────────
  const updateUser = useCallback((partial: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const merged = { ...prev, ...partial };
      saveUser(merged);
      return merged;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        googleLogin,
        logout,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
