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
Location: `src/routes/ProductDetail.tsx:47-52`

```typescript
const getProductImage = (productSlug: string, flavorSlug?: string): string => {
  if (!flavorSlug) return defaultProductImage;

  const key = `${productSlug}-${flavorSlug}`;
  return productFlavorImages[key] || defaultProductImage;
};
```

**Usage:**
```typescript
const productImageSrc = getProductImage(product?.slug, currentFlavor?.slug);
```

### Cart View - Image Resolution
Location: `src/routes/Cart.tsx:43-45`

```typescript
const getCartImage = (productId: string): string => {
  return cartFlavorImages[productId] || defaultCartImage;
};
```

**Usage:**
```typescript
<img src={getCartImage(item.productId)} alt={...} />
```

**Key Difference:** Cart uses `productId` (already in `product-slug-flavor-slug` format), ProductDetail builds it from separate slugs.

## Benefits of This Convention

1. **Consistent Naming** - Easy to identify what each image is for
2. **Centralized Management** - All images mapped in one place
3. **Type Safety** - TypeScript ensures correct imports
4. **Scalable** - Easy to add new products and flavors
5. **Fallback Support** - Shows default image if specific image not found
6. **Production Ready** - Vite properly bundles and optimizes images

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
- **ALWAYS** follow the `productview_(product)_(flavor).png` format
- **ALWAYS** import images statically (no dynamic string paths)
- Images must be imported at build time for Vite to process them correctly
