"use client";
import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

export const ProductsInCart = () => {
  const [_, setIsLoading] = useState(false);

  const productsInCart = useCartStore((state) => state.cart);

  useEffect(() => {
    setIsLoading(true);
  }, []);

  return (
    <>
      {productsInCart.map((product) => (
        <div
          key={`${product.slug}-${product.id}-${product.size}`}
          className="flex items-start gap-4 border-b pb-5"
        >
          <Image
            src={`/products/${product.image}`}
            width={80}
            height={80}
            alt={product.title}
            className="rounded"
            style={{
              width: "100px",
              height: "100px",
            }}
            priority
          />

          <div className="flex flex-col">
            <div className="flex gap-4">
              <span className="bg-blue-400 w-12 flex justify-center items-center p-1 text-sm font-medium text-white mb-4 rounded-full">
                {product.size}
              </span>
              <span className="hover:underline">
                <span className="font-medium -ml-2 flex gap-2">
                  {product.title}
                  <p>{`(${product.quantity})`}</p>
                </span>
              </span>
            </div>

            <p className="text-gray-700 font-bold">
              {currencyFormat(product.price * product.quantity)}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};
