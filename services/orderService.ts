import api from "@/lib/axios";
import type { ApiResponse, PaginatedResponse, Order } from "@/types";

export const orderService = {
  /**
   * Create new order
   */
  createOrder: async (data: {
    productId: string;
    paymentMethod?: string;
    shippingAddress?: {
      fullName: string;
      phone: string;
      street: string;
      city: string;
      country?: string;
    };
    buyerNote?: string;
  }) => {
    const res = await api.post<ApiResponse<{ order: Order }>>("/orders", data);
    return res.data;
  },

  /**
   * Get buyer's orders
   */
  getMyOrders: async (filters: { page?: number; limit?: number; status?: string; search?: string } = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", String(filters.page));
    if (filters.limit) params.append("limit", String(filters.limit));
    if (filters.status && filters.status !== "all") params.append("status", filters.status);
    if (filters.search) params.append("search", filters.search);

    const res = await api.get<PaginatedResponse<Order>>(`/orders/my-orders?${params.toString()}`);
    return res.data;
  },

  /**
   * Get seller's orders
   */
  getSellerOrders: async (filters: { page?: number; limit?: number; status?: string; search?: string } = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", String(filters.page));
    if (filters.limit) params.append("limit", String(filters.limit));
    if (filters.status && filters.status !== "all") params.append("status", filters.status);
    if (filters.search) params.append("search", filters.search);

    const res = await api.get<PaginatedResponse<Order>>(`/orders/seller-orders?${params.toString()}`);
    return res.data;
  },

  /**
   * Get single order details
   */
  getOrderById: async (id: string) => {
    const res = await api.get<ApiResponse<{ order: Order }>>(`/orders/${id}`);
    return res.data;
  },

  /**
   * Cancel an order
   */
  cancelOrder: async (id: string, cancelReason?: string) => {
    const res = await api.put<ApiResponse<{ order: Order }>>(`/orders/${id}/cancel`, { cancelReason });
    return res.data;
  },

  /**
   * Update order status (Seller/Admin)
   */
  updateOrderStatus: async (id: string, data: { status?: string; trackingNumber?: string; sellerNote?: string }) => {
    const res = await api.put<ApiResponse<{ order: Order }>>(`/orders/${id}/status`, data);
    return res.data;
  },
};

export default orderService;
