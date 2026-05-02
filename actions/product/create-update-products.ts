"use server";

import { Product } from "@/app/generated/prisma/client";
import { Gender } from "@/app/generated/prisma/enums";
import { prisma } from "@/app/lib/prisma";
import { ValidSizes } from "@/interface";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";

const productSchema = z.object({
  id: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .pipe(z.string().uuid().optional()),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),
  price: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(2))),
  inStock: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(0))),
  categoryId: z.string().uuid(),
  sizes: z.coerce.string().transform((val) => val.split(",")),
  tags: z.string(),
  gender: z.nativeEnum(Gender),
});

export const createUpdateProducts = async (formData: FormData) => {
  const data = Object.fromEntries(formData);
  const productParsed = productSchema.safeParse(data);

  if (!productParsed.success) {
    return { ok: false };
  }

  const product = productParsed.data;
  product.slug = product.slug.toLocaleLowerCase().replace(/ /g, "-").trim();

  const { id, ...rest } = product;

  const imageFiles = formData.getAll("images") as File[];
  const imageNames: string[] = [];

  for (const image of imageFiles) {
    if (!image || image.size === 0) continue;

    const buffer = Buffer.from(await image.arrayBuffer());
    const fileName = `${Date.now()}-${image.name}`;
    const filePath = path.join(process.cwd(), "public", "products", fileName);

    await fs.writeFile(filePath, buffer);
    imageNames.push(fileName);
  }

  const prismaTx = await prisma.$transaction(async (tx) => {
    let productInfo: Product;
    const tagsArray = rest.tags
      .split(",")
      .map((tag) => tag.trim().toLocaleLowerCase());

    if (id) {
      productInfo = await tx.product.update({
        where: { id },
        data: {
          ...rest,
          sizes: { set: rest.sizes as ValidSizes[] },
          tags: { set: tagsArray },
        },
      });
    } else {
      productInfo = await tx.product.create({
        data: {
          ...rest,
          sizes: { set: rest.sizes as ValidSizes[] },
          tags: { set: tagsArray },
        },
      });
    }

    if (imageNames.length > 0) {
      await tx.productImage.createMany({
        data: imageNames.map((name) => ({
          url: name,
          productId: productInfo.id,
        })),
      });
    }

    revalidatePath("/admin/products");
    revalidatePath(`/product/${productInfo.slug}`);

    return { productInfo };
  });

  return {
    ok: true,
    product: prismaTx.productInfo,
  };
};
