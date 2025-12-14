/**
 * CENTRALIZED RESPONSIVE CONFIGURATION
 *
 * Single source of truth for all screen breakpoints and responsive behavior.
 * Edit this file to adjust responsive breakpoints across the entire app.
 *
 * Usage:
 * - Import BREAKPOINTS for pixel values
 * - Use SCREEN_QUERIES for media queries
 * - Use responsive utilities in components
 */

// ============================================================================
// BREAKPOINTS (Mobile-First Approach)
// ============================================================================

export const BREAKPOINTS = {
  xs: 320,   // Small phones
  sm: 640,   // Large phones (Tailwind default)
  md: 768,   // Tablets (Tailwind default)
  lg: 1024,  // Small laptops (Tailwind default)
  xl: 1280,  // Desktops (Tailwind default)
  '2xl': 1536, // Large desktops (Tailwind default)
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

// ============================================================================
// MEDIA QUERIES (for CSS-in-JS or JS logic)
// ============================================================================

export const SCREEN_QUERIES = {
  xs: `(min-width: ${BREAKPOINTS.xs}px)`,
  sm: `(min-width: ${BREAKPOINTS.sm}px)`,
  md: `(min-width: ${BREAKPOINTS.md}px)`,
  lg: `(min-width: ${BREAKPOINTS.lg}px)`,
  xl: `(min-width: ${BREAKPOINTS.xl}px)`,
  '2xl': `(min-width: ${BREAKPOINTS['2xl']}px)`,

  // Helpful aliases
  mobile: `(max-width: ${BREAKPOINTS.md - 1}px)`,      // < 768px
  tablet: `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`, // 768px - 1023px
  desktop: `(min-width: ${BREAKPOINTS.lg}px)`,         // >= 1024px
} as const;

// ============================================================================
// SCREEN CATEGORIES (for easy component logic)
// ============================================================================

export const SCREEN_CATEGORIES = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
} as const;

export type ScreenCategory = typeof SCREEN_CATEGORIES[keyof typeof SCREEN_CATEGORIES];

// ============================================================================
// RESPONSIVE UTILITIES
// ============================================================================

/**
 * Check if current window width matches a breakpoint
 */
export const isBreakpoint = (breakpoint: Breakpoint): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS[breakpoint];
};

/**
 * Get current screen category
 */
export const getScreenCategory = (): ScreenCategory => {
  if (typeof window === 'undefined') return SCREEN_CATEGORIES.DESKTOP;

  const width = window.innerWidth;

  if (width < BREAKPOINTS.md) return SCREEN_CATEGORIES.MOBILE;
  if (width < BREAKPOINTS.lg) return SCREEN_CATEGORIES.TABLET;
  return SCREEN_CATEGORIES.DESKTOP;
};

/**
 * Check if current screen is mobile
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < BREAKPOINTS.md;
};

/**
 * Check if current screen is tablet
 */
export const isTablet = (): boolean => {
  if (typeof window === 'undefined') return false;
  const width = window.innerWidth;
  return width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
};

/**
 * Check if current screen is desktop
 */
export const isDesktop = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS.lg;
};
