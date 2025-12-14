/**
 * RESPONSIVE DESIGN TOKENS
 *
 * Centralized design values that scale across different screen sizes.
 * Edit this file to adjust spacing, typography, and layout values for mobile/tablet/desktop.
 *
 * Following Childlike brand guidelines:
 * - Clean, minimal, Apple-like aesthetic
 * - Consistent spacing system
 * - Typography hierarchy that scales gracefully
 */

import type { ScreenCategory } from './responsive';

// ============================================================================
// SPACING SCALE (Mobile-First)
// ============================================================================

export const SPACING = {
  mobile: {
    section: {
      py: 'py-12',        // Vertical padding for sections
      px: 'px-4',         // Horizontal padding for containers
      gap: 'gap-8',       // Gap between elements
    },
    container: {
      maxW: 'max-w-full',
      px: 'px-4',
    },
    card: {
      p: 'p-4',
      gap: 'gap-4',
    },
  },
  tablet: {
    section: {
      py: 'py-16',
      px: 'px-6',
      gap: 'gap-12',
    },
    container: {
      maxW: 'max-w-4xl',
      px: 'px-6',
    },
    card: {
      p: 'p-6',
      gap: 'gap-6',
    },
  },
  desktop: {
    section: {
      py: 'py-24',
      px: 'px-8',
      gap: 'gap-16',
    },
    container: {
      maxW: 'max-w-7xl',
      px: 'px-8',
    },
    card: {
      p: 'p-8',
      gap: 'gap-8',
    },
  },
} as const;

// ============================================================================
// TYPOGRAPHY SCALE (Mobile-First)
// ============================================================================

export const TYPOGRAPHY = {
  mobile: {
    h1: 'text-4xl font-bold',           // 36px
    h2: 'text-3xl font-bold',           // 30px
    h3: 'text-2xl font-semibold',       // 24px
    h4: 'text-xl font-semibold',        // 20px
    body: 'text-base',                  // 16px
    small: 'text-sm',                   // 14px
    button: 'text-base font-semibold',  // 16px
  },
  tablet: {
    h1: 'text-5xl font-bold',           // 48px
    h2: 'text-4xl font-bold',           // 36px
    h3: 'text-3xl font-semibold',       // 30px
    h4: 'text-2xl font-semibold',       // 24px
    body: 'text-lg',                    // 18px
    small: 'text-base',                 // 16px
    button: 'text-lg font-semibold',    // 18px
  },
  desktop: {
    h1: 'text-6xl font-bold',           // 60px
    h2: 'text-5xl font-bold',           // 48px
    h3: 'text-4xl font-semibold',       // 36px
    h4: 'text-3xl font-semibold',       // 30px
    body: 'text-lg',                    // 18px
    small: 'text-base',                 // 16px
    button: 'text-lg font-semibold',    // 18px
  },
} as const;

// ============================================================================
// LAYOUT PATTERNS (Common responsive layouts)
// ============================================================================

export const LAYOUTS = {
  // Grid columns
  grid: {
    mobile: 'grid-cols-1',
    tablet: 'grid-cols-2',
    desktop: 'grid-cols-3',
  },

  // Product grids
  productGrid: {
    mobile: 'grid-cols-1',
    tablet: 'grid-cols-2',
    desktop: 'grid-cols-3',
  },

  // Hero sections
  hero: {
    mobile: 'flex-col gap-8',
    tablet: 'flex-col gap-12',
    desktop: 'flex-row gap-16 items-center',
  },

  // Navigation
  nav: {
    mobile: 'flex-col gap-4',
    tablet: 'flex-row gap-6',
    desktop: 'flex-row gap-8',
  },
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get responsive spacing for current screen category
 */
export const getSpacing = (category: ScreenCategory) => {
  return SPACING[category];
};

/**
 * Get responsive typography for current screen category
 */
export const getTypography = (category: ScreenCategory) => {
  return TYPOGRAPHY[category];
};

/**
 * Get responsive layout classes for current screen category
 */
export const getLayout = (category: ScreenCategory) => {
  return LAYOUTS;
};

/**
 * Build responsive Tailwind classes using mobile-first approach
 *
 * Example:
 * ```tsx
 * const classes = responsiveClass({
 *   mobile: 'text-2xl p-4',
 *   tablet: 'text-3xl p-6',
 *   desktop: 'text-4xl p-8',
 * });
 * // Result: "text-2xl p-4 md:text-3xl md:p-6 lg:text-4xl lg:p-8"
 * ```
 */
export const responsiveClass = (config: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
}): string => {
  const classes: string[] = [];

  if (config.mobile) classes.push(config.mobile);
  if (config.tablet) classes.push(`md:${config.tablet.split(' ').join(' md:')}`);
  if (config.desktop) classes.push(`lg:${config.desktop.split(' ').join(' lg:')}`);

  return classes.join(' ');
};
