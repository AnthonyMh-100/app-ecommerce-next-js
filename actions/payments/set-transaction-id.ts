"use server";

import { prisma } from "@/app/lib/prisma";
import { ok } from "node:assert";

export const setTransactionId = async (
  orderId: string,
  transactionId: string,
) => {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        transactionId,
      },
    });

    if (!order) {
      throw new Error(`No se encontro un orden con el id ${order}`);
    }

    return {
      ok: true,
      order,
    };
  } catch (error) {
    return {
      ok: false,
      message: "No se pudo actualiza el id de la transaccion",
    };
  }
};
