import React from "react";
import { titleFont } from "@/config/font";
import Link from "next/link";
import { RegisterForm } from "./ui/RegisterForm";

export const NewAccountPage = () => {
  return (
    <main className="flex flex-col min-h-screen pt-32 sm:pt-52">
      <h1 className={`${titleFont.className} text-4xl mb-5`}>Ingresar</h1>
      <RegisterForm />
    </main>
  );
};

export default NewAccountPage;
