import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { siteConfig } from "@/config/site";
import { iconButtonHoverClass } from "@/config/interactionStyles";
import { ShoppingBag, User, Phone } from "lucide-react";
import childlikeLogo from "@/assets/childlike-logo.png";
import { useCart } from "@/context/CartContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Avatar } from "@/components/Avatar";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, profile } = useCurrentUser();
  const displayCount = itemCount > 9 ? "9+" : itemCount.toString();

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

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
    const baseClass = `font-black text-brand-white transition-all duration-300 border-b-[3px]`;
    const activeClass = isActive
      ? `scale-110 border-brand-white`
      : `border-transparent md:hover:scale-125 md:hover:opacity-100 active:scale-[1.03] active:opacity-90`;
    return `${baseClass} ${activeClass}`;
  };

  return (
    <>
      {/* Backdrop overlay when mobile menu is open */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <header className="bg-brand-blue sticky top-0 z-[100] backdrop-blur-xl border-b border-brand-white/5">
        <div className="w-full">
          <div className="relative flex h-20 items-center justify-between lg:justify-start px-3 md:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className={`flex items-center justify-start z-10 ${iconButtonHoverClass}`}>
            <img
              src={childlikeLogo}
              alt="Childlike"
              className="h-12 md:h-[52px] w-auto drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]"
            />
          </Link>

          {/* Desktop Navigation - Bold Bricolage Grotesque */}
          <nav className="hidden lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:flex items-center justify-center gap-6">
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
              <button
                onClick={() => navigate("/contact")}
                className={`w-10 h-10 rounded-full bg-brand-white/10 md:hover:bg-brand-white/20 backdrop-blur-sm flex items-center justify-center border border-brand-white/10 md:hover:border-brand-white/30 active:opacity-80 transition-all duration-300 ${iconButtonHoverClass}`}
                aria-label="Go to contact"
              >
                <Phone className="w-5 h-5 text-brand-white" />
              </button>
              <button
                onClick={() => navigate(user ? "/account" : "/auth/login")}
                className={`w-10 h-10 rounded-full bg-brand-white/10 md:hover:bg-brand-white/20 backdrop-blur-sm flex items-center justify-center border border-brand-white/10 md:hover:border-brand-white/30 active:opacity-80 transition-all duration-300 ${iconButtonHoverClass}`}
                aria-label={user ? "Go to account" : "Sign in"}
              >
                {user && user.id ? (
                  <Avatar userId={user.id} fullName={profile?.full_name} email={user.email} size="sm" profilePictureUrl={profile?.profile_picture_url} />
                ) : (
                  <User className="w-5 h-5 text-brand-white" />
                )}
              </button>
              <button
                onClick={() => navigate("/cart")}
                className={`w-10 h-10 rounded-full bg-brand-white/10 md:hover:bg-brand-white/20 backdrop-blur-sm flex items-center justify-center border border-brand-white/10 md:hover:border-brand-white/30 active:opacity-80 transition-all duration-300 relative ${iconButtonHoverClass}`}
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
              className="lg:hidden p-2 rounded-lg md:hover:bg-brand-white/10 active:opacity-80 transition-all duration-300"
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
            {siteConfig.primaryNav.map((item) => {
              const isActive = isNavItemActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-6 py-2"
                >
                  <span
                    className={`inline-block font-black text-brand-white text-lg transition-all duration-300 border-b-[3px] ${
                      isActive
                        ? "border-brand-white scale-110"
                        : "border-transparent md:hover:scale-125 active:scale-[1.03] active:opacity-90"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}

            {/* Mobile user actions */}
            <div className="flex gap-2 pt-4 px-6">
              <button
                onClick={() => {
                  navigate(user ? "/account" : "/auth/login");
                  setMobileMenuOpen(false);
                }}
                className="flex-1 px-3 py-2.5 rounded-full text-[clamp(0.75rem,3vw,0.875rem)] font-medium text-brand-white bg-brand-white/10 md:hover:bg-brand-white/20 backdrop-blur-sm border border-brand-white/10 active:opacity-80 transition-all duration-300 flex items-center justify-center gap-1.5"
              >
                {user && user.id ? (
                  <>
                    <Avatar userId={user.id} fullName={profile?.full_name} email={user.email} size="sm" profilePictureUrl={profile?.profile_picture_url} />
                    <span className="whitespace-nowrap">Account</span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">Sign In</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  navigate("/contact");
                  setMobileMenuOpen(false);
                }}
                className="flex-1 px-3 py-2.5 rounded-full text-[clamp(0.75rem,3vw,0.875rem)] font-medium text-brand-white bg-brand-white/10 md:hover:bg-brand-white/20 backdrop-blur-sm border border-brand-white/10 active:opacity-80 transition-all duration-300 flex items-center justify-center gap-1.5"
                aria-label="Go to contact"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">Contact</span>
              </button>
              <button
                onClick={() => {
                  navigate("/cart");
                  setMobileMenuOpen(false);
                }}
                className="flex-1 px-3 py-2.5 rounded-full text-[clamp(0.75rem,3vw,0.875rem)] font-medium text-brand-white bg-brand-white/10 md:hover:bg-brand-white/20 backdrop-blur-sm border border-brand-white/10 active:opacity-80 transition-all duration-300 flex items-center justify-center gap-1.5 relative"
                aria-label="Go to cart"
              >
                <ShoppingBag className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">Cart</span>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-white text-brand-blue rounded-full flex items-center justify-center text-xs font-bold">
                  {displayCount}
                </span>
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
    </>
  );
};
