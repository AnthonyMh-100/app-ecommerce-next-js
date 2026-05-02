"use server";

import { auth } from "@/app/auth.config";
import { prisma } from "@/app/lib/prisma";
import type { ValidSizes, Address } from "@/interface";

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: ValidSizes;
}

export const placeOrder = async (
  productIds: ProductToOrder[],
  address: Address,
) => {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return {
        ok: false,
        message: "No hay session de usuario",
      };
    }

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds.map(({ productId }) => productId),
        },
      },
    });

    const itemsInOrder = productIds.reduce(
      (count, { quantity }) => count + quantity,
      0,
    );

    const { subTotal, tax, total } = productIds.reduce(
      (totals, item) => {
        const productQuantity = item.quantity;
        const product = products.find(
          ({ id: productId }) => productId === item.productId,
        );

        if (!product) throw new Error(`${item.productId} no existe - 500`);

        const subTotal = product.price * productQuantity;
        totals.subTotal += subTotal;
        totals.tax += subTotal * 0.15;
        totals.total += subTotal * 1.15;

        return totals;
      },
      {
        subTotal: 0,
        tax: 0,
        total: 0,
      },
    );

    try {
      const prismaTx = await prisma.$transaction(async (tx) => {
        const updatedProductsPromises = products.map(async (product) => {
          const productQuantity = productIds
            .filter(({ productId }) => productId === product.id)
            .reduce((acc, item) => item.quantity + acc, 0);

          if (productQuantity === 0) {
            throw new Error(`${product.id} no tiene cantidad definida`);
          }

          return tx.product.update({
            where: { id: product.id },
            data: {
              inStock: {
                decrement: productQuantity,
              },
            },
          });
        });

        const updatedProducts = await Promise.all(updatedProductsPromises);
        updatedProducts.forEach((product) => {
          if (product.inStock < 0) {
            throw new Error(`${product.title} no tiene inventario suficiente`);
          }
        });

        const order = await tx.order.create({
          data: {
            userId,
            itemsInOrder,
            subTotal,
            tax,
            total,

            orderItem: {
              createMany: {
                data: productIds.map((product) => ({
                  quantity: product.quantity,
                  size: product.size,
                  producId: product.productId,
                  price:
                    products.find(
                      ({ id: productId }) => productId === product.productId,
                    )?.price ?? 0,
                })),
              },
            },
          },
        });

        const { country, ...restAddress } = address;
        const orderAddress = await tx.orderAddress.create({
          data: {
            ...restAddress,
            countryId: country,
            orderId: order.id,
          },
        });

        return {
          order,
          updatedProducts,
          orderAddress,
        };
      });

      return {
        ok: true,
        order: prismaTx.order.id,
        prismaTx,
      };
    } catch (error: any) {
      return {
        ok: false,
        message: error?.message,
      };
    }
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message ?? "Error inesperado al crear la orden",
    };
  }
};
