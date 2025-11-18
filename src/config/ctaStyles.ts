/**
 * Centralized Call-to-Action (CTA) styling
 * Old school NYC playful design with bold colors
 */

export const CTA_CONFIG = {
  colors: {
    primary: "#ffae00", // Yellow mustard
    secondary: "#e61901", // Bold red
    text: "#000000", // Black text for contrast
  },
};

/**
 * Primary CTA button styling - for main actions like "Join Waitlist", "Buy Now"
 * Features a thick red border with smaller yellow pill inside (old school NYC style)
 */
export const ctaPrimaryButtonClassName = `
  bg-[#ffae00] text-black px-6 py-2 rounded-full font-bold
  border-[5px] border-[#e61901]
  hover:bg-[#ff9800] hover:border-[#c41200] hover:shadow-xl hover:scale-105
  disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
  transition-all duration-200
  flex items-center gap-2
  shadow-lg
  uppercase tracking-wide text-sm
`;
