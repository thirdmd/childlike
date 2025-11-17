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
    const baseStyles = "relative overflow-hidden backdrop-blur-md border transition-all duration-300 flex items-center justify-center";
    
    const variantStyles = {
      pill: "px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap",
      icon: "w-10 h-10 rounded-full",
    };

    const glassStyles = `
      bg-gradient-to-br from-brand-white/35 to-brand-white/25
      border-brand-white/30
      shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_16px_rgba(0,0,0,0.15)]
      hover:from-brand-white/45 hover:to-brand-white/35
      hover:border-brand-white/50
      hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_6px_20px_rgba(0,0,0,0.2)]
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
