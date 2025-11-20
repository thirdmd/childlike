/**
 * CENTRALIZED QUANTITY CONTROL RULES
 * Single source of truth for quantity control logic across the entire app
 * Minimum: 1 (never 0)
 * Maximum: 99
 */

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 99;

/**
 * Check if quantity can be decreased
 * Returns true only if quantity is greater than minimum (1)
 */
export const canDecreaseQuantity = (quantity: number): boolean => {
  return quantity > MIN_QUANTITY;
};

/**
 * Check if quantity can be increased
 * Returns true only if quantity is less than maximum (99)
 */
export const canIncreaseQuantity = (quantity: number): boolean => {
  return quantity < MAX_QUANTITY;
};

/**
 * Get disabled state for decrease button
 * Button is disabled when quantity is at minimum
 */
export const isDecreaseDisabled = (quantity: number): boolean => {
  return !canDecreaseQuantity(quantity);
};

/**
 * Get disabled state for increase button
 * Button is disabled when quantity is at maximum
 */
export const isIncreaseDisabled = (quantity: number): boolean => {
  return !canIncreaseQuantity(quantity);
};

/**
 * Safe decrease quantity
 * Returns new quantity if can decrease, otherwise returns current quantity
 */
export const decreaseQuantity = (quantity: number): number => {
  return canDecreaseQuantity(quantity) ? quantity - 1 : quantity;
};

/**
 * Safe increase quantity
 * Returns new quantity if can increase, otherwise returns current quantity
 */
export const increaseQuantity = (quantity: number): number => {
  return canIncreaseQuantity(quantity) ? quantity + 1 : quantity;
};
