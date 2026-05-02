"use client";

import { QuantitySelector, SizeSelector } from "@/components";
import { Product, ValidSizes } from "@/interface";
import { useCartStore } from "@/store";
import React, { useState } from "react";

interface Props {
  product: Product;
}

export const AddToCart = ({ product }: Props) => {
  const [size, setSize] = useState<ValidSizes | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [posted, setPosted] = useState<boolean>(false);

  const addToCartProduct = useCartStore((state) => state.addProducToCart);

  const addToCart = () => {
    setPosted(true);
    if (!size) return;

    const { id, slug, title, price, images } = product;

    addToCartProduct({
      id,
      slug,
      title,
      price,
      quantity,
      size,
      image: images[0],
    });
    setPosted(false);
    setQuantity(1);
    setSize(undefined);
  };

  return (
    <>
      {posted && !size && (
        <span className="mt-2 text-red-500 fade-in">
          Debe seleccionar una talla*
        </span>
      )}
      <SizeSelector
        selectedSize={size}
        avaliableSize={product.sizes}
        onSizeChanged={setSize}
      />

      <QuantitySelector quantity={quantity} onQuantityChanged={setQuantity} />

      <button
        onClick={addToCart}
        className="bg-blue-600 text-white my-4 p-3 rounded cursor-pointer"
      >
        Agregar al carrito
      </button>
    </>
  );
};
