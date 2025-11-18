import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem, CartState } from "@/lib/cartTypes";

interface CartContextValue {
  state: CartState;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_STORAGE_KEY = "childlike-cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<CartState>(() => {
    // Initialize from localStorage if available
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : { items: [] };
  });

  // Sync to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addItem = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    setState((prev) => {
      const existingIndex = prev.items.findIndex(
        (i) => i.productId === item.productId
      );

      if (existingIndex >= 0) {
        // Product exists, increase quantity
        const updated = [...prev.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return { items: updated };
      } else {
        // New product, add to cart
        return { items: [...prev.items, { ...item, quantity }] };
      }
    });
  };

  const removeItem = (productId: string) => {
    setState((prev) => ({
      items: prev.items.filter((item) => item.productId !== productId),
    }));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setState((prev) => ({
      items: prev.items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      ),
    }));
  };

  const clearCart = () => {
    setState({ items: [] });
  };

  const getItemCount = (): number => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = (): number => {
    return state.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

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
