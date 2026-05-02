"use server";

import { prisma } from "@/app/lib/prisma";

export const getProductBySlug = async (slug: string) => {
  try {
    const product = await prisma.product.findFirst({
      include: {
        productImage: true,
      },
      where: {
        slug,
      },
    });

    if (!product) return null;

    const { productImage } = product;

    return {
      ...product,
      images: productImage.map(({ url }) => url),
    };
  } catch (error) {
    console.log(error);

    throw new Error(`No se puedo cargar productos`);
  }
};
