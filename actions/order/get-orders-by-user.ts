"use server";

import { auth } from "@/app/auth.config";
import { prisma } from "@/app/lib/prisma";

export const getOrderByUser = async () => {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false,
      message: "Debe estar autenticado",
    };
  }

  const orders = await prisma.order.findMany({
    where: { userId: session?.user.id },
    include: {
      orderAddress: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return {
    ok: true,
    orders,
  };
};
