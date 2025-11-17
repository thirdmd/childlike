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
    const variantStyles = {
      pill: "px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap",
      icon: "w-11 h-11 rounded-full",
    };

    const combinedClassName = cn(
      "group relative overflow-hidden transition-all duration-300 flex items-center justify-center",
      variantStyles[variant],
      className
    );

    const content = (
      <>
        {/* Glass background layer */}
        <div className="absolute inset-0 bg-brand-white/10 backdrop-blur-md border border-brand-white/20" />
        
        {/* Hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-white/20 to-brand-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Inner glow effect on hover */}
        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(255,255,255,0)] group-hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] transition-shadow duration-300" />
        
        {/* Content */}
        <span className="relative text-brand-white drop-shadow-sm flex items-center justify-center gap-2">
          {children}
        </span>
      </>
    );

    if (to) {
      return (
        <Link
          to={to}
          className={combinedClassName}
          ref={ref as React.Ref<HTMLAnchorElement>}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        onClick={onClick}
        className={combinedClassName}
        ref={ref as React.Ref<HTMLButtonElement>}
      >
        {content}
      </button>
    );
  }
);

GlassButton.displayName = "GlassButton";
