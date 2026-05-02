"use client";
import clsx from "clsx";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { login, registerUser } from "@/actions";

type FormInputs = {
  name: string;
  email: string;
  password: string;
};

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: FormInputs) => {
    setErrorMessage("");
    const { name, email, password } = data;

    const user = await registerUser(name, email, password);
    if (!user.ok) {
      setErrorMessage(user?.message);
      return;
    }

    await login(email.toLocaleLowerCase(), password);
    window.location.replace("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <label htmlFor="email">Nombre Completo</label>
      <input
        className={clsx("px-5 py-2 border bg-gray-200 rounded mb-5", {
          "border-red-500": errors?.name,
        })}
        type="text"
        autoFocus
        {...register("name", { required: true })}
      />

      <label htmlFor="email">Correo electrónico</label>
      <input
        className={clsx("px-5 py-2 border bg-gray-200 rounded mb-5", {
          "border-red-500": errors?.email,
        })}
        type="email"
        {...register("email", { required: true })}
        autoFocus
      />

      <label htmlFor="password">Contraseña</label>
      <input
        className={clsx("px-5 py-2 border bg-gray-200 rounded mb-5", {
          "border-red-500": errors?.password,
        })}
        type="password"
        {...register("password", { required: true })}
      />

      {errorMessage && <span className="text-red-500">{errorMessage}</span>}

      <button
        type="submit"
        className="bg-blue-500 text-white rounded p-2 cursor-pointer"
      >
        Nueva cuenta
      </button>

      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link href="/auth/login" className="bg-gray-300 p-2 rounded text-center">
        Ingresar
      </Link>
    </form>
  );
};
