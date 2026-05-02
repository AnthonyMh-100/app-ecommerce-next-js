import { auth } from "@/app/auth.config";
import { redirect } from "next/navigation";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export const CheckoutLayout = async ({ children }: Props) => {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }
  return <>{children}</>;
};

export default CheckoutLayout;
