/**
 * STRIPE PAYMENT LINK CHECKOUT CONFIGURATION
 * Single source of truth for Stripe Payment Links
 *
 * NO BACKEND REQUIRED - Uses Stripe Payment Links only
 * Each product maps to a pre-configured Stripe Payment Link
 */

interface CheckoutConfigItem {
  productId: string;
  stripePaymentLinkUrl: string;
}

export const checkoutConfig: CheckoutConfigItem[] = [
  {
    productId: "chewy-protein-cookie", // MUST match the productId used in CartItem
    stripePaymentLinkUrl: "https://buy.stripe.com/XXXXXX" // placeholder for now
  }
  // Add more products here in the future if needed
];

/**
 * Get Stripe Payment Link URL for a given product
 * Returns undefined if product is not configured
 */
export function getPaymentLinkForProduct(productId: string): string | undefined {
  const item = checkoutConfig.find((i) => i.productId === productId);
  return item?.stripePaymentLinkUrl;
}
