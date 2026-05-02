"use server";

import { auth } from "@/app/auth.config";
import { prisma } from "@/app/lib/prisma";
import { ok } from "assert";

export const getOrderById = async (id: string) => {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false,
      message: "Debe de estar autenticado",
    };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderAddress: true,
        orderItem: {
          select: {
            price: true,
            quantity: true,
            size: true,

            product: {
              select: {
                title: true,
                slug: true,

                productImage: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) throw new Error(`${id} no existe`);
    if (session?.user.role === "user") {
      if (session?.user.id === order.userId) {
        throw new Error(`${id}  no es de ususario`);
      }
    }

    return {
      ok: true,
      order,
    };
  } catch (error) {
    return {
      ok: false,
      message: "Hable con el administrador",
    };
  }
};
