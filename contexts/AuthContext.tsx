"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
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
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Token Storage ────────────────────────────────
const TOKEN_KEY = "resellhub_token";

const saveToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

const clearToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// ─── Provider ─────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user on app load
  const refreshUser = useCallback(async () => {
    try {
      const data = await authService.getMe();
      if (data.success && data.data?.user) {
        setUser(data.data.user);
      } else {
        setUser(null);
        clearToken();
      }
    } catch {
      setUser(null);
      clearToken();
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    };
    init();
  }, [refreshUser]);

  // ─── Login ──────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    const data = await authService.login({ email, password });
    if (data.success && data.data) {
      saveToken(data.data.accessToken);
      setUser(data.data.user);
    }
  }, []);

  // ─── Register ───────────────────────────────────
  const register = useCallback(
    async (formData: {
      name: string;
      email: string;
      password: string;
      role?: string;
    }) => {
      const data = await authService.register(formData);
      if (data.success && data.data) {
        saveToken(data.data.accessToken);
        setUser(data.data.user);
      }
    },
    []
  );

  // ─── Google Login ────────────────────────────────
  const googleLogin = useCallback(async (idToken: string) => {
    const data = await authService.googleAuth(idToken);
    if (data.success && data.data) {
      saveToken(data.data.accessToken);
      setUser(data.data.user);
    }
  }, []);

  // ─── Logout ─────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      clearToken();
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    googleLogin,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
