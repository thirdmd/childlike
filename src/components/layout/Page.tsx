import { ReactNode } from "react";

interface PageProps {
  children: ReactNode;
  className?: string;
}

export const Page = ({ children, className = "" }: PageProps) => {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {children}
    </div>
  );
};
