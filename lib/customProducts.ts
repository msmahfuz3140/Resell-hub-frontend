import type { Product } from "@/types";

const CUSTOM_PRODUCTS_KEY = "resellhub_custom_products";

export function getCustomProducts(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_PRODUCTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCustomProduct(product: Product): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getCustomProducts();
    const updated = [product, ...existing.filter((p) => p._id !== product._id)];
    localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("resellhub_products_updated"));
  } catch {
    // Ignore
  }
}

export function findCustomProductById(id: string): Product | undefined {
  const customList = getCustomProducts();
  return customList.find((p) => p._id === id);
}
