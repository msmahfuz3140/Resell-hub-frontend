import api from "@/lib/axios";
import type { ApiResponse, PaginatedResponse, Product, ProductFilters } from "@/types";

export const productService = {
  /**
   * Get all products with filters, sorting, and pagination
   */
  getProducts: async (filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.category && filters.category !== "All") params.append("category", filters.category);
    if (filters.condition && filters.condition !== "All") params.append("condition", filters.condition);
    if (filters.minPrice) params.append("minPrice", String(filters.minPrice));
    if (filters.maxPrice) params.append("maxPrice", String(filters.maxPrice));
    if (filters.sort) params.append("sort", filters.sort);
    if (filters.page) params.append("page", String(filters.page));
    if (filters.limit) params.append("limit", String(filters.limit));

    const res = await api.get<PaginatedResponse<Product>>(`/products?${params.toString()}`);
    return res.data;
  },

  /**
   * Get seller's own products
   */
  getMyProducts: async (filters: { search?: string; status?: string; page?: number; limit?: number; sort?: string } = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.status && filters.status !== "all") params.append("status", filters.status);
    if (filters.page) params.append("page", String(filters.page));
    if (filters.limit) params.append("limit", String(filters.limit));
    if (filters.sort) params.append("sort", filters.sort);

    const res = await api.get<PaginatedResponse<Product>>(`/products/my-products?${params.toString()}`);
    return res.data;
  },

  /**
   * Get featured products for homepage
   */
  getFeaturedProducts: async () => {
    const res = await api.get<ApiResponse<{ products: Product[] }>>("/products/featured");
    return res.data;
  },

  /**
   * Get single product by ID
   */
  getProductById: async (id: string) => {
    const res = await api.get<ApiResponse<{ product: Product }>>(`/products/${id}`);
    return res.data;
  },

  /**
   * Get reviews for a product
   */
  getProductReviews: async (productId: string, page = 1) => {
    const res = await api.get(`/products/${productId}/reviews?page=${page}&limit=10`);
    return res.data;
  },

  /**
   * Create a new product (multipart/form-data for images)
   */
  createProduct: async (formData: FormData) => {
    const res = await api.post<ApiResponse<{ product: Product }>>("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  /**
   * Update an existing product
   */
  updateProduct: async (id: string, formData: FormData) => {
    const res = await api.put<ApiResponse<{ product: Product }>>(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  /**
   * Delete a product
   */
  deleteProduct: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/products/${id}`);
    return res.data;
  },

  /**
   * Toggle favorite/wishlist status
   */
  toggleFavorite: async (productId: string) => {
    const res = await api.post<ApiResponse<{ isFavorited: boolean; favoritesCount: number }>>(
      `/products/${productId}/favorite`
    );
    return res.data;
  },
};

export default productService;

