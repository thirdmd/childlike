import { Link } from "react-router-dom";
import { siteConfig } from "@/config/site";

export const Footer = () => {
  return (
    <footer className="border-t border-brand-black/10 bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-foreground/60">
            {siteConfig.footerCopy}
          </p>
          
          <div className="flex items-center gap-6">
            {siteConfig.footerLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-sm text-foreground/60 hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
