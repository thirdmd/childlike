import { useState, useEffect } from 'react';
import {
  BREAKPOINTS,
  SCREEN_CATEGORIES,
  type Breakpoint,
  type ScreenCategory,
  getScreenCategory,
  isMobile,
  isTablet,
  isDesktop,
} from '@/config/responsive';

/**
 * CENTRALIZED RESPONSIVE HOOK
 *
 * React hook to detect current screen size and respond to window resizing.
 * Use this in components that need different behavior on mobile/tablet/desktop.
 *
 * Examples:
 * ```tsx
 * const { isMobile, isTablet, isDesktop } = useBreakpoint();
 *
 * if (isMobile) {
 *   return <MobileNav />;
 * }
 * return <DesktopNav />;
 * ```
 *
 * ```tsx
 * const { screenCategory } = useBreakpoint();
 *
 * const columns = screenCategory === 'mobile' ? 1 : screenCategory === 'tablet' ? 2 : 3;
 * ```
 */

interface UseBreakpointReturn {
  /** Current screen category: 'mobile' | 'tablet' | 'desktop' */
  screenCategory: ScreenCategory;

  /** True if screen width < 768px */
  isMobile: boolean;

  /** True if screen width >= 768px and < 1024px */
  isTablet: boolean;

  /** True if screen width >= 1024px */
  isDesktop: boolean;

  /** Current window width in pixels */
  width: number;

  /** Check if current width is at least a specific breakpoint */
  isAtLeast: (breakpoint: Breakpoint) => boolean;
}

export const useBreakpoint = (): UseBreakpointReturn => {
  const [width, setWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : BREAKPOINTS.lg
  );

  useEffect(() => {
    // Debounce resize handler for performance
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWidth(window.innerWidth);
      }, 150); // 150ms debounce
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const screenCategory = getScreenCategory();

  return {
    screenCategory,
    isMobile: isMobile(),
    isTablet: isTablet(),
    isDesktop: isDesktop(),
    width,
    isAtLeast: (breakpoint: Breakpoint) => width >= BREAKPOINTS[breakpoint],
  };
};

/**
 * SIMPLIFIED MOBILE-ONLY HOOK
 *
 * Use when you only need to know if screen is mobile or not.
 *
 * Example:
 * ```tsx
 * const isMobileScreen = useIsMobile();
 *
 * return (
 *   <div className={isMobileScreen ? 'p-4' : 'p-8'}>
 *     ...
 *   </div>
 * );
 * ```
 */
export const useIsMobile = (): boolean => {
  const { isMobile } = useBreakpoint();
  return isMobile;
};
