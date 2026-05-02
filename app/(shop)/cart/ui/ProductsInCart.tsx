"use client";
import { QuantitySelector } from "@/components";
import { useCartStore } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const ProductsInCart = () => {
  const [_, setIsLoading] = useState(false);

  const productsInCart = useCartStore((state) => state.cart);
  const removeProductsInCart = useCartStore((state) => state.remove);

  const updateProducQuantity = useCartStore(
    (state) => state.updateProducQuantity,
  );

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
              <Link
                href={`/product/${product.slug}`}
                className="hover:underline"
              >
                <p className="font-medium">{product.title}</p>
              </Link>
            </div>

            <p className="text-gray-700">${product.price}</p>

            <div className="mt-2">
              <QuantitySelector
                quantity={product.quantity}
                onQuantityChanged={(quantity) =>
                  updateProducQuantity(product, quantity)
                }
              />
            </div>

            <button
              onClick={() => removeProductsInCart(product)}
              className="underline text-sm mt-2 text-left cursor-pointer"
            >
              Remover
            </button>
          </div>
        </div>
      ))}
    </>
  );
};
