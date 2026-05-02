export interface Product {
  id: string;
  categoryId: string;
  description: string;
  gender: ValidCatgory;
  inStock: number;
  price: number;
  images: string[];
  sizes: ValidSizes[];
  slug: string;
  tags: string[];
  title: string;
  // type: ValidTypes;
}

export interface CartProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  size: ValidSizes;
  image: string;
}

export type ValidCatgory = "men" | "women" | "kid" | "unisex";
export type ValidSizes = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL";
export type ValidTypes = "shirts" | "pants" | "hoodies" | "hats";
