export interface CartItem {
  productId: string;      // UNIQUE identifier: "product-slug-flavor-slug" or just "product-slug"
  slug: string;           // product slug used in URLs
  name: string;           // product display name (without flavor)
  price: number;          // unit price in PHP
  quantity: number;       // quantity in cart (1-99)
  flavorId?: string;      // optional: flavor ID for products with variants
  flavorName?: string;    // optional: flavor display name (e.g., "Chocolate Chip")
}

export interface CartState {
  items: CartItem[];
}
