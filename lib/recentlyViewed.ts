import type { Product } from "@/types";

const RECENTLY_VIEWED_KEY = "resellhub_recently_viewed_products";
const MAX_ITEMS = 12;

export function addRecentlyViewed(product: Product): void {
  if (typeof window === "undefined" || !product || !product._id) return;
  try {
    const existing = getRecentlyViewed();
    // Filter out current product to move it to the top
    const filtered = existing.filter((p) => p._id !== product._id);
    const updated = [product, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Error saving recently viewed product:", e);
  }
}

export function getRecentlyViewed(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearRecentlyViewed(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
  } catch (e) {
    console.error("Error clearing recently viewed:", e);
  }
}
