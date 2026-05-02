"use server";

import { prisma } from "@/app/lib/prisma";
import bcryptjs from "bcryptjs";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  try {
    const user = await prisma.user.create({
      data: {
        name,
        password: bcryptjs.hashSync(password),
        email,
        image: "",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return {
      ok: true,
      user,
      message: "Usuario creado",
    };
  } catch (error) {
    return {
      ok: false,
      message: "No se pudo crear el ususario",
    };
  }
};
