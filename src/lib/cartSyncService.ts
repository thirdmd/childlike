/**
 * CART SYNC SERVICE
 * Handles cart persistence across authentication states
 *
 * Flow:
 * - Anonymous user: cart in localStorage
 * - User logs in: merge localStorage cart → Supabase (per-account)
 * - User logged in: cart in Supabase
 * - User logs out: clear localStorage, Supabase cart stays (for next login)
 * - User logs back in: restore Supabase cart
 */

import { supabase } from "@/integrations/supabase/client";
import type { CartItem } from "@/context/CartContext";

const CART_STORAGE_KEY = "childlike-cart";

/**
 * Get cart from localStorage
 */
export const getLocalCart = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/**
 * Clear localStorage cart
 * Called on logout
 */
export const clearLocalCart = (): void => {
  localStorage.removeItem(CART_STORAGE_KEY);
};

/**
 * Save cart to localStorage
 * Used for anonymous users
 */
export const saveLocalCart = (items: CartItem[]): void => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

/**
 * Merge anonymous cart with database cart on login
 *
 * Strategy:
 * - If item exists in both: use localStorage quantity (more recent)
 * - If item only in localStorage: add it
 * - If item only in database: keep it
 *
 * Then save merged cart to database
 */
export const mergeCartsOnLogin = async (
  userId: string,
  localCart: CartItem[]
): Promise<CartItem[]> => {
  try {
    // Get existing cart from database (if any)
    const { data: existingCart, error: fetchError } = await supabase
      .from("user_carts")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 = no rows found (expected for new users)
      console.error("Failed to fetch existing cart:", fetchError);
      return localCart;
    }

    let mergedItems = localCart || [];

    // If user had a database cart, merge it
    if (existingCart && existingCart.items) {
      const dbItems = existingCart.items as CartItem[];

      // Create a map of local items by productId for quick lookup
      const localMap = new Map(localCart.map((item) => [item.productId, item]));

      // Start with database items
      mergedItems = [...dbItems];

      // Override with local items (more recent)
      localCart.forEach((localItem) => {
        const existingIndex = mergedItems.findIndex(
          (item) => item.productId === localItem.productId
        );

        if (existingIndex >= 0) {
          // Item exists in both: use local quantity (more recent)
          mergedItems[existingIndex] = localItem;
        } else {
          // Item only in local: add it
          mergedItems.push(localItem);
        }
      });
    }

    // Save merged cart to database
    await saveCartToDatabase(userId, mergedItems);

    // Clear local storage after successful merge
    clearLocalCart();

    return mergedItems;
  } catch (error) {
    console.error("Cart merge failed:", error);
    return localCart;
  }
};

/**
 * Save cart to database
 * Called during merge and regular cart updates for logged-in users
 */
export const saveCartToDatabase = async (
  userId: string,
  items: CartItem[]
): Promise<boolean> => {
  try {
    const { error } = await supabase.from("user_carts").upsert(
      {
        user_id: userId,
        items: items,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    );

    if (error) {
      console.error("Failed to save cart to database:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Cart save error:", error);
    return false;
  }
};

/**
 * Get cart from database for logged-in user
 */
export const getCartFromDatabase = async (userId: string): Promise<CartItem[]> => {
  try {
    const { data, error } = await supabase
      .from("user_carts")
      .select("items")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows found (expected for new users)
      console.error("Failed to fetch cart from database:", error);
      return [];
    }

    return data?.items || [];
  } catch (error) {
    console.error("Cart fetch error:", error);
    return [];
  }
};
