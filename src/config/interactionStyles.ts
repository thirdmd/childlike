/**
 * CENTRALIZED INTERACTION STYLES
 * Single source of truth for all hover effects and interactive element behaviors
 * Applied across: nav items, buttons, icons, links - entire website
 *
 * Rule: All interactive elements MUST use these classes
 * No hardcoding hover effects in components!
 */

/**
 * Standard hover effect for interactive elements
 * Scale up 25% with smooth transition
 * Used for: nav items, icons, buttons, back button, links
 */
export const interactiveHoverEffect = `
  transition-all duration-300
  hover:scale-125
`;

/**
 * Navigation item class (used in Header)
 * Active state: scale 110% with white underline
 * Inactive state: transparent border, interactive hover
 */
export const getNavItemClass = (isActive: boolean): string => {
  const baseClass = `
    font-black text-brand-white
    transition-all duration-300
    border-b-4
  `;

  const activeClass = isActive
    ? `scale-110 border-brand-white`
    : `border-transparent hover:scale-125 hover:opacity-100`;

  return `${baseClass} ${activeClass}`;
};

/**
 * Icon button class (Account, Cart, Back button)
 * Includes: scale up, smooth animation
 * Used for: User icon, Shopping bag icon, Back button
 */
export const iconButtonHoverClass = `
  transition-all duration-300
  hover:scale-125
`;

/**
 * Standard button class
 * Smooth scale and color transition
 */
export const buttonHoverClass = `
  transition-all duration-300
  hover:scale-105
  hover:opacity-90
`;

/**
 * Link hover effect
 * Subtle scale up
 */
export const linkHoverClass = `
  transition-all duration-300
  hover:scale-105
`;

/**
 * Form input/interactive element hover
 * Brightness and scale
 */
export const formElementHoverClass = `
  transition-all duration-300
  hover:brightness-110
`;

/**
 * Quantity control button hover (+ and - buttons)
 * Subtle effect that doesn't cause layout shift
 * Uses opacity + shadow only, NO scale
 */
export const quantityButtonHoverClass = `
  transition-all duration-300
  hover:opacity-80
  hover:shadow-lg
`;
