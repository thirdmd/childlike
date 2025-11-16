import { Link } from "react-router-dom";
import { siteConfig } from "@/config/site";

export const Header = () => {
  return (
    <header className="border-b border-brand-black/10 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight text-foreground">
            {siteConfig.siteName}
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            {siteConfig.primaryNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-sm font-medium text-foreground hover:text-brand-blue transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
