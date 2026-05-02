import React from "react";
import { auth } from "../auth.config";
import { redirect } from "next/navigation";
interface Props {
  children: React.ReactNode;
}

export const ShopLayout = async ({ children }: Props) => {
  const session = await auth();

  if (session?.user) redirect("/");

  return (
    <div className="flex justify-center">
      <div className="w-full sm:w-75">{children}</div>
    </div>
  );
};

export default ShopLayout;
