"use client";

import { authenticate } from "@/actions";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { ButtonLogin } from "./Button";
import {
  IoWarningOutline,
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";
import { redirect } from "next/navigation";

export const LoginForm = () => {
  const [state, dispatch, isPending] = useActionState(authenticate, undefined);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state === "Success") {
      window.location.replace("/");
    }
  }, [state]);

  return (
    <form action={dispatch} className="flex flex-col">
      <label htmlFor="email">Correo electrónico</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="email"
        name="email"
        id="email"
      />

      <label htmlFor="password">Contraseña</label>
      <div className="relative mb-5">
        <input
          className="px-5 py-2 border bg-gray-200 rounded w-full pr-10"
          name="password"
          type={showPassword ? "text" : "password"}
          id="password"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? (
            <IoEyeOffOutline size={20} />
          ) : (
            <IoEyeOutline size={20} />
          )}
        </button>
      </div>

      {state === "CredentialsSignin" && (
        <div className="flex items-center gap-3 bg-red-100 text-red-700 p-3 rounded-md text-sm mb-5">
          <IoWarningOutline /> Credenciales incorrectas
        </div>
      )}
      <ButtonLogin />

      {/* divisor l ine */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link
        href="/auth/new-account"
        className="bg-gray-300 p-2 rounded text-center"
      >
        Crear una nueva cuenta
      </Link>
    </form>
  );
};
