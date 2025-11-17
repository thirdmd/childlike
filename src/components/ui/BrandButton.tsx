import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface BrandButtonProps {
  children: ReactNode;
  variant?: "primary" | "outline";
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const BrandButton = ({ 
  children, 
  variant = "primary", 
  href, 
  onClick,
  className = "",
  type = "button",
  disabled = false
}: BrandButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center px-8 py-3 text-sm font-semibold transition-all rounded-md";
  
  const variantStyles = {
    primary: "bg-brand-blue text-brand-white hover:opacity-90",
    outline: "bg-transparent text-foreground border-2 border-brand-black hover:bg-brand-black hover:text-brand-white",
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
    <button onClick={onClick} type={type} disabled={disabled} className={`${styles} disabled:opacity-50 disabled:cursor-not-allowed`}>
      {children}
    </button>
  );
};
