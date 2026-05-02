"use client";

import { useCartStore } from "@/store";
import Link from "next/link";
import { useMemo } from "react";
import { currencyFormat } from "@/utils";

export const OrderSumary = () => {
  const cart = useCartStore((state) => state.cart);
  const getSummaryInformation = useCartStore(
    (state) => state.getSummaryInformation,
  );

  const { itemsInCart, subTotal, tax, total } = useMemo(
    () => getSummaryInformation(cart),
    [cart, getSummaryInformation],
  );

  return (
    <div className="bg-white rounded-xl shadow-xl p-7 w-120">
      <h2 className="text-2xl mb-2">Resumen de orden</h2>
      <div className="grid grid-cols-2">
        <span className="mt-5">No. Productos</span>
        <span className="mt-5 text-right font-bold">{`${itemsInCart} arituculos`}</span>

        <span className="mt-5">Subtotal</span>
        <span className="mt-5 text-right font-bold">
          {currencyFormat(subTotal)}
        </span>

        <span className="mt-5">Total Impuestos</span>
        <span className="mt-5 text-right font-bold">{currencyFormat(tax)}</span>

        <span className="mt-5 text-2xl">total: </span>
        <span className="mt-5 text-right text-2xl">
          {currencyFormat(total)}
        </span>
      </div>
      <div>
        <Link
          href="/checkout/address"
          className="flex justify-center bg-blue-600 text-white mt-5 py-2 rounded"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
};
