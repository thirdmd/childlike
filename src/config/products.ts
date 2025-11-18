export type ProductStatus = "coming_soon" | "available";

export interface Flavor {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: ProductStatus;
  price: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    sugar: number;
  };
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
    macros: {
      protein: 20,
      carbs: 15,
      fat: 8,
      sugar: 2,
    },
    flavors: [
      {
        id: "chocolate-chip",
        name: "Chocolate Chip",
        slug: "chocolate-chip",
      },
      {
        id: "peanut-butter",
        name: "Peanut Butter",
        slug: "peanut-butter",
      },
      {
        id: "pistachio-biskit",
        name: "Pistachio Biskit",
        slug: "pistachio-biskit",
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
    macros: {
      protein: 0,
      carbs: 0,
      fat: 0,
      sugar: 0,
    },
    flavors: [],
  },
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return productsConfig.find((product) => product.slug === slug);
};
