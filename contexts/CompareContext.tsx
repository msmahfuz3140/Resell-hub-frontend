"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Product } from "@/types";
import { toast } from "sonner";

interface CompareContextType {
  compareItems: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  toggleCompare: (product: Product) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  count: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);
const COMPARE_STORAGE_KEY = "resellhub_compare_items";
const MAX_COMPARE = 4;

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareItems, setCompareItems] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(COMPARE_STORAGE_KEY);
      if (saved) {
        setCompareItems(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  const saveItems = (items: Product[]) => {
    setCompareItems(items);
    try {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore
    }
  };

  const isInCompare = useCallback(
    (productId: string) => {
      return compareItems.some((item) => item._id === productId);
    },
    [compareItems]
  );

  const addToCompare = useCallback(
    (product: Product) => {
      if (compareItems.some((i) => i._id === product._id)) {
        toast.info("Product is already in your comparison list.");
        return;
      }
      if (compareItems.length >= MAX_COMPARE) {
        toast.error(`You can compare up to ${MAX_COMPARE} items at a time.`);
        return;
      }
      const updated = [...compareItems, product];
      saveItems(updated);
      toast.success(`Added "${product.title.slice(0, 25)}..." to comparison! ⚖️`);
    },
    [compareItems]
  );

  const removeFromCompare = useCallback(
    (productId: string) => {
      const updated = compareItems.filter((i) => i._id !== productId);
      saveItems(updated);
      toast.info("Item removed from comparison list.");
    },
    [compareItems]
  );

  const toggleCompare = useCallback(
    (product: Product) => {
      if (isInCompare(product._id)) {
        removeFromCompare(product._id);
      } else {
        addToCompare(product);
      }
    },
    [isInCompare, removeFromCompare, addToCompare]
  );

  const clearCompare = useCallback(() => {
    saveItems([]);
    toast.info("Comparison list cleared.");
  }, []);

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        clearCompare,
        isInCompare,
        count: compareItems.length,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare(): CompareContextType {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}

export default CompareContext;
