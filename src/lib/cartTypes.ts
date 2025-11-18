export interface CartItem {
  productId: string;   // unique product id (e.g. from products config)
  slug: string;        // product slug used in URLs
  name: string;        // display name
  price: number;       // unit price in PHP
  quantity: number;    // quantity in cart
}

export interface CartState {
  items: CartItem[];
}
