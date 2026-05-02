import { initialData } from "./seed";
import { prisma } from "../app/lib/prisma";
import { countries } from "./seed-countries";

interface CategoryValue {
  id: string;
  name: string;
}

async function main() {
  await Promise.all([
    await prisma.orderAddress.deleteMany(),
    await prisma.orderItem.deleteMany(),
    await prisma.order.deleteMany(),

    await prisma.userAddress.deleteMany(),
    await prisma.user.deleteMany(),
    await prisma.country.deleteMany(),
    await prisma.productImage.deleteMany(),
    await prisma.product.deleteMany(),
    await prisma.category.deleteMany(),
  ]);

  const { categories, products, users } = initialData;

  await prisma.country.createMany({
    data: countries,
  });

  await prisma.user.createMany({
    data: users,
  });

  const categoriesData = categories.map((category) => ({
    name: category,
  }));

  await prisma.category.createMany({
    data: categoriesData,
  });

  const categoryDB = await prisma.category.findMany();

  const categoriesMap = categoryDB.reduce(
    (acc: any, { id, name }: CategoryValue) => {
      acc[name.toLocaleLowerCase()] = id;

      return acc;
    },
    {} as Record<string, string>,
  );

  await Promise.all(
    products.map(async (product) => {
      const { images, type, ...rest } = product;

      const productDB = await prisma.product.create({
        data: {
          ...rest,
          categoryId: categoriesMap[type],
        },
      });

      const imagesData = images.map((image) => ({
        productId: productDB.id,
        url: image,
      }));

      await prisma.productImage.createMany({
        data: imagesData,
      });
    }),
  );

  console.log("Ejecutado correctamente");
}

(() => {
  // if (process.env.NODE_ENV === "production") return;
  main();
})();
