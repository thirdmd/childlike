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
    id: "chewy-protein-cookie",
    slug: "chewy-protein-cookie",
    name: "Chewy Protein Cookie",
    tagline: "Engineered indulgence",
    description: "A protein cookie designed with precision. High protein, low sugar, real ingredients. Soft texture, honest flavor. No compromise between nutrition and taste.",
    status: "coming_soon",
    price: 120,
    flavors: [
      {
        id: "chocolate-chip",
        name: "Chocolate Chip",
        slug: "chocolate-chip",
        description: "Stop overthinking. It's a f*cking chewy chocolate-chip cookie… you know exactly what that is. Except this one is packing hard like a BBC (Buff Bake Cookie). High in protein, low in sugar, no compromise between taste and nutrition.",
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
              childlike: "69g (ideal number) ✅",
              competitor: "definetely NOT 69g 😡",
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
          calories: 270,
          protein: 22,
          sugar: 5,
        },
        reviews: {
          totalCount: 0,
          averageRating: 0,
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        },
      },
      {
        id: "peanut-butter",
        name: "Peanut Butter",
        slug: "peanut-butter",
        description: "Rich, creamy peanut butter flavor in a soft, chewy cookie. High protein, low sugar, real peanut butter. Classic taste, engineered nutrition.",
        compareTitle: "Childlike vs Chipsahoy",
        macros: {
          calories: 0,
          protein: 0,
          sugar: 0,
        },
        reviews: {
          totalCount: 0,
          averageRating: 0,
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        },
      },
      {
        id: "pistachio-biskit",
        name: "Pistachio Biskit",
        slug: "pistachio-biskit",
        description: "Unique pistachio flavor with a soft, biskit-style texture. High protein, low sugar, real pistachios. Sophisticated taste, premium ingredients.",
        compareTitle: "Childlike vs Chipsahoy",
        macros: {
          calories: 0,
          protein: 0,
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
