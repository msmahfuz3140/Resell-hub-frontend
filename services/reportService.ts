import api from "@/lib/axios";
import type { ApiResponse, PaginatedResponse } from "@/types";

export interface ReportItem {
  _id: string;
  reporterId: { _id: string; name: string; email: string; photo?: { url: string } };
  productId: { _id: string; title: string; price: number; images?: { url: string }[]; category: string; status: string };
  sellerId?: { _id: string; name: string; email: string; phone?: string; photo?: { url: string } };
  reason: string;
  description: string;
  status: "pending" | "investigating" | "resolved" | "dismissed";
  adminNotes?: string;
  actionTaken?: string;
  resolvedBy?: { _id: string; name: string };
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const reportService = {
  /**
   * Submit product report
   */
  createReport: async (data: { productId: string; reason: string; description: string }) => {
    const res = await api.post<ApiResponse<{ report: ReportItem }>>("/reports", data);
    return res.data;
  },

  /**
   * Get all reports (Admin)
   */
  getReports: async (filters: { page?: number; limit?: number; status?: string; reason?: string } = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", String(filters.page));
    if (filters.limit) params.append("limit", String(filters.limit));
    if (filters.status && filters.status !== "all") params.append("status", filters.status);
    if (filters.reason && filters.reason !== "all") params.append("reason", filters.reason);

    const res = await api.get<PaginatedResponse<ReportItem>>(`/reports?${params.toString()}`);
    return res.data;
  },

  /**
   * Update report status and moderation action (Admin)
   */
  updateReport: async (
    reportId: string,
    data: { status: string; adminNotes?: string; actionTaken?: string }
  ) => {
    const res = await api.put<ApiResponse<{ report: ReportItem }>>(`/reports/${reportId}`, data);
    return res.data;
  },
};

export default reportService;
