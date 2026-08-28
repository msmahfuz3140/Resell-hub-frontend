import api from "@/lib/axios";
import type { ApiResponse, PaginatedResponse, User, Product, Order, AdminStats, AdminCharts } from "@/types";

export const adminService = {
  /**
   * Get admin overview stats and growth charts
   */
  getStats: async () => {
    const res = await api.get<ApiResponse<{ stats: AdminStats; charts: AdminCharts }>>("/admin/stats");
    return res.data;
  },

  /**
   * Get all users with search & filters
   */
  getUsers: async (filters: { page?: number; limit?: number; search?: string; role?: string; status?: string } = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", String(filters.page));
    if (filters.limit) params.append("limit", String(filters.limit));
    if (filters.search) params.append("search", filters.search);
    if (filters.role && filters.role !== "all") params.append("role", filters.role);
    if (filters.status && filters.status !== "all") params.append("status", filters.status);

    const res = await api.get<PaginatedResponse<User>>(`/admin/users?${params.toString()}`);
    return res.data;
  },

  /**
   * Update user status (block/unblock/active/banned/inactive)
   */
  updateUserStatus: async (userId: string, status: "active" | "banned" | "inactive") => {
    const res = await api.put<ApiResponse<{ user: User }>>(`/admin/users/${userId}/status`, { status });
    return res.data;
  },

  /**
   * Delete user
   */
  deleteUser: async (userId: string) => {
    const res = await api.delete<ApiResponse<null>>(`/admin/users/${userId}`);
    return res.data;
  },

  /**
   * Get all products for admin moderation
   */
  getProducts: async (filters: { page?: number; limit?: number; search?: string; category?: string; status?: string } = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", String(filters.page));
    if (filters.limit) params.append("limit", String(filters.limit));
    if (filters.search) params.append("search", filters.search);
    if (filters.category && filters.category !== "All") params.append("category", filters.category);
    if (filters.status && filters.status !== "all") params.append("status", filters.status);

    const res = await api.get<PaginatedResponse<Product>>(`/admin/products?${params.toString()}`);
    return res.data;
  },

  /**
   * Approve or reject product
   */
  updateProductStatus: async (productId: string, status: string, rejectionReason?: string) => {
    const res = await api.put<ApiResponse<{ product: Product }>>(`/admin/products/${productId}/status`, {
      status,
      rejectionReason,
    });
    return res.data;
  },

  /**
   * Delete product
   */
  deleteProduct: async (productId: string) => {
    const res = await api.delete<ApiResponse<null>>(`/products/${productId}`);
    return res.data;
  },

  /**
   * Get all orders for admin monitoring
   */
  getOrders: async (filters: { page?: number; limit?: number; search?: string; status?: string } = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", String(filters.page));
    if (filters.limit) params.append("limit", String(filters.limit));
    if (filters.search) params.append("search", filters.search);
    if (filters.status && filters.status !== "all") params.append("status", filters.status);

    const res = await api.get<PaginatedResponse<Order>>(`/admin/orders?${params.toString()}`);
    return res.data;
  },

  /**
   * Override order status
   */
  updateOrderStatus: async (orderId: string, data: { orderStatus?: string; paymentStatus?: string }) => {
    const res = await api.put<ApiResponse<{ order: Order }>>(`/admin/orders/${orderId}/status`, data);
    return res.data;
  },
};

export default adminService;
