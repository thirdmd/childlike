/**
 * Centralized currency configuration
 * Use this for all pricing displays across the app
 */

export const CURRENCY_CONFIG = {
  code: "PHP",
  symbol: "₱",
  decimalPlaces: 2,
};

/**
 * Format price for display
 * @param price - Price in base units (pesos)
 * @returns Formatted price string (e.g., "₱120.00")
 */
export const formatPrice = (price: number): string => {
  return `${CURRENCY_CONFIG.symbol}${price.toFixed(CURRENCY_CONFIG.decimalPlaces)}`;
};
