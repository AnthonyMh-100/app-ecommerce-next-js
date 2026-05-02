"use client";

import { Size } from "@/app/generated/prisma/enums";
import { ValidSizes } from "@/interface";
import clsx from "clsx";

interface Props {
  selectedSize?: ValidSizes;
  avaliableSize: ValidSizes[];
  onSizeChanged: (size: Size) => void;
}

export const SizeSelector = ({
  selectedSize,
  avaliableSize,
  onSizeChanged,
}: Props) => {
  return (
    <div className="my-5 ">
      <h3 className="font-bold mb-4 ">Tallas disponibles</h3>
      <div className="flex">
        {avaliableSize.map((size) => (
          <button
            className={clsx("mx-2 hover:underline cursor-pointer text-lg", {
              underline: size === selectedSize,
            })}
            onClick={() => onSizeChanged(size)}
            key={size}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};
