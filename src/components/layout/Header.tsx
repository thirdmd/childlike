import { Link } from "react-router-dom";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { User, ShoppingBag } from "lucide-react";
import childlikeLogo from "@/assets/childlike-logo.png";
import { GlassButton } from "@/components/ui/GlassButton";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-brand-blue sticky top-0 z-50 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-3 h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-start">
            <img src={childlikeLogo} alt="Childlike" className="h-[52px] w-auto" />
          </Link>

          {/* Desktop Navigation - Pill style buttons - Centered */}
          <nav className="hidden lg:flex items-center justify-center gap-3">
            {siteConfig.primaryNav.map((item) => (
              <GlassButton key={item.path} to={item.path} variant="pill">
                {item.label}
              </GlassButton>
            ))}
          </nav>

          {/* Right side - User & Cart icons */}
          <div className="hidden lg:flex items-center justify-end gap-3">
            <GlassButton variant="icon">
              <User className="w-5 h-5" />
            </GlassButton>
            <div className="relative">
              <GlassButton variant="icon">
                <ShoppingBag className="w-5 h-5" />
              </GlassButton>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-white text-brand-blue rounded-full flex items-center justify-center text-xs font-bold pointer-events-none">
                0
              </span>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-brand-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`block h-0.5 w-full bg-brand-white transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block h-0.5 w-full bg-brand-white transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-full bg-brand-white transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-brand-white/10 py-6 space-y-2">
            {siteConfig.primaryNav.map((item) => (
              <GlassButton
                key={item.path}
                to={item.path}
                variant="pill"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full"
              >
                {item.label}
              </GlassButton>
            ))}

            {/* Mobile user actions */}
            <div className="flex gap-2 pt-4">
              <GlassButton variant="pill" className="flex-1 flex items-center justify-center gap-2">
                <User className="w-4 h-4" />
                Account
              </GlassButton>
              <div className="relative flex-1">
                <GlassButton variant="pill" className="w-full flex items-center justify-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Cart
                </GlassButton>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-white text-brand-blue rounded-full flex items-center justify-center text-xs font-bold pointer-events-none">
                  0
                </span>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
