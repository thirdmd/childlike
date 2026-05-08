export type ProductStatus = "coming_soon" | "available";

export interface ComparisonRow {
  attribute: string;
  childlike: string;
  competitor: string;
}

export interface ComparisonData {
  competitorName: string;
  rows: ComparisonRow[];
}

export interface Flavor {
  id: string;
  name: string;
  slug: string;
  price?: number; // Optional: flavor-specific price (overrides product price)
  description?: string; // Optional: flavor-specific description (overrides product description)
  compareTitle?: string; // Optional: flavor-specific comparison title (e.g. "Childlike vs Chipsahoy")
  comparison?: ComparisonData; // Optional: flavor-specific comparison data
  macros: {
    calories: number;
    protein: number;
    sugar: number;
  };
  reviews: {
    totalCount: number; // Total number of reviews
    averageRating: number; // 0-5, rounded to 1 decimal (0 = no reviews)
    distribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: ProductStatus;
  price: number;
  flavors: Flavor[];
}

export const productsConfig: Product[] = [
  {
    id: "childlike-cookie",
    slug: "childlike-cookie",
    name: "Childlike Cookie",
    tagline: "Engineered indulgence",
    description: "A protein cookie designed with precision. High protein, low sugar, real ingredients. Soft texture, honest flavor. No compromise between nutrition and taste.",
    status: "coming_soon",
    price: 145,
    flavors: [
      {
        id: "curby",
        name: "Curby",
        slug: "curby",
        description: "Tastes like ripe fruit.",
        compareTitle: "Childlike vs Chipsahoy",
        comparison: {
          competitorName: "Chips Ahoy!",
          rows: [
            {
              attribute: "Color",
              childlike: "better blue ✅",
              competitor: "blue",
            },
            {
              attribute: "Weight",
              childlike: "69g ✅",
              competitor: "Not 69g",
            },
            {
              attribute: "Age",
              childlike: "2026",
              competitor: "1963 ✅",
            },
            {
              attribute: "How you feel after",
              childlike: "I want more, and water ✅",
              competitor: "i want more water",
            },
          ],
        },
        macros: {
          calories: 295,
          protein: 23,
          sugar: 0,
        },
        reviews: {
          totalCount: 0,
          averageRating: 0,
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        },
      },
      {
        id: "charlie",
        name: "Charlie",
        slug: "charlie",
        price: 145,
        description: "Tastes and smells like nut.",
        compareTitle: "Childlike vs Chipsahoy",
        comparison: {
          competitorName: "Chips Ahoy!",
          rows: [
            {
              attribute: "Color",
              childlike: "better blue ✅",
              competitor: "blue",
            },
            {
              attribute: "Weight",
              childlike: "69g ✅",
              competitor: "Not 69g",
            },
            {
              attribute: "Age",
              childlike: "2026",
              competitor: "1963 ✅",
            },
            {
              attribute: "How you feel after",
              childlike: "I want more, and water ✅",
              competitor: "i want more water",
            },
          ],
        },
        macros: {
          calories: 290,
          protein: 23,
          sugar: 0,
        },
        reviews: {
          totalCount: 0,
          averageRating: 0,
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        },
      },
    ],
  },
  {
    id: "product-2",
    slug: "product-2",
    name: "",
    tagline: "",
    description: "",
    status: "coming_soon",
    price: 0,
    flavors: [],
  },
  {
    id: "product-3",
    slug: "product-3",
    name: "",
    tagline: "",
    description: "",
    status: "coming_soon",
    price: 0,
    flavors: [],
  },
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return productsConfig.find((product) => product.slug === slug);
};

/**
 * Get the effective price for a product flavor
 * Returns flavor-specific price if set, otherwise returns product base price
 * Centralized pricing logic - DO NOT hardcode prices elsewhere
 */
export const getFlavorPrice = (product: Product, flavor?: Flavor): number => {
  return flavor?.price ?? product.price;
};
