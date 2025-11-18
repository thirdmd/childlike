# Product Image Naming Convention (CENTRALIZED RULE)

## Standard Formats

### Product Detail View
```
productview_(product)_(flavor).png
```

### Cart View
```
cartview_(product)_(flavor).png
```

**These are the ONLY accepted formats for product images across the entire application.**

## Examples

| View | Product | Flavor | Filename |
|------|---------|--------|----------|
| Product Detail | Chewy Protein Cookie | Chocolate Chip | `productview_cookie_chocochip.png` |
| Product Detail | Chewy Protein Cookie | Peanut Butter | `productview_cookie_peanutbutter.png` |
| Product Detail | Chewy Protein Cookie | Pistachio Biskit | `productview_cookie_pistachio.png` |
| Cart | Chewy Protein Cookie | Chocolate Chip | `cartview_cookie_chocochip.png` |
| Cart | Chewy Protein Cookie | Peanut Butter | `cartview_cookie_peanutbutter.png` |
| Cart | Chewy Protein Cookie | Pistachio Biskit | `cartview_cookie_pistachio.png` |

## Naming Abbreviations

### Product Abbreviations
- `chewy-protein-cookie` → `cookie`

### Flavor Abbreviations
- `chocolate-chip` → `chocochip`
- `peanut-butter` → `peanutbutter`
- `pistachio-biskit` → `pistachio`

## How to Add a New Product Flavor Image

### Step 1: Create the Image Files
Create TWO images following the naming conventions:
- Product Detail View: `productview_(product)_(flavor).png`
- Cart View: `cartview_(product)_(flavor).png`
- Place both in `src/assets/` directory

Example:
- `src/assets/productview_cookie_peanutbutter.png`
- `src/assets/cartview_cookie_peanutbutter.png`

### Step 2A: Import in ProductDetail.tsx
Add the import at the top of the file (around line 27):

```typescript
import productview_cookie_peanutbutter from "@/assets/productview_cookie_peanutbutter.png";
```

### Step 2B: Import in Cart.tsx
Add the import at the top of the file (around line 22):

```typescript
import cartview_cookie_peanutbutter from "@/assets/cartview_cookie_peanutbutter.png";
```

### Step 3A: Add to ProductDetail Mapping
Add to `productFlavorImages` mapping in ProductDetail.tsx (around line 36):

```typescript
const productFlavorImages: Record<string, string> = {
  "chewy-protein-cookie-chocolate-chip": productview_cookie_chocochip,
  "chewy-protein-cookie-peanut-butter": productview_cookie_peanutbutter, // ← ADD THIS
  "chewy-protein-cookie-pistachio-biskit": productview_cookie_pistachio,
};
```

### Step 3B: Add to Cart Mapping
Add to `cartFlavorImages` mapping in Cart.tsx (around line 32):

```typescript
const cartFlavorImages: Record<string, string> = {
  "chewy-protein-cookie-chocolate-chip": cartview_cookie_chocochip,
  "chewy-protein-cookie-peanut-butter": cartview_cookie_peanutbutter, // ← ADD THIS
  "chewy-protein-cookie-pistachio-biskit": cartview_cookie_pistachio,
};
```

**Key Format:** `{product-slug}-{flavor-slug}`

### Step 4: Done!
The images will automatically display in both views when users interact with that product flavor.

## System Architecture

### Product Detail View - Image Resolution
Location: `src/routes/ProductDetail.tsx`

```typescript
const PRODUCT_PLACEHOLDER = `data:image/svg+xml,%3Csvg...%3E`; // Royal Blue square placeholder

const getProductImage = (productSlug: string, flavorSlug?: string): string => {
  if (!flavorSlug) return PRODUCT_PLACEHOLDER;

  const key = `${productSlug}-${flavorSlug}`;
  return productFlavorImages[key] || PRODUCT_PLACEHOLDER;
};
```

**Usage:**
```typescript
const productImageSrc = getProductImage(product?.slug, currentFlavor?.slug);
```

**Behavior:** Returns flavor-specific image if exists, otherwise returns placeholder. ALL products show images.

### Cart View - Image Resolution
Location: `src/routes/Cart.tsx`

```typescript
const CART_PLACEHOLDER = `data:image/svg+xml,%3Csvg...%3E`; // Royal Blue square placeholder

const getCartImage = (productId: string): string => {
  return cartFlavorImages[productId] || CART_PLACEHOLDER;
};
```

**Usage:**
```typescript
<img src={getCartImage(item.productId)} alt={...} />
```

**Behavior:** Returns flavor-specific image if exists, otherwise returns placeholder. ALL products show images.

**Key Difference:** Cart uses `productId` (already in `product-slug-flavor-slug` format), ProductDetail builds it from separate slugs.

## Image Display Strategy

**IMPORTANT:** Each flavor should only show its own image. Products without images show elegant placeholders.

### How Images Work

1. **Flavor WITH uploaded image** → Shows flavor-specific image
   - Example: Chocolate Chip shows `productview_cookie_chocochip.png`

2. **Flavor WITHOUT uploaded image** → Shows PLACEHOLDER
   - Example: Peanut Butter shows clean square placeholder (until real image is uploaded)
   - Example: Pistachio Biskit shows clean square placeholder (until real image is uploaded)

3. **CENTRALIZED PLACEHOLDER SYSTEM**
   - All products without images show elegant square placeholders
   - Royal Blue (#0047AB) background with white geometric icon
   - Consistent brand experience across all products
   - Automatic - no setup needed for new products/flavors

### Placeholder Design

**Visual Specs:**
- Square aspect ratio (200×200 for cart, 400×400 for product view)
- Royal Blue background (#0047AB)
- White geometric diamond icon (30% opacity)
- Clean, minimal, brand-aligned
- Inline SVG (no external files needed)

### Why This Matters

❌ **WRONG:** Peanut Butter showing Chocolate Chip image
- Confuses customers
- Shows incorrect product representation
- Could lead to wrong orders

✅ **CORRECT:** Peanut Butter showing PLACEHOLDER
- Clear visual presence (not blank)
- No misleading flavor information
- Professional appearance
- Matches Childlike brand identity

## Benefits of This Convention

1. **Consistent Naming** - Easy to identify what each image is for
2. **Centralized Management** - All images mapped in one place
3. **Type Safety** - TypeScript ensures correct imports
4. **Scalable** - Easy to add new products and flavors
5. **Smart Placeholders** - Elegant fallback for products without images
6. **Production Ready** - Vite properly bundles and optimizes images
7. **Professional Look** - All products have visual presence (real image or placeholder)
8. **Zero Setup** - New products automatically get placeholders until images are uploaded

## Current Status

### Implemented
- ✅ Product Detail - Chocolate Chip: `productview_cookie_chocochip.png`
- ✅ Cart - Chocolate Chip: `cartview_cookie_chocochip.png`

### Pending (Add When Available)

**Product Detail View:**
- ⏳ Peanut Butter: `productview_cookie_peanutbutter.png`
- ⏳ Pistachio Biskit: `productview_cookie_pistachio.png`

**Cart View:**
- ⏳ Peanut Butter: `cartview_cookie_peanutbutter.png`
- ⏳ Pistachio Biskit: `cartview_cookie_pistachio.png`

## Related Files

- `src/routes/ProductDetail.tsx` - Product detail view image mapping and display logic
- `src/routes/Cart.tsx` - Cart view image mapping and display logic
- `src/config/products.ts` - Product and flavor configuration
- `src/assets/` - Image storage directory
- `PRODUCT_IMAGE_CONVENTION.md` - This documentation file

## Important Notes

- **DO NOT** use random or inconsistent naming
- **DO NOT** hardcode image paths outside of the central mapping
- **DO NOT** use another flavor's image as fallback
- **ALWAYS** follow the `productview_(product)_(flavor).png` and `cartview_(product)_(flavor).png` formats
- **ALWAYS** import images statically (no dynamic string paths)
- Images must be imported at build time for Vite to process them correctly
- Only add flavor-specific images to the mapping when you have BOTH productview and cartview versions uploaded
- Products without images automatically show placeholders - clean, professional, brand-aligned
- Placeholders are inline SVGs - no external files needed
- New products/flavors require ZERO placeholder setup - system handles it automatically
