import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface BrandButtonProps {
  children: ReactNode;
  variant?: "primary" | "outline";
  href?: string;
  onClick?: () => void;
  className?: string;
}

export const BrandButton = ({ 
  children, 
  variant = "primary", 
  href, 
  onClick,
  className = "" 
}: BrandButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center px-8 py-3 text-sm font-semibold transition-all rounded-md";
  
  const variantStyles = {
    primary: "bg-brand-blue text-brand-white md:hover:opacity-90 active:opacity-80",
    outline: "bg-transparent text-foreground border-2 border-brand-black md:hover:bg-brand-black md:hover:text-brand-white active:opacity-80",
  };

  const styles = `${baseStyles} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link to={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={styles}>
      {children}
    </button>
  );
};
