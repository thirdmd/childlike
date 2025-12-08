import { socialLinks } from "@/config/socialLinks";

/**
 * Instagram Icon Component
 * Custom SVG for better quality
 */
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

/**
 * TikTok Icon Component
 * Custom SVG since Lucide doesn't have TikTok
 */
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

interface SocialMediaIconsProps {
  variant?: "footer" | "inline";
}

/**
 * Centralized Social Media Icons Component
 * Used in Footer and Contact page
 */
export const SocialMediaIcons = ({ variant = "footer" }: SocialMediaIconsProps) => {
  const isFooter = variant === "footer";

  const iconClass = isFooter ? "w-5 h-5" : "w-5 h-5";
  const buttonClass = isFooter
    ? "text-foreground/60 hover:text-foreground transition-colors"
    : "group w-10 h-10 rounded-full bg-brand-white/10 hover:bg-brand-white/20 backdrop-blur-sm flex items-center justify-center border border-brand-white/20 hover:border-brand-white/40 transition-all duration-300 hover:scale-110";

  return (
    <div className={isFooter ? "flex items-center gap-4 ml-4 pl-4 border-l border-brand-black/10" : "flex gap-2"}>
      <a
        href={socialLinks.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Follow us on Instagram"
      >
        <InstagramIcon className={`${iconClass} ${isFooter ? "" : "text-brand-white group-hover:scale-110 transition-transform"}`} />
      </a>
      <a
        href={socialLinks.tiktok}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Follow us on TikTok"
      >
        <TikTokIcon className={`${iconClass} ${isFooter ? "" : "text-brand-white group-hover:scale-110 transition-transform"}`} />
      </a>
    </div>
  );
};
