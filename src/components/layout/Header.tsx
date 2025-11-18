import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { iconButtonHoverClass } from "@/config/interactionStyles";
import { User, ShoppingBag } from "lucide-react";
import childlikeLogo from "@/assets/childlike-logo.png";
import { useCart } from "@/context/CartContext";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const displayCount = itemCount > 9 ? "9+" : itemCount.toString();

  /**
   * Determine if a nav item is active based on current route
   * Centralized: Used for both desktop and mobile navigation
   */
  const isNavItemActive = (path: string): boolean => {
    return location.pathname === path;
  };

  /**
   * Get active nav item class
   * Centralized: Imported from @/config/interactionStyles
   * Premium & Modern: Scale + clean white bottom border for active state
   */
  const getNavItemClassLocal = (path: string): string => {
    const isActive = isNavItemActive(path);
    const baseClass = `font-black text-brand-white transition-all duration-300 border-b-4`;
    const activeClass = isActive
      ? `scale-110 border-brand-white`
      : `border-transparent hover:scale-125 hover:opacity-100`;
    return `${baseClass} ${activeClass}`;
  };

  return (
    <header className="bg-brand-blue sticky top-0 z-50 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="relative flex h-20 items-center justify-between lg:justify-start">
          {/* Logo */}
          <Link to="/" className={`flex items-center justify-start z-10 ${iconButtonHoverClass}`}>
            <img
              src={childlikeLogo}
              alt="Childlike"
              className="h-[52px] w-auto drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]"
            />
          </Link>

          {/* Desktop Navigation - Bold Bricolage Grotesque */}
          <nav className="hidden lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:flex items-center justify-center gap-6">
            {siteConfig.primaryNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-xl ${getNavItemClassLocal(item.path)}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side - User & Cart icons + Mobile Toggle */}
          <div className="flex items-center justify-end gap-3 ml-auto">
            <div className="hidden lg:flex items-center gap-3">
              <button className={`w-10 h-10 rounded-full bg-brand-white/10 hover:bg-brand-white/20 backdrop-blur-sm flex items-center justify-center border border-brand-white/10 hover:border-brand-white/30 ${iconButtonHoverClass}`}>
                <User className="w-5 h-5 text-brand-white" />
              </button>
              <button
                onClick={() => navigate("/cart")}
                className={`w-10 h-10 rounded-full bg-brand-white/10 hover:bg-brand-white/20 backdrop-blur-sm flex items-center justify-center border border-brand-white/10 hover:border-brand-white/30 relative ${iconButtonHoverClass}`}
                aria-label="Go to cart"
              >
                <ShoppingBag className="w-5 h-5 text-brand-white" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-white text-brand-blue rounded-full flex items-center justify-center text-xs font-bold">
                  {displayCount}
                </span>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-brand-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-center gap-[7px] relative">
                <span
                  className={`block h-0.5 w-full bg-brand-white transition-all duration-300 ${mobileMenuOpen ? "rotate-45 absolute top-1/2 -translate-y-1/2" : ""}`}
                />
                <span
                  className={`block h-0.5 w-full bg-brand-white transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`block h-0.5 w-full bg-brand-white transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 absolute top-1/2 -translate-y-1/2" : ""}`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-brand-white/10 py-4 space-y-2">
            {siteConfig.primaryNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-lg px-6 py-2 ${getNavItemClassLocal(item.path)}`}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile user actions */}
            <div className="flex gap-2 pt-4">
              <button className="flex-1 px-6 py-3 rounded-full text-sm font-medium text-brand-white bg-brand-white/10 hover:bg-brand-white/20 backdrop-blur-sm border border-brand-white/10 flex items-center justify-center gap-2">
                <User className="w-4 h-4" />
                Account
              </button>
              <button
                onClick={() => {
                  navigate("/cart");
                  setMobileMenuOpen(false);
                }}
                className="flex-1 px-6 py-3 rounded-full text-sm font-medium text-brand-white bg-brand-white/10 hover:bg-brand-white/20 backdrop-blur-sm border border-brand-white/10 flex items-center justify-center gap-2 relative"
                aria-label="Go to cart"
              >
                <ShoppingBag className="w-4 h-4" />
                Cart
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-white text-brand-blue rounded-full flex items-center justify-center text-xs font-bold">
                  {displayCount}
                </span>
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
