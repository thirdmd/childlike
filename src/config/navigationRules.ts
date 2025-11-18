import type { Product } from "./products";

/**
 * Centralized navigation arrow visibility rules
 * Use these rules across the entire app for consistent left/right arrow behavior
 */

export interface NavigationState {
  canGoPrevious: boolean;
  canGoNext: boolean;
}

/**
 * Determines if a product is navigable (has actual content)
 * A product is valid if it has a name (not empty)
 */
export const isProductValid = (product: Product | undefined): boolean => {
  if (!product) return false;
  return product.name.trim().length > 0;
};

/**
 * Determines if navigation arrows should be visible
 * Rule: Hide arrow completely if navigation is not possible
 * Don't just disable - completely remove from DOM
 */
export const getArrowVisibility = (
  canGoPrevious: boolean,
  canGoNext: boolean
): NavigationState => {
  return {
    canGoPrevious,
    canGoNext,
  };
};

/**
 * Arrow button styling - reusable across all left/right navigation
 */
export const arrowButtonClassName = "absolute z-10 p-2 rounded-full bg-brand-white/10 hover:bg-brand-white/20 transition-all";
