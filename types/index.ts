// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string | null;
  photo?: { url: string | null; publicId: string | null } | null;
  coverPhoto?: { url: string | null; publicId: string | null } | null;
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
  isVerified?: boolean;
  isVerifiedSeller?: boolean;
  verifiedAt?: string | null;
  isActive?: boolean;
  rating?: {
    average: number;
    count: number;
  } | number;
  totalPurchases?: number;
  totalSales?: number;
  createdAt: string;
  updatedAt: string;
}

// Product Image Types
export interface ProductImage {
  url: string;
  publicId?: string;
  isPrimary?: boolean;
}

// Seller Info Subdocument
export interface SellerInfo {
  sellerId: string;
  name: string;
  photo?: string | null;
  phone?: string | null;
  rating?: number;
  totalSales?: number;
  isVerifiedSeller?: boolean;
  location?: {
    city?: string | null;
    country?: string | null;
  };
}

// Product Types
export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  images: ProductImage[];
  category: string;
  condition: "New" | "Like New" | "Good" | "Fair" | "Poor";
  seller?: User;
  sellerInfo?: SellerInfo;
  stock?: number;
  location: {
    city: string;
    state?: string | null;
    country: string;
  };
  status: "active" | "sold" | "pending" | "rejected" | "draft" | "archived";
  isFeatured?: boolean;
  views: number;
  favorites?: string[];
  favoritesCount?: number;
  tags?: string[];
  negotiable?: boolean;
  meetupPreference?: "In-person" | "Delivery" | "Both";
  soldTo?: string | null;
  soldAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export interface OrderParticipant {
  userId: string;
  name: string;
  email: string;
  phone?: string | null;
  photo?: string | null;
  location?: {
    city?: string | null;
    country?: string | null;
  };
}

export interface OrderProductSnapshot {
  productId: string;
  title: string;
  image?: string | null;
  price: number;
  category: string;
  condition: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  buyerInfo: OrderParticipant;
  sellerInfo: OrderParticipant;
  productId: string;
  productSnapshot: OrderProductSnapshot;
  amount: number;
  platformFee: number;
  sellerAmount: number;
  paymentStatus: "unpaid" | "pending" | "paid" | "failed" | "refunded" | "partially_refunded";
  paymentMethod: "stripe" | "cash" | "bank_transfer";
  orderStatus:
    | "placed"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "completed"
    | "cancelled"
    | "disputed";
  shippingAddress?: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state?: string | null;
    postalCode?: string | null;
    country: string;
  };
  trackingNumber?: string | null;
  buyerNote?: string | null;
  sellerNote?: string | null;
  cancelReason?: string | null;
  confirmedAt?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  isReviewed?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Payment Types
export interface Payment {
  _id: string;
  orderId: string | Order;
  buyerId: string | User;
  sellerId: string | User;
  transactionId: string;
  stripePaymentIntentId?: string | null;
  stripeChargeId?: string | null;
  stripeSessionId?: string | null;
  amount: number;
  currency: string;
  platformFee: number;
  sellerAmount: number;
  paymentMethod: "stripe" | "cash" | "bank_transfer";
  paymentGateway?: "stripe" | "manual";
  paymentStatus: "pending" | "processing" | "completed" | "failed" | "cancelled" | "refunded" | "partially_refunded";
  paymentDate?: string | null;
  refundedAt?: string | null;
  refundAmount?: number;
  refundReason?: string | null;
  stripeRefundId?: string | null;
  metadata?: Record<string, unknown>;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Admin & Dashboard Types
export interface AdminStats {
  totalUsers: number;
  totalSellers: number;
  totalBuyers: number;
  totalProducts: number;
  activeProducts: number;
  pendingProducts: number;
  totalOrders: number;
  completedOrders: number;
  totalGMV: number;
  platformRevenue: number;
}

export interface AdminCharts {
  userGrowth: { month: string; users: number; sellers: number }[];
  monthlyOrders: { month: string; orders: number; revenue: number }[];
  categoryDistribution: { _id: string; count: number }[];
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
  role?: "buyer" | "seller";
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
