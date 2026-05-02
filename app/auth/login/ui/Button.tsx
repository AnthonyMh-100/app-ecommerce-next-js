import clsx from "clsx";
import React from "react";
import { useFormStatus } from "react-dom";

export const ButtonLogin = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={clsx("bg-blue-500 text-white rounded p-2 cursor-pointer", {
        "bg-blue-200": pending,
      })}
      disabled={pending}
    >
      Ingresar
    </button>
  );
};
