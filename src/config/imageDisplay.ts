/**
 * CENTRALIZED IMAGE DISPLAY LOGIC
 * Handles all image placeholders and fallback behaviors
 * Future-proof: New products automatically show titles when no image exists
 */

/**
 * Small placeholder for cart view (200x200)
 * Used when product image isn't available yet
 */
export const CART_PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%230047AB'/%3E%3Cpath d='M100 60 L140 100 L100 140 L60 100 Z' fill='none' stroke='%23FFFFFF' stroke-width='3' opacity='0.3'/%3E%3C/svg%3E`;

/**
 * Determine if image exists
 * Returns true only if the image is a real product image (not a placeholder)
 * Returns false if image is null/undefined or is a placeholder
 */
export const hasProductImage = (
  imageSrc: string | undefined | null,
  placeholderValue: string
): boolean => {
  if (!imageSrc) return false;
  if (imageSrc === placeholderValue) return false;
  return true;
};

/**
 * Get fallback display title for missing images
 * Centralized: Used in ProductDetail when no image available
 * Future-proof: Works for any product/flavor combination
 */
export const getMissingImageFallback = (
  productName: string,
  flavorName?: string
): string => {
  return flavorName ? `${productName} - ${flavorName}` : productName;
};
