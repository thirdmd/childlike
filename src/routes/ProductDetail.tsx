import { useParams, Link } from "react-router-dom";
import { Page } from "@/components/layout/Page";
import { productsConfig, getProductBySlug } from "@/config/products";
import { BrandButton } from "@/components/ui/BrandButton";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : null;

  if (!product) {
    return (
      <Page>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-h1 mb-4">Product not found</h1>
            <Link to="/products" className="text-brand-blue hover:underline">
              Back to products
            </Link>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page className="bg-brand-blue">
      {/* Back button */}
      <div className="container mx-auto px-4 pt-6">
        <Link 
          to="/products" 
          className="inline-flex items-center gap-2 text-brand-white/70 hover:text-brand-white transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </div>

      {/* Product Detail Section */}
      <div className="container mx-auto px-4 min-h-screen flex items-center py-12">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Product Name & Details */}
          <div className="lg:col-span-3 space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-white leading-tight">
              {product.name}
            </h1>
            <p className="text-brand-white/70 text-lg">
              {product.tagline}
            </p>
          </div>

          {/* Center: Large Product Image */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-md aspect-square">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-brand-white/5 rounded-full blur-3xl scale-110" />
              
              {/* Product placeholder */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-[85%] h-[85%] bg-brand-white/10 backdrop-blur-md rounded-3xl border border-brand-white/20 flex items-center justify-center animate-float">
                  <p className="text-brand-white/30 text-sm font-medium">PRODUCT IMAGE</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Macros & Info */}
          <div className="lg:col-span-3 space-y-6">
            {/* Macro circles */}
            <div className="flex gap-3">
              <div className="w-16 h-16 rounded-full bg-brand-white/20 backdrop-blur-sm flex items-center justify-center border border-brand-white/30">
                <div className="text-center">
                  <p className="text-brand-white font-bold text-sm">{product.macros.protein}g</p>
                  <p className="text-brand-white/60 text-xs">protein</p>
                </div>
              </div>
              <div className="w-16 h-16 rounded-full bg-brand-white/10 backdrop-blur-sm flex items-center justify-center border border-brand-white/20">
                <div className="text-center">
                  <p className="text-brand-white font-bold text-sm">{product.macros.sugar}g</p>
                  <p className="text-brand-white/60 text-xs">sugar</p>
                </div>
              </div>
              <div className="w-16 h-16 rounded-full bg-brand-white/10 backdrop-blur-sm flex items-center justify-center border border-brand-white/20">
                <div className="text-center">
                  <p className="text-brand-white font-bold text-sm">{product.macros.carbs}g</p>
                  <p className="text-brand-white/60 text-xs">carbs</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-brand-white/80 text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Status badge */}
            <div className="inline-flex items-center gap-2 text-sm text-brand-white/70">
              <div className={`w-2 h-2 rounded-full ${product.status === 'available' ? 'bg-green-400' : 'bg-brand-white/40'}`} />
              {product.status === 'available' ? 'Available' : 'Coming Soon'}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Price & CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-brand-blue/95 backdrop-blur-lg border-t border-brand-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-6 flex-wrap">
            {/* Left: Small partnership text */}
            <div className="flex-1 min-w-[200px]">
              <p className="text-brand-white/60 text-xs leading-relaxed max-w-md">
                Pioneering nutrition engineered with innovation, design, and play
              </p>
            </div>

            {/* Center: Price */}
            <div className="text-center">
              <p className="text-5xl font-bold text-brand-white">
                ${product.price.toFixed(2)}
              </p>
            </div>

            {/* Right: Quantity + Buy Button */}
            <div className="flex items-center gap-4">
              {/* Quantity controls */}
              <div className="flex items-center gap-3 bg-brand-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                <button className="w-8 h-8 rounded-full bg-brand-white/20 hover:bg-brand-white/30 transition-colors flex items-center justify-center text-brand-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-brand-white font-semibold min-w-[2ch] text-center">1</span>
                <button className="w-8 h-8 rounded-full bg-brand-white/20 hover:bg-brand-white/30 transition-colors flex items-center justify-center text-brand-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              {/* Buy button */}
              <button className="bg-brand-white text-brand-blue px-8 py-3 rounded-full font-semibold hover:bg-brand-white/90 transition-all flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="14" y="3" width="7" height="7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="14" y="14" width="7" height="7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="3" y="14" width="7" height="7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {product.status === 'available' ? 'Buy Now' : 'Join Waitlist'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default ProductDetail;
