import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const maxWidths = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
};

export const Container = ({ children, className = "", size = "lg" }: ContainerProps) => {
  return (
    <div className={`mx-auto px-4 ${maxWidths[size]} ${className}`}>
      {children}
    </div>
  );
};
