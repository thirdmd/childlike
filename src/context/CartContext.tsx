import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { CartItem, CartState } from "@/lib/cartTypes";
import { calculateSubtotal } from "@/lib/pricingService";
import {
  getLocalCart,
  clearLocalCart,
  saveLocalCart,
  mergeCartsOnLogin,
  getCartFromDatabase,
  saveCartToDatabase,
} from "@/lib/cartSyncService";
import { authService } from "@/integrations/supabase/authService";

interface CartContextValue {
  state: CartState;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  // Reactive computed values for components to subscribe to
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_STORAGE_KEY = "childlike-cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<CartState>(() => {
    // SECURITY: Safely load from localStorage with validation
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);

      if (!stored) {
        return { items: [] };
      }

      const parsed = JSON.parse(stored);

      // Validate the structure
      if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.items)) {
        console.warn("Invalid cart data in localStorage, resetting cart");
        localStorage.removeItem(CART_STORAGE_KEY);
        return { items: [] };
      }

      // Validate each item
      const validItems = parsed.items.filter((item: any) => {
        return (
          item &&
          typeof item === "object" &&
          typeof item.productId === "string" &&
          item.productId.trim().length > 0 &&
          typeof item.name === "string" &&
          item.name.trim().length > 0 &&
          typeof item.price === "number" &&
          item.price > 0 &&
          isFinite(item.price) &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0 &&
          item.quantity <= 99
        );
      });

      // If validation removed items, log warning
      if (validItems.length !== parsed.items.length) {
        console.warn(`Removed ${parsed.items.length - validItems.length} invalid items from cart`);
      }

      // SECURITY: Limit cart size on load
      if (validItems.length > 50) {
        console.warn("Cart exceeded maximum size, keeping first 50 items");
        return { items: validItems.slice(0, 50) };
      }

      return { items: validItems };
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      localStorage.removeItem(CART_STORAGE_KEY);
      return { items: [] };
    }
  });

  // Sync to localStorage whenever state changes (for anonymous users)
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Listen to auth state changes for cart sync
  useEffect(() => {
    let currentUserId: string | null = null;

    const { data: authListener } = authService.onAuthStateChange(async (session) => {
      if (session?.user) {
        // User logged in: merge carts
        currentUserId = session.user.id;
        const localCart = getLocalCart();

        if (localCart.length > 0) {
          // User had items in localStorage, merge them
          const mergedItems = await mergeCartsOnLogin(session.user.id, localCart);
          setState({ items: mergedItems });
        } else {
          // No local cart, just load database cart
          const dbCart = await getCartFromDatabase(session.user.id);
          setState({ items: dbCart });
        }
      } else {
        // User logged out: clear localStorage, keep database intact
        currentUserId = null;
        clearLocalCart();
        // Reset cart to empty
        setState({ items: [] });
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Sync cart to database whenever it changes (for logged-in users)
  useEffect(() => {
    const syncToDatabase = async () => {
      const { session } = await authService.getCurrentSession();
      if (session?.user && state.items.length > 0) {
        // User is logged in, sync cart to database
        await saveCartToDatabase(session.user.id, state.items);
      }
    };

    // Only sync after initial load
    if (state.items.length > 0) {
      syncToDatabase();
    }
  }, [state.items]);

  const addItem = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    // SECURITY: Validate all inputs before processing
    if (!item || typeof item !== "object") {
      console.error("Invalid item: must be an object");
      return;
    }

    if (!item.productId || typeof item.productId !== "string") {
      console.error("Invalid item: missing or invalid productId");
      return;
    }

    if (!item.name || typeof item.name !== "string" || item.name.trim().length === 0) {
      console.error("Invalid item: missing or invalid name");
      return;
    }

    if (typeof item.price !== "number" || item.price <= 0 || !isFinite(item.price)) {
      console.error("Invalid item: price must be a positive number");
      return;
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      console.error("Invalid quantity: must be an integer between 1 and 99");
      return;
    }

    setState((prev) => {
      const existingIndex = prev.items.findIndex(
        (i) => i.productId === item.productId
      );

      if (existingIndex >= 0) {
        // Product exists, increase quantity
        const updated = [...prev.items];
        const newQuantity = updated[existingIndex].quantity + quantity;

        // SECURITY: Prevent cart overflow attacks
        if (newQuantity > 99) {
          console.warn("Maximum quantity (99) reached for this product");
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: 99,
          };
        } else {
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQuantity,
          };
        }

        // TODO: Sync to Supabase when user is authenticated
        // cartService.syncToDatabase({ items: updated }, user?.id);
        return { items: updated };
      } else {
        // SECURITY: Prevent cart stuffing attacks (limit total items)
        if (prev.items.length >= 50) {
          console.warn("Maximum cart items (50) reached");
          return prev;
        }

        // New product, add to cart
        const newItems = [...prev.items, { ...item, quantity }];
        // TODO: Sync to Supabase when user is authenticated
        // cartService.syncToDatabase({ items: newItems }, user?.id);
        return { items: newItems };
      }
    });
  };

  const removeItem = (productId: string) => {
    // SECURITY: Validate productId
    if (!productId || typeof productId !== "string" || productId.trim().length === 0) {
      console.error("Invalid productId for removal");
      return;
    }

    setState((prev) => {
      const newItems = prev.items.filter((item) => item.productId !== productId);
      // TODO: Sync to Supabase when user is authenticated
      // cartService.syncToDatabase({ items: newItems }, user?.id);
      return { items: newItems };
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    // SECURITY: Validate inputs
    if (!productId || typeof productId !== "string" || productId.trim().length === 0) {
      console.error("Invalid productId for quantity update");
      return;
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      console.error("Invalid quantity: must be a non-negative integer");
      return;
    }

    // Remove item if quantity is 0
    if (quantity === 0) {
      removeItem(productId);
      return;
    }

    // SECURITY: Enforce maximum quantity
    const safeQuantity = Math.min(quantity, 99);

    setState((prev) => {
      const newItems = prev.items.map((item) =>
        item.productId === productId ? { ...item, quantity: safeQuantity } : item
      );
      // TODO: Sync to Supabase when user is authenticated
      // cartService.syncToDatabase({ items: newItems }, user?.id);
      return { items: newItems };
    });
  };

  const clearCart = () => {
    setState({ items: [] });
    // TODO: Clear from Supabase when user is authenticated
    // cartService.clearDatabase(user?.id, sessionId);
  };

  const getItemCount = (): number => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = (): number => {
    return calculateSubtotal(state.items);
  };

  // Reactive computed values - automatically update when state changes
  // Components can subscribe to these without calling functions
  const itemCount = useMemo(() => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  }, [state.items]);

  const subtotal = useMemo(() => {
    return calculateSubtotal(state.items);
  }, [state.items]);

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemCount,
        getSubtotal,
        // Reactive values for component subscription
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
