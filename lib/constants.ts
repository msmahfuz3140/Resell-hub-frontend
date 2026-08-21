export const SITE_CONFIG = {
  name: "ReSell Hub",
  tagline: "Buy & Sell Second-Hand Items",
  description:
    "Bangladesh's trusted second-hand marketplace. Buy and sell pre-loved items safely.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
};

export const CATEGORIES = [
  { id: "Electronics", label: "Electronics", icon: "📱" },
  { id: "Clothing", label: "Clothing", icon: "👕" },
  { id: "Furniture", label: "Furniture", icon: "🛋️" },
  { id: "Books", label: "Books", icon: "📚" },
  { id: "Sports", label: "Sports", icon: "⚽" },
  { id: "Vehicles", label: "Vehicles", icon: "🚗" },
  { id: "Home & Garden", label: "Home & Garden", icon: "🏡" },
  { id: "Toys", label: "Toys", icon: "🧸" },
  { id: "Jewelry", label: "Jewelry", icon: "💍" },
  { id: "Art", label: "Art", icon: "🎨" },
  { id: "Music", label: "Music", icon: "🎵" },
  { id: "Other", label: "Other", icon: "📦" },
] as const;

export const CONDITIONS = [
  { id: "New", label: "New", color: "green" },
  { id: "Like New", label: "Like New", color: "blue" },
  { id: "Good", label: "Good", color: "yellow" },
  { id: "Fair", label: "Fair", color: "orange" },
  { id: "Poor", label: "Poor", color: "red" },
] as const;

export const SORT_OPTIONS = [
  { value: "-createdAt", label: "Newest First" },
  { value: "createdAt", label: "Oldest First" },
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
  { value: "-views", label: "Most Popular" },
];

export const PLATFORM_FEE_PERCENT = 5; // 5% platform fee
