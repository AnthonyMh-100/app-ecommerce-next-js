import { getOrderByUser, getPaginatedProductsWithImges } from "@/actions";
import { auth } from "@/app/auth.config";
import { Pagination, Title } from "@/components";
import { currencyFormat } from "@/utils";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

interface Props {
  searchParams: {
    page?: string;
  };
}

export const AdminPageProducts = async ({ searchParams }: Props) => {
  const { ok, orders = [] } = await getOrderByUser();

  const session = await auth();

  const isAuthenticated = !!session?.user;
  const isRoleAdmin = !!(session?.user.role === "admin");

  const { page } = (await searchParams) || {};
  const { products, totalPages } = await getPaginatedProductsWithImges({
    page: Number(page),
  });

  if (!products.length) redirect("/");

  if (!ok) {
    redirect("/auth/login");
  }

  if (isAuthenticated && !isRoleAdmin) {
    redirect("/");
  }
  return (
    <>
      <Title title="Mantenimiento de Productos" />

      <div className="flex justify-end mb-5">
        <Link
          href="/admin/product/new"
          className="bg-blue-500 p-2 text-white rounded text-sm"
        >
          Nuevo Producto
        </Link>
      </div>

      <div className="mb-10">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Imagen
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Titulo
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Precio
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Genero
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Stock
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Tallas
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <Link href={`/product/${product.slug}`}>
                    <Image
                      src={`/products/${product.productImage[0]?.url}`}
                      alt={product.title}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </Link>
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/admin/product/${product.slug}`}
                    className="hover:underline"
                  >
                    {product.title}
                  </Link>
                </td>
                <td className="flex items-center text-sm font-bold  text-gray-900  px-6 py-4 whitespace-nowrap">
                  {currencyFormat(product.price)}
                </td>
                <td className=" text-sm   text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {product.gender}
                </td>
                <td className=" text-sm   text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {product.inStock}
                </td>
                <td className=" text-sm  font-bold text-gray-900  px-6 py-4 whitespace-nowrap">
                  {product.sizes.join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination totalPages={totalPages} />
    </>
  );
};

export default AdminPageProducts;
