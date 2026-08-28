import type { Product } from "@/types";

const FAVORITES_KEY = "resellhub_wishlist_products";

const DEFAULT_DEMO_FAVORITES: Product[] = [
  {
    _id: "prod-1",
    title: "iPhone 15 Pro Max 256GB - Natural Titanium (Flawless)",
    description: "Official factory unlocked device. Battery health 98%. Comes with genuine Apple 20W adapter.",
    price: 94000,
    originalPrice: 125000,
    category: "Electronics",
    condition: "Like New",
    images: [
      {
        url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
        publicId: "iphone15_pro",
        isPrimary: true,
      },
    ],
    sellerInfo: {
      sellerId: "user-1",
      name: "Tanzid Hossain",
      rating: 4.9,
      totalSales: 24,
      location: { city: "Gulshan, Dhaka", country: "Bangladesh" },
    },
    stock: 1,
    status: "active",
    location: { city: "Gulshan, Dhaka", country: "Bangladesh" },
    isFeatured: true,
    views: 420,
    favorites: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "prod-2",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    description: "Used for 2 months only. Comes with carry case and all original accessories.",
    price: 28500,
    originalPrice: 36000,
    category: "Electronics",
    condition: "Like New",
    images: [
      {
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
        publicId: "sony_wh",
        isPrimary: true,
      },
    ],
    sellerInfo: {
      sellerId: "user-2",
      name: "Nabila Rahman",
      rating: 5.0,
      totalSales: 12,
      location: { city: "Dhanmondi, Dhaka", country: "Bangladesh" },
    },
    stock: 1,
    status: "active",
    location: { city: "Dhanmondi, Dhaka", country: "Bangladesh" },
    isFeatured: true,
    views: 310,
    favorites: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getLocalFavorites(): Product[] {
  if (typeof window === "undefined") return DEFAULT_DEMO_FAVORITES;
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(DEFAULT_DEMO_FAVORITES));
      return DEFAULT_DEMO_FAVORITES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_DEMO_FAVORITES;
  } catch {
    return DEFAULT_DEMO_FAVORITES;
  }
}

export function isLocalFavorite(productId: string): boolean {
  const favs = getLocalFavorites();
  return favs.some((p) => p._id === productId);
}

export function toggleLocalFavorite(product: Product): { isFavorited: boolean; totalCount: number } {
  if (typeof window === "undefined") return { isFavorited: false, totalCount: 0 };
  try {
    const favs = getLocalFavorites();
    const existsIndex = favs.findIndex((p) => p._id === product._id);
    let updated: Product[];
    let isFavorited: boolean;

    if (existsIndex >= 0) {
      updated = favs.filter((p) => p._id !== product._id);
      isFavorited = false;
    } else {
      updated = [product, ...favs];
      isFavorited = true;
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    // Trigger custom event so any listener updates automatically
    window.dispatchEvent(new Event("resellhub_favorites_updated"));
    return { isFavorited, totalCount: updated.length };
  } catch {
    return { isFavorited: true, totalCount: 1 };
  }
}
