import api from "@/lib/axios";
import type { ApiResponse, PaginatedResponse, Payment, Order } from "@/types";

export interface CreateIntentPayload {
  productId: string;
  quantity?: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    postalCode?: string;
    country?: string;
  };
  buyerNote?: string;
}

export interface CreateIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  orderId: string;
  orderNumber: string;
  transactionId: string;
  amount: number;
  currency: string;
  order: Order;
}

export interface ConfirmPaymentPayload {
  orderId: string;
  paymentIntentId?: string;
}

export const paymentService = {
  /**
   * Initialize Stripe Payment Intent & Create Pending Order
   */
  createPaymentIntent: async (data: CreateIntentPayload) => {
    const res = await api.post<ApiResponse<CreateIntentResponse>>("/payments/create-intent", data);
    return res.data;
  },

  /**
   * Confirm successful card charge and transition order to paid
   */
  confirmPayment: async (data: ConfirmPaymentPayload) => {
    const res = await api.post<ApiResponse<{ order: Order; payment: Payment }>>("/payments/confirm", data);
    return res.data;
  },

  /**
   * Get payment receipt and details by order ID
   */
  getPaymentByOrder: async (orderId: string) => {
    const res = await api.get<ApiResponse<{ payment: Payment; order: Order }>>(`/payments/order/${orderId}`);
    return res.data;
  },

  /**
   * Admin: List and filter all payments
   */
  getAdminPayments: async (filters: { page?: number; limit?: number; status?: string; search?: string; paymentMethod?: string } = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", String(filters.page));
    if (filters.limit) params.append("limit", String(filters.limit));
    if (filters.status && filters.status !== "all") params.append("status", filters.status);
    if (filters.paymentMethod && filters.paymentMethod !== "all") params.append("paymentMethod", filters.paymentMethod);
    if (filters.search) params.append("search", filters.search);

    const res = await api.get<PaginatedResponse<Payment> & { summary?: { totalProcessed: number; totalPlatformRevenue: number; completedCount: number; pendingCount: number; failedCount: number } }>(
      `/payments/admin?${params.toString()}`
    );
    return res.data;
  },
};

export default paymentService;
