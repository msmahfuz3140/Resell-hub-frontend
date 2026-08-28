import api from "@/lib/axios";
import type { ApiResponse, PaginatedResponse, Product, User } from "@/types";

export const userService = {
  /**
   * Get user's favorites
   */
  getMyFavorites: async (page = 1, limit = 12) => {
    const res = await api.get<PaginatedResponse<Product>>(`/users/me/favorites?page=${page}&limit=${limit}`);
    return res.data;
  },

  /**
   * Update profile (supports multipart photo upload)
   */
  updateProfile: async (formData: FormData) => {
    const res = await api.put<ApiResponse<{ user: User }>>("/users/me", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  /**
   * Change password
   */
  changePassword: async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    const res = await api.put<ApiResponse<null>>("/users/me/password", {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    return res.data;
  },
};

export default userService;
