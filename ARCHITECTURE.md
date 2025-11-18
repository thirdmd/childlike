# Architecture Documentation - Childlike E-Commerce Platform

## Overview
This document outlines the production-ready architecture designed for seamless backend integration, scalability, and maintainability.

---

## 🏗️ Core Architecture Principles

### 1. Separation of Concerns
**Every component has a single, well-defined responsibility:**

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│  ProductDetail.tsx │ Cart.tsx │ Header.tsx              │
│  (UI Only - No business logic)                          │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                     STATE MANAGEMENT                     │
│  CartContext.tsx (Single source of truth)               │
│  (All cart operations centralized here)                 │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                     BUSINESS LOGIC                       │
│  pricingService.ts │ cartService.ts                     │
│  (Calculations, validations, data transformations)      │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    BACKEND INTEGRATION                   │
│  Supabase │ Stripe │ Analytics                          │
│  (External services - Ready to plug in)                 │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Architecture

### **Product Detail Counter** (Independent from Cart)

```typescript
// ARCHITECTURE: Counter is a TEMPORARY UI state
// NOT connected to cart until "Add to Cart" is clicked

ProductDetail Component:
  ├── Local State: quantity (starts at 0)
  ├── Resets to 0 when:
  │   ├── Product changes (useEffect)
  │   ├── After Add to Cart (manual reset)
  │   └── Component unmounts
  └── Purpose: User interaction only

Cart State (CartContext):
  ├── Persistent State: items[]
  ├── Stored in: localStorage
  ├── Future: Synced to Supabase
  └── Purpose: Source of truth for checkout
```

**Why This Architecture?**
1. **Clean separation** - Counter ≠ Cart
2. **Predictable UX** - Always starts at 0
3. **Backend ready** - Cart is authoritative
4. **No state conflicts** - Independent lifecycles

---

## 📊 State Management Strategy

### **CartContext - Single Source of Truth**

**File:** `src/context/CartContext.tsx`

**Responsibilities:**
- ✅ Manage cart items (CRUD operations)
- ✅ Validate all inputs (security)
- ✅ Persist to localStorage (client-side)
- ✅ Provide reactive values (itemCount, subtotal)
- 🔄 **Ready:** Sync to Supabase (backend)

**Data Structure:**
```typescript
interface CartState {
  items: CartItem[];  // Array of products
}

interface CartItem {
  productId: string;   // Unique identifier
  slug: string;        // URL-friendly name
  name: string;        // Display name
  price: number;       // Unit price (in pesos)
  quantity: number;    // 1-99
}
```

**Operations:**
```typescript
// All operations are:
// - Type-safe (TypeScript)
// - Validated (input guards)
// - Centralized (single place)
// - Backend-ready (structured for API calls)

addItem(item, quantity)      // Add or increment
removeItem(productId)        // Remove from cart
updateQuantity(productId, qty) // Change quantity
clearCart()                  // Empty cart
getItemCount()               // Total quantity
getSubtotal()                // Total price
```

---

## 💰 Pricing Architecture

### **Centralized Pricing Service**

**File:** `src/lib/pricingService.ts`

**Why Centralized?**
- ✅ Single source of truth for all calculations
- ✅ Easy to audit and test
- ✅ Stripe integration ready
- ✅ Tax/discount logic ready
- ✅ Prevents price tampering
- ✅ Backend can override (authoritative)

**Functions:**
```typescript
// Item-level calculations
calculateItemTotal(price, quantity) → total

// Cart-level calculations
calculateSubtotal(items[]) → subtotal
calculateTax(subtotal, rate) → tax
calculateShipping(subtotal) → shipping
calculateDiscount(subtotal, code) → discount
calculateTotal(...) → final amount

// External integrations
getStripeLineItems(items[]) → Stripe format
createAnalyticsEvent(...) → Analytics format
```

**Backend Integration Point:**
```typescript
// Current: Prices from productsConfig (static)
// Future: Prices from Supabase (dynamic)

// When backend is ready:
const product = await supabase
  .from('products')
  .select('*')
  .eq('id', productId)
  .single();

// Price is fetched from database (authoritative)
// Client prices are for display only
// Server validates on checkout
```

---

## 🔐 Security Architecture

### **Defense in Depth Strategy**

**Layer 1: Client-Side Validation**
```typescript
// ProductDetail.tsx
if (quantity < 1 || quantity > 99) {
  return; // Reject
}

// CartContext.tsx
if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
  console.error("Invalid quantity");
  return; // Reject
}
```

**Layer 2: State Guards**
```typescript
// Prevent cart overflow
if (newQuantity > 99) {
  quantity = 99; // Cap
}

// Prevent cart stuffing
if (cart.items.length >= 50) {
  return; // Reject
}
```

**Layer 3: Data Validation**
```typescript
// LocalStorage protection
try {
  const parsed = JSON.parse(localStorage.getItem("cart"));
  const validItems = parsed.items.filter(isValid);
  return { items: validItems };
} catch {
  return { items: [] }; // Reset on corruption
}
```

**Layer 4: Backend Validation (Ready)**
```typescript
// When implementing checkout:
// 1. Frontend sends: { productId, quantity }
// 2. Backend fetches: product from database
// 3. Backend validates: quantity, price, availability
// 4. Backend creates: Stripe checkout session
// 5. Stripe validates: payment, amount
// 6. Backend confirms: order creation

// Client data is NEVER trusted
// Server is ALWAYS authoritative
```

---

## 🎯 Component Architecture

### **ProductDetail.tsx - Presentation Layer**

**Responsibilities:**
- Display product information
- Handle quantity selection (local state)
- Trigger add to cart action
- Show success notification
- Navigate between products

**What it DOESN'T do:**
- ❌ Store cart data
- ❌ Calculate prices (uses pricingService)
- ❌ Validate cart items (CartContext does this)
- ❌ Persist data (CartContext does this)

**Key Design Decision:**
```typescript
// Counter state is LOCAL and TEMPORARY
const [quantity, setQuantity] = useState(0);

// Reset on product change
useEffect(() => {
  setQuantity(0);
}, [product]);

// Reset after add to cart
const buyNowHandler = () => {
  addItem(...);
  setQuantity(0); // ← Reset immediately
};

// WHY? Because counter is just UI interaction
// Cart is the source of truth
// Clean separation = easier backend integration
```

---

## 📱 Event-Driven Architecture

### **Analytics & Tracking**

**File:** `src/lib/pricingService.ts`

**Event Structure:**
```typescript
interface AnalyticsEvent {
  event: string;           // "add_to_cart", "purchase", etc.
  product_id: string;      // Unique identifier
  product_name: string;    // Human-readable
  price: number;           // Unit price
  quantity: number;        // Items added
  value: number;           // Total value (price × qty)
  currency: string;        // "PHP"
  timestamp: number;       // Unix timestamp
}
```

**Integration Points (Ready):**
```typescript
// Google Analytics 4
logAnalyticsEvent() → gtag('event', ...)

// Meta Pixel
logAnalyticsEvent() → fbq('track', ...)

// Supabase Analytics Table
logAnalyticsEvent() → supabase.from('events').insert(...)

// Custom Backend API
logAnalyticsEvent() → fetch('/api/analytics', ...)
```

**Current Implementation:**
- Console logging in development
- Ready to uncomment integration lines
- No PII logged (privacy-compliant)
- GDPR-ready structure

---

## 🚀 Backend Integration Roadmap

### **Phase 1: Product Management** (Next)

**Database Schema (Supabase):**
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  status TEXT NOT NULL CHECK (status IN ('available', 'coming_soon')),
  macros JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE product_flavors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
```

**Migration Path:**
1. Create tables in Supabase
2. Migrate `productsConfig` data to database
3. Update ProductDetail to fetch from Supabase
4. Keep `productsConfig` as fallback cache
5. Implement admin panel for product management

---

### **Phase 2: User Authentication**

**Supabase Auth Integration:**
```typescript
// Sign up
const { user, error } = await supabase.auth.signUp({
  email,
  password,
});

// Sign in
const { user, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

// Get session
const { data: { session } } = await supabase.auth.getSession();
```

**Cart Migration:**
```typescript
// Anonymous cart → User cart
const localCart = getLocalCart();
const userCart = await getUserCart(user.id);
const mergedCart = mergeCart(localCart, userCart);
await saveCart(user.id, mergedCart);
```

---

### **Phase 3: Cart Persistence**

**Database Schema:**
```sql
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT, -- For anonymous users
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0 AND quantity <= 99),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id),
  UNIQUE(session_id, product_id)
);

CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_session_id ON cart_items(session_id);
```

**Sync Strategy:**
```typescript
// CartContext changes to:
const addItem = async (item, quantity) => {
  // 1. Update local state (instant feedback)
  setState(prev => /* update local cart */);

  // 2. Sync to backend (background)
  if (user) {
    await supabase.from('cart_items').upsert({
      user_id: user.id,
      product_id: item.productId,
      quantity: quantity,
    });
  } else {
    await supabase.from('cart_items').upsert({
      session_id: getSessionId(),
      product_id: item.productId,
      quantity: quantity,
    });
  }
};
```

---

### **Phase 4: Checkout & Payments**

**Stripe Integration:**
```typescript
// Frontend: Create checkout session
const response = await fetch('/api/create-checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: getStripeLineItems(cartItems),
    user_id: user.id,
  }),
});

const { sessionId } = await response.json();

// Redirect to Stripe Checkout
const stripe = await loadStripe(process.env.VITE_STRIPE_PUBLIC_KEY);
await stripe.redirectToCheckout({ sessionId });
```

**Backend (Supabase Edge Function):**
```typescript
// Validate prices server-side
const items = await Promise.all(
  requestItems.map(async (item) => {
    const product = await supabase
      .from('products')
      .select('*')
      .eq('id', item.productId)
      .single();

    // Server price is authoritative
    return {
      price_data: {
        currency: 'php',
        product_data: { name: product.name },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: item.quantity,
    };
  })
);

// Create Stripe session
const session = await stripe.checkout.sessions.create({
  line_items: items,
  mode: 'payment',
  success_url: `${origin}/success`,
  cancel_url: `${origin}/cart`,
});
```

---

### **Phase 5: Order Management**

**Database Schema:**
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'fulfilled', 'cancelled')),
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  shipping DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL, -- Snapshot at order time
  price DECIMAL(10,2) NOT NULL, -- Price at order time
  quantity INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📈 Scalability Considerations

### **Current Capacity:**
- ✅ Handles unlimited products (no hardcoding)
- ✅ Cart size limited to 50 items (prevents abuse)
- ✅ Quantity limited to 99 per item (prevents overflow)
- ✅ LocalStorage (5-10MB limit, ~1000+ orders)

### **Backend Scaling Strategy:**
```
Stage 1 (0-1k users):
  ├── Supabase Free Tier
  ├── LocalStorage + Database sync
  └── Estimated cost: $0/month

Stage 2 (1k-10k users):
  ├── Supabase Pro ($25/month)
  ├── Database-first (localStorage as cache)
  └── Estimated cost: $25-100/month

Stage 3 (10k-100k users):
  ├── Supabase Pro + CDN
  ├── Redis cache layer
  ├── Database read replicas
  └── Estimated cost: $100-500/month

Stage 4 (100k+ users):
  ├── Multi-region deployment
  ├── Dedicated database
  ├── Edge functions
  └── Custom pricing
```

---

## 🧪 Testing Strategy

### **Unit Tests (Ready to implement):**
```typescript
// pricingService.test.ts
describe('calculateItemTotal', () => {
  it('should calculate correct total', () => {
    expect(calculateItemTotal(120, 3)).toBe(360);
  });

  it('should handle zero quantity', () => {
    expect(calculateItemTotal(120, 0)).toBe(0);
  });
});

// CartContext.test.ts
describe('addItem', () => {
  it('should add new item', () => {
    // Test implementation
  });

  it('should reject invalid quantity', () => {
    // Test implementation
  });
});
```

### **Integration Tests:**
```typescript
// ProductDetail.test.tsx
describe('Add to Cart Flow', () => {
  it('should reset counter after adding', async () => {
    render(<ProductDetail />);
    // Click +
    // Click Add to Cart
    // Verify counter = 0
  });
});
```

---

## 📝 Naming Conventions

### **Files:**
- Components: PascalCase (`ProductDetail.tsx`)
- Services: camelCase (`pricingService.ts`)
- Types: camelCase (`cartTypes.ts`)
- Config: camelCase (`products.ts`)

### **Functions:**
- Actions: verb + noun (`addItem`, `removeItem`)
- Calculations: `calculate` prefix (`calculateTotal`)
- Validation: `validate` or `is` prefix (`isProductValid`)
- Getters: `get` prefix (`getSubtotal`)

### **Variables:**
- Constants: SCREAMING_SNAKE_CASE (`CART_STORAGE_KEY`)
- State: camelCase (`currentProductIndex`)
- Props: camelCase (`productId`)

---

## 🔄 Version Control Strategy

### **Branch Strategy:**
```
main (production)
  ├── develop (staging)
  │   ├── feature/backend-integration
  │   ├── feature/stripe-checkout
  │   └── feature/user-auth
  └── hotfix/cart-bug
```

### **Commit Convention:**
```
feat: Add Stripe checkout integration
fix: Reset counter after add to cart
refactor: Centralize pricing logic
docs: Update architecture documentation
test: Add unit tests for pricingService
```

---

## 📚 Documentation Structure

```
/childlike
  ├── ARCHITECTURE.md (This file - System design)
  ├── SECURITY.md (Security measures & audit)
  ├── README.md (Getting started)
  └── /docs
      ├── API.md (Backend API documentation)
      ├── DEPLOYMENT.md (Deploy instructions)
      └── TROUBLESHOOTING.md (Common issues)
```

---

## ✅ Production Readiness Checklist

### **Architecture** ✅
- [x] Separation of concerns
- [x] Single source of truth (CartContext)
- [x] Centralized business logic (pricingService)
- [x] Independent component states
- [x] Scalable data structures
- [x] Backend-ready interfaces

### **Security** ✅
- [x] Input validation (all operations)
- [x] Type safety (TypeScript)
- [x] Data sanitization (localStorage)
- [x] Rate limiting ready
- [x] CSRF protection ready
- [x] XSS protection (React)

### **Performance** ✅
- [x] Minimal re-renders (React best practices)
- [x] LocalStorage caching
- [x] Lazy loading ready
- [x] Code splitting ready
- [x] CDN ready (static assets)

### **Maintainability** ✅
- [x] Clear naming conventions
- [x] Comprehensive documentation
- [x] Modular architecture
- [x] Easy to test
- [x] Easy to extend

---

**Last Updated:** January 19, 2025
**Architecture Version:** 2.0
**Status:** Production-Ready for Backend Integration
**Next Phase:** Supabase Product Management Integration
