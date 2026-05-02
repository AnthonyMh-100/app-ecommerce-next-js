import React from "react";
import { TopMenu, Sidebar, Footer } from "@/components";

interface Props {
  children: React.ReactNode;
}

export const ShopLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen">
      <TopMenu />
      <Sidebar />

      <div className="px-0 sm:px-10">{children}</div>
      <Footer />
    </div>
  );
};

export default ShopLayout;
