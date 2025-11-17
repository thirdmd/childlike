import { forwardRef, ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface GlassButtonProps {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  className?: string;
  variant?: "pill" | "icon";
  asChild?: boolean;
}

export const GlassButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, GlassButtonProps>(
  ({ children, to, onClick, className, variant = "pill", asChild = false }, ref) => {
    const baseStyles = "relative overflow-hidden backdrop-blur-md border transition-all duration-300";
    
    const variantStyles = {
      pill: "px-6 py-2.5 rounded-full text-sm font-medium",
      icon: "w-10 h-10 rounded-full flex items-center justify-center",
    };

    const glassStyles = `
      bg-gradient-to-br from-brand-white/15 to-brand-white/5
      border-brand-white/20
      shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_16px_rgba(0,0,0,0.1)]
      hover:from-brand-white/25 hover:to-brand-white/10
      hover:border-brand-white/40
      hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_6px_20px_rgba(0,0,0,0.15)]
      hover:scale-105
      active:scale-95
      text-brand-white
    `;

    const combinedClassName = cn(
      baseStyles,
      variantStyles[variant],
      glassStyles,
      className
    );

    if (to) {
      return (
        <Link
          to={to}
          className={combinedClassName}
          ref={ref as React.Ref<HTMLAnchorElement>}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        onClick={onClick}
        className={combinedClassName}
        ref={ref as React.Ref<HTMLButtonElement>}
      >
        {children}
      </button>
    );
  }
);

GlassButton.displayName = "GlassButton";
