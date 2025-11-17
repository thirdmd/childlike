import { Link } from "react-router-dom";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { User, ShoppingBag } from "lucide-react";
import childlikeLogo from "@/assets/childlike-logo.png";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-brand-blue sticky top-0 z-50 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={childlikeLogo} alt="Childlike" className="h-13 w-auto" />
          </Link>

          {/* Desktop Navigation - Pill style buttons */}
          <nav className="hidden lg:flex items-center gap-3">
            {siteConfig.primaryNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-6 py-2.5 rounded-full text-sm font-medium text-brand-white bg-brand-white/10 hover:bg-brand-white/20 backdrop-blur-sm border border-brand-white/10 hover:border-brand-white/30 transition-all duration-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side - User & Cart icons */}
          <div className="hidden lg:flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-brand-white/10 hover:bg-brand-white/20 backdrop-blur-sm flex items-center justify-center border border-brand-white/10 hover:border-brand-white/30 transition-all duration-300">
              <User className="w-5 h-5 text-brand-white" />
            </button>
            <button className="w-10 h-10 rounded-full bg-brand-white/10 hover:bg-brand-white/20 backdrop-blur-sm flex items-center justify-center border border-brand-white/10 hover:border-brand-white/30 transition-all duration-300 relative">
              <ShoppingBag className="w-5 h-5 text-brand-white" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-white text-brand-blue rounded-full flex items-center justify-center text-xs font-bold">
                0
              </span>
            </button>
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
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-6 py-3 rounded-full text-sm font-medium text-brand-white bg-brand-white/10 hover:bg-brand-white/20 backdrop-blur-sm border border-brand-white/10 transition-all"
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
              <button className="flex-1 px-6 py-3 rounded-full text-sm font-medium text-brand-white bg-brand-white/10 hover:bg-brand-white/20 backdrop-blur-sm border border-brand-white/10 flex items-center justify-center gap-2 relative">
                <ShoppingBag className="w-4 h-4" />
                Cart
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-white text-brand-blue rounded-full flex items-center justify-center text-xs font-bold">
                  0
                </span>
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
