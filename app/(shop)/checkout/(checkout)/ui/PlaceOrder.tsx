"use client";
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";
import { placeOrder } from "@/actions";
import { useRouter } from "next/navigation";

export const PlaceOrder = () => {
  const router = useRouter();

  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const [isPlacingOrder, setPlacingOrder] = useState(false);

  const address = useAddressStore((state) => state.address);
  const cart = useCartStore((state) => state.cart);
  const getSummaryInformation = useCartStore(
    (state) => state.getSummaryInformation,
  );
  const clearCart = useCartStore((state) => state.clearCart);

  const { itemsInCart, subTotal, tax, total } = useMemo(
    () => getSummaryInformation(cart),
    [cart, getSummaryInformation],
  );

  useEffect(() => {
    setLoaded(true);
  }, []);

  const onPlaceOrder = async () => {
    setPlacingOrder(true);

    const productsToOder = cart.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }));

    const resp = await placeOrder(productsToOder, address);
    if (!resp.ok) {
      setPlacingOrder(false);
      setErrorMessage(resp.message);
    }
    clearCart();
    router.replace("/orders/" + resp.order);
    console.log({ resp });
  };

  if (!loaded) return <p>Cargando......</p>;

  return (
    <div className="bg-white rounded-xl shadow-xl p-7 w-120">
      <h2 className="text-2xl mb-2">Direccion de entrega</h2>
      <div className="mb-10">
        <p className="text-xl font-bold">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>{address.postalCode}</p>

        <p>
          {address.city}, {address.country}
        </p>
        <p>{address.phone}</p>
      </div>

      <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

      <h2 className="text-2xl mb-2">Resumen de orden</h2>
      <div className="grid grid-cols-2">
        <span className="mt-5">No. Productos</span>
        <span className="mt-5 text-right font-bold">
          {itemsInCart} arituculos
        </span>

        <span className="mt-5">Subtotal</span>
        <span className="mt-5 text-right font-bold">
          {currencyFormat(subTotal)}
        </span>

        <span className="mt-5">Impuesto (15%)</span>
        <span className="mt-5 text-right font-bold">{currencyFormat(tax)}</span>

        <span className="mt-5 text-2xl">total: </span>
        <span className="mt-5 text-right text-2xl">
          {currencyFormat(total)}
        </span>
      </div>
      <div>
        <span className="text-xs mt-5">
          Al hacer click en "Colocar orden", aceptas nuestros{" "}
          <a href="#" className="underline">
            terminos y condiciones de uso
          </a>
        </span>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <button
          onClick={onPlaceOrder}
          className={clsx(
            "flex justify-center bg-blue-600 text-white mt-5 p-2 px-5 rounded cursor-pointer",
            {
              "bg-gray-600 text-white": isPlacingOrder,
            },
          )}
        >
          Colocar orden
        </button>
      </div>
    </div>
  );
};
