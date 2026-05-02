"use server";

import { prisma } from "@/app/lib/prisma";
import { ValidCatgory } from "@/interface";

interface PaginatedOptions {
  page?: number;
  take?: number;
  gender?: ValidCatgory;
  slug?: string;
}

export const getPaginatedProductsWithImges = async ({
  page = 1,
  take = 10,
  gender,
  slug,
}: PaginatedOptions) => {
  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;

  try {
    const products = await prisma.product.findMany({
      take,
      skip: (page - 1) * take,
      include: {
        productImage: {
          take: 2,
          select: {
            url: true,
          },
        },
      },
      where: {
        ...(gender && { gender }),
        ...(slug && { slug }),
      },
    });

    const totalCount = await prisma.product.count({
      where: {
        ...(gender && { gender }),
        ...(slug && { slug }),
      },
    });

    const totalPages = Math.ceil(totalCount / take);

    return {
      currentPage: page,
      totalPages,
      products: products.map((product) => ({
        ...product,
        images: product.productImage.map(({ url }) => url),
      })),
    };
  } catch (error) {
    throw new Error(`No se pudo cargar los productos: ${error}`);
  }
};
