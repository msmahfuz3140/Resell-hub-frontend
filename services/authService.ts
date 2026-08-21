import api from "@/lib/axios";
import type { ApiResponse, User, LoginFormData, RegisterFormData } from "@/types";

// ─── Auth Service ─────────────────────────────────

export const authService = {
  /**
   * Register with email/password
   */
  register: async (data: { name: string; email: string; password: string; role?: string }) => {
    const res = await api.post<ApiResponse<{ user: User; accessToken: string }>>(
      "/auth/register",
      data
    );
    return res.data;
  },

  /**
   * Login with email/password
   */
  login: async (data: { email: string; password: string }) => {
    const res = await api.post<ApiResponse<{ user: User; accessToken: string }>>(
      "/auth/login",
      data
    );
    return res.data;
  },

  /**
   * Login/register with Google
   */
  googleAuth: async (idToken: string) => {
    const res = await api.post<ApiResponse<{ user: User; accessToken: string }>>(
      "/auth/google",
      { idToken }
    );
    return res.data;
  },

  /**
   * Logout current user
   */
  logout: async () => {
    const res = await api.post<ApiResponse>("/auth/logout");
    return res.data;
  },

  /**
   * Get current user profile
   */
  getMe: async () => {
    const res = await api.get<ApiResponse<{ user: User }>>("/auth/me");
    return res.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async () => {
    const res = await api.post<ApiResponse<{ accessToken: string }>>("/auth/refresh");
    return res.data;
  },

  /**
   * Switch role between buyer and seller
   */
  switchRole: async (role: "buyer" | "seller") => {
    const res = await api.put<ApiResponse<{ user: User }>>("/auth/role", { role });
    return res.data;
  },
};

export default authService;
