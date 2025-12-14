import { Link } from "react-router-dom";
import { Product } from "@/config/products";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="block border border-brand-black/10 rounded-lg p-6 md:hover:border-brand-blue active:border-brand-blue/50 active:opacity-90 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-h3">{product.name}</h3>
        <span 
          className={`text-small px-3 py-1 rounded-full ${
            product.status === "available" 
              ? "bg-brand-blue text-brand-white" 
              : "bg-brand-black/5 text-foreground/60"
          }`}
        >
          {product.status === "available" ? "Available" : "Coming Soon"}
        </span>
      </div>
      
      <p className="text-body text-foreground/70 mb-4">{product.tagline}</p>
      
      <div className="flex items-center gap-4 text-small">
        <span className="font-semibold text-brand-blue">
          {product.macros.protein}g protein
        </span>
        <span className="text-foreground/40">•</span>
        <span className="text-foreground/60">
          {product.macros.sugar}g sugar
        </span>
      </div>
    </Link>
  );
};
