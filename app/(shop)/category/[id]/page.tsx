export const revalidate = 60;

import React from "react";
import { notFound } from "next/navigation";
import { Pagination, ProductGrid, Title } from "@/components";
import { ValidCatgory } from "@/interface";
import { getPaginatedProductsWithImges } from "@/actions";

interface Props {
  params: {
    id: ValidCatgory;
  };
  searchParams: {
    page?: string;
  };
}

const labels: Record<ValidCatgory, string> = {
  men: "Hombres",
  women: "Mujeres",
  kid: "Niños",
  unisex: "Para Todos",
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;

  return {
    title: `${labels[id]} | Teslo | shop$`,
    description: `${labels[id]} | Todos los productos`,
  };
}

export default async function ({ params, searchParams }: Props) {
  const { id: genederParam } = await params;

  const { page } = (await searchParams) || {};

  const { products: productsData, totalPages } =
    await getPaginatedProductsWithImges({
      page: Number(page),
      gender: genederParam,
    });

  const productsGender = productsData.filter(
    ({ gender }) => gender === genederParam,
  );

  if (!Object.keys(labels).includes(genederParam)) return notFound();

  return (
    <div>
      <Title
        title={`Articulo ${labels[genederParam]}`}
        subtitle="Todos los productos"
        className="mb-2"
      />

      <ProductGrid products={productsGender} />
      <Pagination totalPages={totalPages} />
    </div>
  );
}
