import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Page } from "@/components/layout/Page";
import { productsConfig, getProductBySlug } from "@/config/products";
import { BrandButton } from "@/components/ui/BrandButton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { arrowButtonClassName, isProductValid } from "@/config/navigationRules";
import { formatPrice } from "@/config/currency";
import { ctaPrimaryButtonClassName } from "@/config/ctaStyles";
import { iconButtonHoverClass } from "@/config/interactionStyles";
import { hasProductImage, getMissingImageFallback } from "@/config/imageDisplay";
import { isDecreaseDisabled, isIncreaseDisabled, decreaseQuantity, increaseQuantity } from "@/config/quantityRules";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { calculateItemTotal, logAnalyticsEvent, createAnalyticsEvent } from "@/lib/pricingService";
import { ReviewsDisplay } from "@/components/ReviewsDisplay";
import { ReviewsModal } from "@/components/ReviewsModal";
import { ComparisonTable } from "@/components/ComparisonTable";

/**
 * CENTRALIZED PRODUCT IMAGE NAMING CONVENTION
 * Format: productview_(product)_(flavor).png
 *
 * Examples:
 * - productview_cookie_chocochip.png → Chewy Protein Cookie - Chocolate Chip
 * - productview_cookie_peanutbutter.png → Chewy Protein Cookie - Peanut Butter
 * - productview_cookie_pistachio.png → Chewy Protein Cookie - Pistachio Biskit
 *
 * IMAGE STRATEGY:
 * - Flavors WITH uploaded images → Show flavor-specific image
 * - Flavors WITHOUT uploaded images → Show NOTHING (blank/no image)
 * - NO FALLBACK - each flavor only shows its own image or nothing
 */

// Import flavor-specific product images following naming convention
import productview_cookie_chocochip from "@/assets/productview_cookie_chocochip.png";
// Future imports (add as images become available):
// import productview_cookie_peanutbutter from "@/assets/productview_cookie_peanutbutter.png";
// import productview_cookie_pistachio from "@/assets/productview_cookie_pistachio.png";

/**
 * Centralized mapping: product-slug + flavor-slug → image
 * Key format matches the unique productId format used in cart system
 * ONLY mapped flavors will show images - others show nothing
 */
const productFlavorImages: Record<string, string> = {
  "chewy-protein-cookie-chocolate-chip": productview_cookie_chocochip,
  // Future mappings (uncomment when images are added):
  // "chewy-protein-cookie-peanut-butter": productview_cookie_peanutbutter,
  // "chewy-protein-cookie-pistachio-biskit": productview_cookie_pistachio,
};

/**
 * Get product image based on product and flavor
 * Returns flavor-specific image if exists, otherwise returns undefined
 * Centralized: Uses imageDisplay config for fallback logic
 */
const getProductImage = (
  productSlug: string,
  flavorSlug?: string
): string | undefined => {
  if (!flavorSlug) return undefined;

  const key = `${productSlug}-${flavorSlug}`;
  return productFlavorImages[key]; // Returns undefined if not in mapping
};

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [currentFlavorIndex, setCurrentFlavorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);

  // Find initial product index
  useEffect(() => {
    if (slug) {
      const index = productsConfig.findIndex((p) => p.slug === slug);
      if (index >= 0) {
        setCurrentProductIndex(index);
        setCurrentFlavorIndex(0);
      }
    }
  }, [slug]);

  const product = productsConfig[currentProductIndex];
  const currentFlavor = product?.flavors?.[currentFlavorIndex];

  // Get flavor-specific image using centralized naming convention
  const productImageSrc = getProductImage(product?.slug, currentFlavor?.slug);

  // PRODUCTION-READY: Reset counter to 1 whenever product changes
  // Counter is INDEPENDENT from cart - they are NOT connected
  // This ensures clean UX and proper separation of concerns for backend integration
  useEffect(() => {
    setQuantity(1);
  }, [product]);

  const handlePrevious = () => {
    // Check if there are previous flavors
    if (currentFlavorIndex > 0) {
      setCurrentFlavorIndex(currentFlavorIndex - 1);
    } else if (currentProductIndex > 0) {
      // Find previous valid product
      let prevValidIndex = currentProductIndex - 1;
      while (prevValidIndex >= 0 && !isProductValid(productsConfig[prevValidIndex])) {
        prevValidIndex--;
      }
      if (prevValidIndex >= 0) {
        setCurrentProductIndex(prevValidIndex);
        const prevProduct = productsConfig[prevValidIndex];
        setCurrentFlavorIndex(prevProduct.flavors.length > 0 ? prevProduct.flavors.length - 1 : 0);
      }
    }
  };

  const handleNext = () => {
    // Check if there are more flavors
    if (product.flavors && currentFlavorIndex < product.flavors.length - 1) {
      setCurrentFlavorIndex(currentFlavorIndex + 1);
    } else if (currentProductIndex < productsConfig.length - 1) {
      // Find next valid product
      let nextValidIndex = currentProductIndex + 1;
      while (nextValidIndex < productsConfig.length && !isProductValid(productsConfig[nextValidIndex])) {
        nextValidIndex++;
      }
      if (nextValidIndex < productsConfig.length) {
        setCurrentProductIndex(nextValidIndex);
        setCurrentFlavorIndex(0);
      }
    }
  };

  const buyNowHandler = () => {
    if (!product) return;

    // Security: Validate inputs before processing
    if (!product.id && !product.slug) {
      console.error("Invalid product: missing identifier");
      return;
    }

    if (quantity < 1 || quantity > 99) {
      toast({
        title: "Invalid quantity",
        description: "Please select a quantity between 1 and 99",
        variant: "destructive",
      });
      return;
    }

    // Store quantity for toast message before reset
    const addedQuantity = quantity;
    const totalPrice = calculateItemTotal(product.price, quantity);

    // CRITICAL: Generate unique productId that includes flavor
    // Format: "product-slug-flavor-slug" or just "product-slug" if no flavor
    const uniqueProductId = currentFlavor
      ? `${product.slug}-${currentFlavor.slug}`
      : product.slug;

    // Build full display name with flavor
    const fullProductName = currentFlavor
      ? `${product.name} - ${currentFlavor.name}`
      : product.name;

    // Add item to cart with flavor information
    addItem(
      {
        productId: uniqueProductId,
        slug: product.slug,
        name: product.name,
        price: product.price,
        flavorId: currentFlavor?.id,
        flavorName: currentFlavor?.name,
      },
      quantity
    );

    // Log analytics event
    const analyticsEvent = createAnalyticsEvent("add_to_cart", product, quantity);
    logAnalyticsEvent(analyticsEvent);

    // Reset quantity to 1 IMMEDIATELY after adding
    setQuantity(1);

    // Show success notification with action
    toast({
      title: "Added to cart",
      description: `${addedQuantity}x ${fullProductName} - ${formatPrice(totalPrice)}`,
      action: (
        <ToastAction altText="Go to cart" onClick={() => navigate("/cart")}>
          Go to Cart
        </ToastAction>
      ),
    });
  };

  const canGoPrevious = currentFlavorIndex > 0 || (currentProductIndex > 0 && productsConfig.slice(0, currentProductIndex).some(isProductValid));
  const canGoNext =
    (product.flavors && currentFlavorIndex < product.flavors.length - 1) ||
    (currentProductIndex < productsConfig.length - 1 && productsConfig.slice(currentProductIndex + 1).some(isProductValid));

  if (!product) {
    return (
      <Page>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-h1 mb-4">Product not found</h1>
            <Link to="/" className="text-brand-blue hover:underline">
              Back to home
            </Link>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <div className="bg-brand-blue h-screen flex flex-col overflow-hidden">
      {/* Back button - Icon only */}
      <div className="container mx-auto px-4 py-0">
        <Link
          to="/"
          className={`inline-flex items-center justify-center w-8 h-8 text-brand-white/70 hover:text-brand-white ${iconButtonHoverClass}`}
          title="Back to home"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      </div>

      {/* Product Detail Section */}
      <div className="container mx-auto px-4 flex-1 flex items-center pt-2 pb-0">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center -mt-48">
          
          {/* Left: Product Name & Details */}
          <div className="lg:col-span-3 space-y-4">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-brand-white leading-tight">
                {product.name}
              </h1>
              {currentFlavor && (
                <p className="text-brand-white/60 text-base lg:text-lg font-light mt-2 tracking-wide">
                  {currentFlavor.name}
                </p>
              )}
            </div>
          </div>

          {/* Center: Large Product Image with Navigation Arrows */}
          <div className="lg:col-span-6 flex justify-center items-center relative">
            {/* Left Arrow - Visible only if can go previous */}
            {canGoPrevious && (
              <button
                onClick={handlePrevious}
                className={`${arrowButtonClassName} left-0`}
                aria-label="Previous flavor or product"
              >
                <ChevronLeft className="w-6 h-6 text-brand-white" />
              </button>
            )}

            {/* Product Image Container */}
            <div className="relative w-full max-w-md aspect-square">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-brand-white/5 rounded-full blur-3xl scale-110" />

              {/* Product Image - Show image or product title if no image available */}
              <div className="relative w-full h-full flex items-center justify-center">
                {productImageSrc ? (
                  <img
                    src={productImageSrc}
                    alt={currentFlavor ? `${product.name} - ${currentFlavor.name}` : product.name}
                    className="w-[85%] h-[85%] object-contain drop-shadow-2xl animate-float"
                  />
                ) : (
                  <div className="text-center">
                    <h2 className="text-3xl font-black text-brand-white/60">
                      {getMissingImageFallback(product.name, currentFlavor?.name)}
                    </h2>
                  </div>
                )}
              </div>
            </div>

            {/* Right Arrow - Visible only if can go next */}
            {canGoNext && (
              <button
                onClick={handleNext}
                className={`${arrowButtonClassName} right-0`}
                aria-label="Next flavor or product"
              >
                <ChevronRight className="w-6 h-6 text-brand-white" />
              </button>
            )}
          </div>

          {/* Right: Macros & Info */}
          <div className="lg:col-span-3 space-y-6">
            {/* Macro circles */}
            {currentFlavor && (
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded-full bg-brand-white/20 backdrop-blur-sm flex items-center justify-center border border-brand-white/30">
                  <div className="text-center">
                    <p className="text-brand-white font-bold text-sm">{currentFlavor.macros.calories}</p>
                    <p className="text-brand-white/60 text-xs">cals</p>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full bg-brand-white/10 backdrop-blur-sm flex items-center justify-center border border-brand-white/20">
                  <div className="text-center">
                    <p className="text-brand-white font-bold text-sm">{currentFlavor.macros.protein}g</p>
                    <p className="text-brand-white/60 text-xs">protein</p>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full bg-brand-white/10 backdrop-blur-sm flex items-center justify-center border border-brand-white/20">
                  <div className="text-center">
                    <p className="text-brand-white font-bold text-sm">&lt;1g</p>
                    <p className="text-brand-white/60 text-xs">sugars</p>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-3">
              <p className="text-brand-white/80 text-sm leading-relaxed">
                {currentFlavor?.description || product.description}
              </p>
              {currentFlavor?.compareTitle && (
                <div className="flex items-center gap-3">
                  <p className="text-brand-white/60 text-xs">See how Childlike 🐐 compares to other brands:</p>
                  <button
                    onClick={() => setShowComparisonModal(true)}
                    className="px-4 py-2 bg-brand-white/10 hover:bg-brand-white/20 backdrop-blur-md rounded-full border border-brand-white/20 hover:border-brand-white/40 text-brand-white text-xs font-semibold transition-all duration-300"
                  >
                    Compare
                  </button>
                </div>
              )}
            </div>

            {/* Reviews Display */}
            {currentFlavor && (
              <ReviewsDisplay
                reviews={currentFlavor.reviews}
                onOpenReviews={() => setShowReviewsModal(true)}
              />
            )}
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
              {quantity > 0 ? (
                <>
                  <p className="text-sm text-brand-white/60 mb-1">
                    {quantity}x {formatPrice(product.price)}
                  </p>
                  <p className="text-3xl font-bold text-brand-white">
                    {formatPrice(calculateItemTotal(product.price, quantity))}
                  </p>
                </>
              ) : (
                <p className="text-3xl font-bold text-brand-white">
                  {formatPrice(product.price)}
                </p>
              )}
            </div>

            {/* Right: Quantity + Buy Button */}
            <div className="flex items-center gap-4">
              {/* Quantity controls */}
              <div className="flex items-center gap-3 bg-brand-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                <button
                  onClick={() => setQuantity(decreaseQuantity(quantity))}
                  disabled={isDecreaseDisabled(quantity)}
                  className="w-8 h-8 rounded-full bg-brand-white/20 hover:bg-brand-white/30 flex items-center justify-center text-brand-white disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-brand-white font-semibold min-w-[2ch] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(increaseQuantity(quantity))}
                  disabled={isIncreaseDisabled(quantity)}
                  className="w-8 h-8 rounded-full bg-brand-white/20 hover:bg-brand-white/30 flex items-center justify-center text-brand-white disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                  title={isIncreaseDisabled(quantity) ? "Maximum quantity reached" : "Increase quantity"}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              {/* Add to Cart button - Primary CTA */}
              <button
                onClick={buyNowHandler}
                className={ctaPrimaryButtonClassName}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="14" y="3" width="7" height="7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="14" y="14" width="7" height="7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="3" y="14" width="7" height="7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Flavor Navigation Indicators */}
      {product.flavors && product.flavors.length > 0 && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 flex gap-2">
          {product.flavors.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentFlavorIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentFlavorIndex
                  ? "bg-brand-white"
                  : "bg-brand-white/30 hover:bg-brand-white/60"
              }`}
              aria-label={`Go to flavor ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Comparison Modal */}
      {showComparisonModal && currentFlavor?.compareTitle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-brand-blue border border-brand-white/20 rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-brand-blue border-b border-brand-white/20 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-brand-white">{currentFlavor.compareTitle}</h2>
              <button
                onClick={() => setShowComparisonModal(false)}
                className="w-8 h-8 rounded-full bg-brand-white/10 hover:bg-brand-white/20 flex items-center justify-center text-brand-white transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {currentFlavor?.comparison ? (
                <ComparisonTable data={currentFlavor.comparison} />
              ) : (
                <p className="text-brand-white/70 text-sm">
                  Comparison data not available for this flavor.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reviews Modal */}
      {showReviewsModal && currentFlavor && (
        <ReviewsModal
          flavorName={`${product.name} - ${currentFlavor.name}`}
          reviews={currentFlavor.reviews}
          onClose={() => setShowReviewsModal(false)}
        />
      )}
    </div>
  );
};

export default ProductDetail;
