import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const Section = ({ children, className = "", fullWidth = false }: SectionProps) => {
  return (
    <section className={`py-16 md:py-24 ${className}`}>
      {fullWidth ? children : <div className="container mx-auto px-4">{children}</div>}
    </section>
  );
};
