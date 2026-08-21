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
