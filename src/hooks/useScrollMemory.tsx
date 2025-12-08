import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const STORAGE_KEY = "scroll-positions";

// Get all saved scroll positions
const getScrollPositions = (): Record<string, number> => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

// Save scroll position for a specific path
const saveScrollPosition = (path: string, position: number) => {
  try {
    const positions = getScrollPositions();
    positions[path] = position;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch {
    // Silent fail
  }
};

export const useScrollMemory = () => {
  const location = useLocation();
  const lastPathRef = useRef<string>("");

  useEffect(() => {
    const currentPath = location.pathname;

    // Save scroll position of previous page
    if (lastPathRef.current && lastPathRef.current !== currentPath) {
      saveScrollPosition(lastPathRef.current, window.scrollY);
    }

    // Get saved scroll position for current page
    const positions = getScrollPositions();
    const savedPosition = positions[currentPath];

    // Use setTimeout to ensure DOM is ready and restore happens after render
    const timeoutId = setTimeout(() => {
      if (savedPosition !== undefined) {
        // Restore to saved position
        window.scrollTo(0, savedPosition);
      } else {
        // New page - scroll to top
        window.scrollTo(0, 0);
      }
    }, 0);

    // Update last path
    lastPathRef.current = currentPath;

    // Save scroll position periodically while on this page
    const handleScroll = () => {
      saveScrollPosition(currentPath, window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
      // Save one final time on unmount
      saveScrollPosition(currentPath, window.scrollY);
    };
  }, [location.pathname]);
};
