import { Link } from "react-router-dom";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { User, ShoppingBag } from "lucide-react";
import childlikeLogo from "@/assets/childlike-logo.png";
import { GlassButton } from "@/components/ui/GlassButton";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Glassmorphism background with blur */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/80 via-brand-blue/70 to-brand-blue/60 backdrop-blur-2xl" />
      
      {/* Shimmer overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-white/5 to-transparent animate-shimmer" />
      
      {/* Border gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-white/20 to-transparent" />
      
      <div className="relative container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-3 h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-start group">
            <div className="relative">
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-brand-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img 
                src={childlikeLogo} 
                alt="Childlike" 
                className="relative h-[52px] w-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" 
              />
            </div>
          </Link>

          {/* Desktop Navigation - Pill style buttons - Centered */}
          <nav className="hidden lg:flex items-center justify-center gap-2">
            {siteConfig.primaryNav.map((item) => (
              <GlassButton key={item.path} to={item.path} variant="pill">
                {item.label}
              </GlassButton>
            ))}
          </nav>

          {/* Right side - User & Cart icons */}
          <div className="hidden lg:flex items-center justify-end gap-2">
            <GlassButton variant="icon">
              <User className="w-5 h-5" />
            </GlassButton>
            <div className="relative">
              <GlassButton variant="icon">
                <ShoppingBag className="w-5 h-5" />
              </GlassButton>
              {/* Glass badge with proper overlap */}
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-brand-white/90 backdrop-blur-sm" />
                <span className="relative text-brand-blue text-xs font-bold flex items-center justify-center h-full">
                  0
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden relative w-10 h-10 rounded-lg overflow-hidden group justify-self-end"
            aria-label="Toggle menu"
          >
            <div className="absolute inset-0 bg-brand-white/10 backdrop-blur-md border border-brand-white/20" />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-white/20 to-brand-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative w-6 h-5 flex flex-col justify-between mx-auto">
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
                className="w-full"
              >
                {item.label}
              </GlassButton>
            ))}

            {/* Mobile user actions */}
            <div className="flex gap-2 pt-4">
              <GlassButton variant="pill" className="flex-1">
                <User className="w-4 h-4" />
                Account
              </GlassButton>
              <div className="relative flex-1">
                <GlassButton variant="pill" className="w-full">
                  <ShoppingBag className="w-4 h-4" />
                  Cart
                </GlassButton>
                {/* Glass badge with proper overlap */}
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 bg-brand-white/90 backdrop-blur-sm" />
                  <span className="relative text-brand-blue text-xs font-bold flex items-center justify-center h-full">
                    0
                  </span>
                </div>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
