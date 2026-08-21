// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string | null;
  photo?: { url: string | null; publicId: string | null } | null;
  role: "buyer" | "seller" | "admin";
  status: "active" | "inactive" | "banned";
  provider: "local" | "google";
  phone?: string | null;
  location?: {
    city?: string | null;
    state?: string | null;
    country?: string | null;
  };
  bio?: string | null;
  isVerified: boolean;
  isActive: boolean;
  rating: {
    average: number;
    count: number;
  };
  totalSales: number;
  createdAt: string;
  updatedAt: string;
}

// Product Types
export interface ProductImage {
  url: string;
  publicId: string;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  images: ProductImage[];
  category: string;
  condition: "New" | "Like New" | "Good" | "Fair" | "Poor";
  seller: User;
  location: {
    city: string;
    state?: string | null;
    country: string;
  };
  status: "active" | "sold" | "pending" | "rejected" | "draft";
  isFeatured: boolean;
  views: number;
  favorites: string[];
  favoritesCount: number;
  tags: string[];
  negotiable: boolean;
  meetupPreference: "In-person" | "Delivery" | "Both";
  soldTo?: string | null;
  soldAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export interface Order {
  _id: string;
  orderNumber: string;
  buyer: User;
  seller: User;
  product: Product;
  amount: number;
  platformFee: number;
  sellerAmount: number;
  status:
    | "pending"
    | "payment_processing"
    | "paid"
    | "shipped"
    | "delivered"
    | "completed"
    | "cancelled"
    | "refunded";
  paymentMethod: "stripe" | "cash";
  stripePaymentIntentId?: string | null;
  shippingAddress?: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Auth Types
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Form Types
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ProductFormData {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  condition: string;
  city: string;
  negotiable: boolean;
  meetupPreference: string;
  tags: string;
  images: FileList | null;
}

// Filter Types
export interface ProductFilters {
  search?: string;
  category?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}
