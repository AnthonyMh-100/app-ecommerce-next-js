"use client";
import { Title } from "@/components";
import { redirect } from "next/navigation";
import Link from "next/link";

import { ProductsInCart } from "./ui/ProductsInCart";
import { OrderSumary } from "./ui/OrderSumary";
import { useCartStore } from "@/store";
import { useEffect, useState } from "react";

export const CartPage = () => {
  const [loaded, setLoaded] = useState(false);
  const productsInCart = useCartStore((state) => state.cart);

  if (!productsInCart.length && loaded) redirect("/empty");
  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-center px-5 py-10 gap-10">
      <div className="w-full max-w-2xl">
        <Title title="Carrito" className="mb-5" />

        <div className="mb-6">
          <span className="text-lg font-semibold block">Agregar más items</span>

          <Link href="/" className="underline text-sm text-gray-600">
            Continúa comprando
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          <ProductsInCart />
        </div>
      </div>
      <OrderSumary />
    </div>
  );
};

export default CartPage;
