import { getProductBySlug, geCategories } from "@/actions";
import { Title } from "@/components";
import { redirect } from "next/navigation";
import React from "react";
import { ProductForm } from "./ui/ProductForm";

interface Props {
  params: {
    slug: string;
  };
}

export const ProductPage = async ({ params }: Props) => {
  const { slug } = await params;

  const [product, categories] = await Promise.all([
    getProductBySlug(slug),
    geCategories(),
  ]);

  if (!product && slug !== "new") {
    redirect("/admin/products");
  }

  const title = slug === "new" ? "Nuevo producto" : "Editar producto";

  return (
    <>
      <Title title={title} />

      <ProductForm product={product ?? {}} categories={categories} />
    </>
  );
};

export default ProductPage;
