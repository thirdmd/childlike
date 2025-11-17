export type ProductStatus = "coming_soon" | "available";

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
}

export const productsConfig: Product[] = [
  {
    id: "chewy-protein-cookie",
    slug: "chewy-protein-cookie",
    name: "Chewy Protein Cookie",
    tagline: "Engineered indulgence",
    description: "A protein cookie designed with precision. High protein, low sugar, real ingredients. Soft texture, honest flavor. No compromise between nutrition and taste.",
    status: "coming_soon",
    price: 0,
    macros: {
      protein: 20,
      carbs: 15,
      fat: 8,
      sugar: 2,
    },
  },
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return productsConfig.find((product) => product.slug === slug);
};
