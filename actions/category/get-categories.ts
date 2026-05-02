"use server";

import { prisma } from "@/app/lib/prisma";

export const geCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return categories;
  } catch (error) {
    return [];
  }
};
