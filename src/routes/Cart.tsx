import { Link, useNavigate } from "react-router-dom";
import { Page } from "@/components/layout/Page";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/config/currency";
import { ctaPrimaryButtonClassName } from "@/config/ctaStyles";
import { iconButtonHoverClass } from "@/config/interactionStyles";
import { CART_PLACEHOLDER } from "@/config/imageDisplay";
import { getPaymentLinkForProduct } from "@/config/checkout";
import { Trash2, ShoppingBag } from "lucide-react";
import { calculateItemTotal } from "@/lib/pricingService";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

/**
 * CENTRALIZED CART IMAGE NAMING CONVENTION
 * Format: cartview_(product)_(flavor).png
 *
 * Examples:
 * - cartview_cookie_chocochip.png → Chewy Protein Cookie - Chocolate Chip
 * - cartview_cookie_peanutbutter.png → Chewy Protein Cookie - Peanut Butter
 * - cartview_cookie_pistachio.png → Chewy Protein Cookie - Pistachio Biskit
 *
 * IMAGE STRATEGY:
 * - Flavors WITH uploaded images → Show flavor-specific image
 * - Flavors WITHOUT uploaded images → Show NOTHING (blank/no image)
 * - NO FALLBACK - each flavor only shows its own image or nothing
 */

// Import flavor-specific cart images following naming convention
import cartview_cookie_chocochip from "@/assets/cartview_cookie_chocochip.png";
// Future imports (add as images become available):
// import cartview_cookie_peanutbutter from "@/assets/cartview_cookie_peanutbutter.png";
// import cartview_cookie_pistachio from "@/assets/cartview_cookie_pistachio.png";

/**
 * Centralized mapping: productId (product-slug-flavor-slug) → cart image
 * Key format matches the unique productId format used in cart system
 * ONLY mapped flavors will show images - others show nothing
 */
const cartFlavorImages: Record<string, string> = {
  "chewy-protein-cookie-chocolate-chip": cartview_cookie_chocochip,
  // Future mappings (uncomment when images are added):
  // "chewy-protein-cookie-peanut-butter": cartview_cookie_peanutbutter,
  // "chewy-protein-cookie-pistachio-biskit": cartview_cookie_pistachio,
};

/**
 * Get cart image for a specific product/flavor combination
 * Uses productId which already contains product-slug-flavor-slug format
 * Returns flavor-specific image if exists, otherwise returns placeholder
 * Centralized: Uses CART_PLACEHOLDER from imageDisplay config
 */
const getCartImage = (productId: string): string => {
  return cartFlavorImages[productId] || CART_PLACEHOLDER;
};

const Cart = () => {
  const navigate = useNavigate();
  const { state, updateQuantity, removeItem, subtotal, itemCount } = useCart();
  const { toast } = useToast();

  // Handle delete with confirmation
  const handleDeleteItem = (productId: string, productName: string) => {
    toast({
      title: "Remove from cart?",
      description: `Are you sure you want to remove "${productName}" from your cart?`,
      action: (
        <ToastAction
          altText="Confirm delete"
          onClick={() => removeItem(productId)}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Remove
        </ToastAction>
      ),
    });
  };

  // Handle checkout - redirect to Stripe Payment Link
  const handleCheckout = () => {
    // For MVP: assume single product type, get first item
    const primaryItem = state.items[0];

    if (!primaryItem) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }

    // Get payment link for this product
    const paymentLink = getPaymentLinkForProduct(primaryItem.productId);

    if (!paymentLink) {
      toast({
        title: "Checkout not available",
        description: "Checkout is not configured yet. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    // Redirect to Stripe Payment Link
    window.location.href = paymentLink;
  };

  if (itemCount === 0) {
    return (
      <Page>
        <div className="min-h-screen flex items-center justify-center bg-brand-blue">
          <div className="text-center max-w-md mx-auto px-4">
            <ShoppingBag className="w-16 h-16 text-brand-white/40 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-brand-white mb-4">Your cart is empty</h1>
            <p className="text-brand-white/70 mb-8">
              Add some products to your cart to get started.
            </p>
            <button
              onClick={() => navigate("/products/chewy-protein-cookie")}
              className={ctaPrimaryButtonClassName}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <div className="bg-brand-blue min-h-screen">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className={`inline-flex items-center text-brand-white/70 hover:text-brand-white mb-6 ${iconButtonHoverClass}`}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Continue Shopping
        </button>

        <h1 className="text-4xl lg:text-5xl font-bold text-brand-white mb-2">Your Cart</h1>
        <p className="text-brand-white/60 mb-8">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </p>
      </div>

      {/* Cart Items */}
      <div className="container mx-auto px-4 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <div
                key={item.productId}
                className="bg-brand-white/10 backdrop-blur-sm border border-brand-white/20 rounded-2xl p-6 flex items-center gap-6"
              >
                {/* Product Image - Always show (real image or placeholder) */}
                <img
                  src={getCartImage(item.productId)}
                  alt={item.flavorName ? `${item.name} - ${item.flavorName}` : item.name}
                  className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
                />

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-brand-white mb-1">
                    {item.name}
                    {item.flavorName && ` - ${item.flavorName}`}
                  </h3>
                  <p className="text-brand-white/60 text-sm mb-3">{formatPrice(item.price)}</p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-brand-white/20 hover:bg-brand-white/30 transition-colors flex items-center justify-center text-brand-white"
                      aria-label="Decrease quantity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="text-brand-white font-semibold min-w-[2ch] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-brand-white/20 hover:bg-brand-white/30 transition-colors flex items-center justify-center text-brand-white"
                      aria-label="Increase quantity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Price & Remove */}
                <div className="flex flex-col items-end gap-4">
                  <p className="text-2xl font-bold text-brand-white">
                    {formatPrice(calculateItemTotal(item.price, item.quantity))}
                  </p>
                  <button
                    onClick={() =>
                      handleDeleteItem(
                        item.productId,
                        item.flavorName ? `${item.name} - ${item.flavorName}` : item.name
                      )
                    }
                    className="text-brand-white/60 hover:text-red-400 transition-colors"
                    aria-label="Remove item"
                    title="Click to remove item from cart"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-brand-white/10 backdrop-blur-sm border border-brand-white/20 rounded-2xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-brand-white mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-brand-white/80">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-brand-white/80">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-brand-white/20 pt-3 mt-3">
                  <div className="flex justify-between text-brand-white text-xl font-bold">
                    <span>Total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className={`w-full ${ctaPrimaryButtonClassName} justify-center`}
              >
                Proceed to Checkout
              </button>

              <p className="text-brand-white/60 text-xs text-center mt-4">
                Secure checkout powered by Supabase
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
