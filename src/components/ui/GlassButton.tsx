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
    const baseStyles = "relative overflow-hidden backdrop-blur-xl border transition-all duration-300 flex items-center justify-center";
    
    const variantStyles = {
      pill: "px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap",
      icon: "w-10 h-10 rounded-full",
    };

    const glassStyles = `
      bg-brand-white/10
      border-brand-white/20
      shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]
      hover:bg-brand-white/20
      hover:border-brand-white/30
      hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]
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
