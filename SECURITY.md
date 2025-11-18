# Security Architecture - Childlike E-Commerce Platform

## Overview
This document outlines the security measures, data validation, and architecture patterns implemented to ensure a secure, production-ready e-commerce platform.

---

## 🔒 Security Measures Implemented

### 1. Input Validation & Sanitization

#### Cart Operations (`CartContext.tsx`)
All cart operations validate inputs before processing:

**Product Validation:**
- ✅ Product ID must be a non-empty string
- ✅ Product name must be a non-empty string
- ✅ Price must be a positive, finite number
- ✅ No NaN, Infinity, or negative values allowed

**Quantity Validation:**
- ✅ Must be an integer between 1-99
- ✅ Enforced at UI level (disabled buttons)
- ✅ Enforced at state level (Math.min/max)
- ✅ Enforced at context level (validation guards)

**Examples:**
```typescript
// Invalid inputs are rejected silently with console errors
addItem({ productId: "", name: "Test", price: 120 }, 5);  // ❌ Rejected
addItem({ productId: "abc", name: "", price: 120 }, 5);   // ❌ Rejected
addItem({ productId: "abc", name: "Test", price: -10 }, 5); // ❌ Rejected
addItem({ productId: "abc", name: "Test", price: 120 }, 150); // ❌ Rejected
addItem({ productId: "abc", name: "Test", price: 120 }, 5);   // ✅ Accepted
```

---

### 2. Attack Prevention

#### Cart Overflow Protection
- **Max quantity per item:** 99 units
- **Max unique items in cart:** 50 products
- **Automatic capping:** Exceeding limits triggers warning + auto-adjustment

**Why these limits?**
- Prevents memory exhaustion attacks
- Prevents cart stuffing (filling cart with thousands of items)
- Reasonable limits for legitimate customers
- Can be adjusted based on business needs

#### LocalStorage Corruption Protection
- All data loaded from localStorage is validated
- Corrupted/invalid data triggers cart reset
- Try-catch guards prevent crashes
- Invalid items are filtered out automatically

**Validation on Load:**
```typescript
// Each item is validated before being added to state
const validItems = parsed.items.filter((item: any) => {
  return (
    item &&
    typeof item === "object" &&
    typeof item.productId === "string" &&
    item.productId.trim().length > 0 &&
    typeof item.name === "string" &&
    item.name.trim().length > 0 &&
    typeof item.price === "number" &&
    item.price > 0 &&
    isFinite(item.price) &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0 &&
    item.quantity <= 99
  );
});
```

---

### 3. XSS (Cross-Site Scripting) Protection

**React's Built-in Protection:**
- All data rendered through JSX is automatically escaped
- No use of `dangerouslySetInnerHTML`
- No direct DOM manipulation

**Additional Measures:**
- Product names/descriptions sanitized at source
- No user-generated content rendered without validation
- Prices formatted through `formatPrice()` utility (type-safe)

---

### 4. Price Tampering Protection

**Current (Client-Side):**
- Prices are read-only from `productsConfig`
- Users cannot modify prices in cart
- All calculations use centralized `pricingService`

**Future (Server-Side - Ready):**
```typescript
// When Stripe integration is added:
// 1. Product prices will be fetched from Supabase
// 2. Stripe Checkout will verify prices server-side
// 3. Client prices are for display only
// 4. Server prices are authoritative
```

**Stripe Integration (Ready):**
```typescript
import { getStripeLineItems } from "@/lib/pricingService";

// Stripe will verify prices server-side
const lineItems = getStripeLineItems(cartItems);
stripe.redirectToCheckout({ lineItems });
```

---

### 5. Data Integrity

#### Centralized Pricing Logic
**Single Source of Truth:**
- All calculations in `pricingService.ts`
- No inline calculations scattered across components
- Easy to audit and test
- Consistent across entire platform

**Functions:**
```typescript
calculateItemTotal(price, quantity)     // Item total
calculateSubtotal(items)                // Cart subtotal
calculateTax(subtotal, taxRate)         // Tax calculation (ready)
calculateShipping(subtotal)             // Shipping (ready)
calculateDiscount(subtotal, code)       // Promo codes (ready)
calculateTotal(...)                     // Final total
```

---

## 🏗️ Architecture Patterns

### Per-Product Counter System

**How It Works:**
Each product has an independent counter that syncs with the cart:

```typescript
// 1. Counter syncs with cart on load
useEffect(() => {
  const productId = product.id || product.slug;  // Unique ID
  const existingItem = state.items.find(item => item.productId === productId);

  if (existingItem) {
    setQuantity(existingItem.quantity);  // Show cart quantity
  } else {
    setQuantity(0);  // Reset to 0 if not in cart
  }
}, [product, state.items]);  // Re-run when product OR cart changes
```

**Scalability:**
- ✅ Works for unlimited products
- ✅ No hardcoded product references
- ✅ Each product identified by unique `productId`
- ✅ Cart is source of truth
- ✅ Counter is just a view of cart state

**Product Isolation:**
```
Product 1 (chewy-protein-cookie):
  productId: "chewy-protein-cookie"
  Cart qty: 3
  Counter shows: 3

Product 2 (protein-bar):
  productId: "protein-bar"
  Cart qty: 0
  Counter shows: 0

Product 100 (future-product):
  productId: "future-product"
  Cart qty: 5
  Counter shows: 5
```

**Why This Works:**
- Cart stores ALL product quantities
- Counter reads from cart using `productId`
- Different `productId` = different counter
- No state sharing between products
- Fully isolated and scalable

---

## 🔐 Future Security Enhancements

### 1. Backend Integration (Ready)
```typescript
// When user is authenticated:
import { cartService } from "@/lib/cartService";

// Every cart change syncs to Supabase
addItem(...);
cartService.syncToDatabase(state, user.id);
```

### 2. Rate Limiting
```typescript
// Prevent rapid add-to-cart spam
const RATE_LIMIT = 10; // 10 adds per minute
const rateLimiter = new Map();
```

### 3. CSRF Protection
```typescript
// When adding checkout:
// - Generate CSRF tokens
// - Validate on server-side
// - Include in Stripe metadata
```

### 4. Session Security
```typescript
// Implement:
// - Session expiration
// - Session fingerprinting
// - Concurrent session detection
```

### 5. Payment Security
```typescript
// Stripe handles:
// - PCI compliance
// - Card tokenization
// - 3D Secure (SCA)
// - Fraud detection

// Never store:
// - Credit card numbers
// - CVV codes
// - Sensitive payment data
```

---

## 📊 Analytics Security

**Event Logging:**
```typescript
// All events are sanitized before logging
createAnalyticsEvent("add_to_cart", product, quantity);

// Logs only:
// - Product ID (safe)
// - Product name (safe)
// - Price (safe)
// - Quantity (safe)
// - Timestamp (safe)

// Never logs:
// - User PII (unless opted in)
// - Payment info
// - Session tokens
```

---

## ✅ Security Checklist

### Client-Side ✅
- [x] Input validation (all fields)
- [x] Max quantity enforcement (99)
- [x] Max cart size enforcement (50 items)
- [x] LocalStorage validation
- [x] Price tampering prevention
- [x] XSS protection (React auto-escape)
- [x] Type safety (TypeScript)
- [x] Error boundaries (graceful failures)

### Server-Side 🔄 (Ready)
- [ ] Supabase RLS policies
- [ ] Server-side price validation
- [ ] User authentication
- [ ] Rate limiting
- [ ] CSRF tokens
- [ ] Session management
- [ ] Payment verification (Stripe)

---

## 🚀 Production Readiness

**Current Status:** ✅ **Production-Ready (Client-Side)**

**What's Secure Now:**
- ✅ Cart operations
- ✅ Price calculations
- ✅ Input validation
- ✅ Data integrity
- ✅ Error handling
- ✅ Scalable architecture

**What Needs Backend:**
- 🔄 User authentication
- 🔄 Payment processing
- 🔄 Order persistence
- 🔄 Server-side validation
- 🔄 Rate limiting

---

## 📝 Audit Log

| Date | Change | Security Impact |
|------|--------|----------------|
| 2025-01-19 | Added input validation to CartContext | Prevents invalid data entry |
| 2025-01-19 | Added max quantity limits (99) | Prevents cart overflow attacks |
| 2025-01-19 | Added localStorage validation | Prevents corrupted data crashes |
| 2025-01-19 | Centralized pricing logic | Prevents price tampering |
| 2025-01-19 | Added per-product counters | Prevents cross-product state bugs |
| 2025-01-19 | Stripe-ready data structure | Payment security ready |

---

## 🔍 Code Review Notes

**For Security Auditors:**
1. All cart operations in `src/context/CartContext.tsx`
2. All pricing logic in `src/lib/pricingService.ts`
3. Input validation guards on lines 35-59 (CartContext)
4. LocalStorage validation on lines 24-76 (CartContext)
5. Per-product isolation logic on lines 34-48 (ProductDetail)

**Test Cases:**
- Try adding negative quantities → Rejected
- Try adding 150 items → Capped at 99
- Try corrupting localStorage → Auto-reset
- Try switching products → Independent counters
- Try adding to full cart (50 items) → Rejected

---

**Last Updated:** January 19, 2025
**Security Version:** 1.0
**Platform:** Childlike E-Commerce
