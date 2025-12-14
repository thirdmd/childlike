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
 * Scale up 25% with smooth transition on desktop only
 * Mobile: Uses active state for tap feedback
 * Used for: nav items, icons, buttons, back button, links
 */
export const interactiveHoverEffect = `
  transition-all duration-300
  md:hover:scale-125
  active:scale-[1.03] active:opacity-90
`;

/**
 * Navigation item class (used in Header)
 * Active state: scale 110% with white underline
 * Inactive state: transparent border, desktop hover only
 * Mobile: active tap feedback instead of hover
 */
export const getNavItemClass = (isActive: boolean): string => {
  const baseClass = `
    font-black text-brand-white
    transition-all duration-300
    border-b-4
  `;

  const activeClass = isActive
    ? `scale-110 border-brand-white`
    : `border-transparent md:hover:scale-125 md:hover:opacity-100 active:scale-[1.03] active:opacity-90`;

  return `${baseClass} ${activeClass}`;
};

/**
 * Icon button class (Account, Cart, Back button)
 * Desktop: Scale up 25% on hover
 * Mobile: Tap feedback with active state
 * Used for: User icon, Shopping bag icon, Back button
 */
export const iconButtonHoverClass = `
  transition-all duration-300
  md:hover:scale-125
  active:scale-[1.03] active:opacity-90
`;

/**
 * Standard button class
 * Desktop: Smooth scale and color transition
 * Mobile: Active tap feedback instead of hover
 */
export const buttonHoverClass = `
  transition-all duration-300
  md:hover:scale-105
  md:hover:opacity-90
  active:scale-[1.03] active:opacity-90
`;

/**
 * Link hover effect
 * Desktop: Subtle scale up
 * Mobile: Active tap feedback instead of hover
 */
export const linkHoverClass = `
  transition-all duration-300
  md:hover:scale-105
  active:scale-[1.03] active:opacity-90
`;

/**
 * Form input/interactive element hover
 * Desktop: Brightness and scale
 * Mobile: Active tap feedback instead of hover
 */
export const formElementHoverClass = `
  transition-all duration-300
  md:hover:brightness-110
  active:opacity-80
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
