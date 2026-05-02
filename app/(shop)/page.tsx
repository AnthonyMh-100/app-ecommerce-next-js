export const revalidate = 60;

import { Title } from "@/components";
import { ProductGrid } from "@/components";
import { getPaginatedProductsWithImges } from "@/actions";
import { redirect } from "next/navigation";
import { Pagination } from "@/components";

interface Props {
  searchParams: {
    page?: string;
  };
}

export default async function Home({ searchParams }: Props) {
  const { page } = (await searchParams) || {};
  const { products, totalPages } = await getPaginatedProductsWithImges({
    page: Number(page),
  });

  if (!products.length) redirect("/");

  return (
    <>
      <Title title="Tienda" subtitle="Todos los productos" className="mb-2" />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </>
  );
}
