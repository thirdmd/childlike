/**
 * Centralized Pricing Service
 * Single source of truth for all price calculations across the app
 *
 * Used by:
 * - ProductDetail page (display pricing)
 * - Cart page (subtotal, total calculations)
 * - Stripe integration (checkout amounts)
 * - Analytics (revenue tracking)
 * - Backend sync (order records)
 */

import { CartItem } from "./cartTypes";
import { Product } from "@/config/products";

/**
 * Calculate item total (unit price × quantity)
 */
export const calculateItemTotal = (unitPrice: number, quantity: number): number => {
  return unitPrice * quantity;
};

/**
 * Calculate cart subtotal (sum of all items)
 */
export const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    return total + calculateItemTotal(item.price, item.quantity);
  }, 0);
};

/**
 * Calculate tax (future implementation)
 * Currently returns 0, ready for tax integration
 */
export const calculateTax = (subtotal: number, taxRate: number = 0): number => {
  return subtotal * taxRate;
};

/**
 * Calculate shipping (future implementation)
 * Currently returns 0 (free shipping)
 */
export const calculateShipping = (subtotal: number): number => {
  // Future: Add shipping logic based on location, weight, etc.
  return 0;
};

/**
 * Calculate discount (future implementation)
 * Ready for promo codes, coupons, sales
 */
export const calculateDiscount = (subtotal: number, discountCode?: string): number => {
  // Future: Validate discount code and apply reduction
  return 0;
};

/**
 * Calculate final total (subtotal + tax + shipping - discount)
 */
export const calculateTotal = (
  subtotal: number,
  tax: number = 0,
  shipping: number = 0,
  discount: number = 0
): number => {
  return subtotal + tax + shipping - discount;
};

/**
 * Get Stripe-ready line items
 * Converts cart items to Stripe Checkout format
 * INCLUDES FLAVOR INFORMATION for accurate order fulfillment
 *
 * @param items - Cart items
 * @returns Stripe line_items array
 */
export const getStripeLineItems = (items: CartItem[]) => {
  return items.map((item) => {
    // Build full product name with flavor for Stripe
    const fullProductName = item.flavorName
      ? `${item.name} - ${item.flavorName}`
      : item.name;

    return {
      price_data: {
        currency: "php",
        product_data: {
          name: fullProductName, // ← CRITICAL: Includes flavor name
          // Future: Add product images
          // images: [item.imageUrl],
          metadata: {
            product_slug: item.slug,
            flavor_id: item.flavorId || '',
            flavor_name: item.flavorName || '',
          },
        },
        // Stripe requires amount in centavos (smallest currency unit)
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    };
  });
};

/**
 * Analytics event data structure
 * Ready for Google Analytics, Meta Pixel, or custom tracking
 */
export interface AnalyticsEvent {
  event: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  value: number; // total value (price × quantity)
  currency: string;
  timestamp: number;
}

/**
 * Create analytics event for tracking
 */
export const createAnalyticsEvent = (
  eventName: string,
  product: Product,
  quantity: number
): AnalyticsEvent => {
  return {
    event: eventName,
    product_id: product.id,
    product_name: product.name,
    price: product.price,
    quantity: quantity,
    value: calculateItemTotal(product.price, quantity),
    currency: "PHP",
    timestamp: Date.now(),
  };
};

/**
 * Log analytics event (placeholder for future integration)
 */
export const logAnalyticsEvent = (event: AnalyticsEvent): void => {
  // Future: Send to Google Analytics
  // gtag('event', event.event, { ... });

  // Future: Send to Meta Pixel
  // fbq('track', event.event, { ... });

  // Future: Send to Supabase analytics table
  // supabase.from('analytics_events').insert(event);

  // For now, just log to console in development
  if (import.meta.env.DEV) {
    console.log("📊 Analytics Event:", event);
  }
};

/**
 * Validate price (ensure no negative or invalid amounts)
 */
export const validatePrice = (price: number): boolean => {
  return price > 0 && !isNaN(price) && isFinite(price);
};

/**
 * Validate quantity (ensure positive integer)
 */
export const validateQuantity = (quantity: number): boolean => {
  return quantity > 0 && Number.isInteger(quantity);
};
