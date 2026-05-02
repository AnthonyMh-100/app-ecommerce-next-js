import { getOrderById } from "@/actions/order/get-order-by-id";
import { PayPalButton, Title } from "@/components";
import { initialData } from "@/seed/seed";
import { currencyFormat } from "@/utils";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { IoCartOutline } from "react-icons/io5";

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];

interface Props {
  params: {
    id: string;
  };
}
export default async function ({ params }: Props) {
  const { id } = await params;

  const { ok, order } = await getOrderById(id);

  if (!ok) {
    redirect("/");
  }

  const address = order?.orderAddress;
  return (
    <div className="flex flex-col sm:flex-row justify-center px-5 py-10 gap-10">
      <div className="w-full max-w-2xl">
        <Title title={`Orden #${id.split("-").at(-1)}`} className="mb-5" />

        <div className="mb-6">
          <div
            className={clsx(
              "flex items-center  rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
              {
                "bg-red-500": !order!.isPaid,
                "bg-green-700": order!.isPaid,
              },
            )}
          >
            <IoCartOutline size={30} />
            {/* <span className="mx-2">Pendiente</span> */}
            <span className="mx-2">
              {order?.isPaid ? "Pagada" : "No Pagada"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {order!.orderItem.map(({ product, price, quantity }) => (
            <div
              key={product.slug}
              className="flex items-start gap-4 border-b pb-5"
            >
              <Image
                src={`/products/${product.productImage[0].url}`}
                width={80}
                height={80}
                alt={product.title}
                className="rounded"
                style={{
                  width: "100px",
                  height: "100px",
                }}
              />

              <div className="flex flex-col">
                <p className="font-medium">{product.title}</p>
                <p className="text-gray-700">${currencyFormat(price)}</p>

                <div className="mt-2">
                  <p className="font-bold">
                    Subtotal: {currencyFormat(price * quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-xl p-7 w-120">
        <h2 className="text-2xl mb-2">Direccion de entrega</h2>
        <div className="mb-10">
          <p className="text-xl font-bold">
            {address!.firstName} {address!.lastName}
          </p>
          <p>{address!.address}</p>
          <p>{address!.address2}</p>
          <p>{address!.postalCode}</p>

          <p>
            {address!.city}, {address!.countryId}
          </p>
          <p>{address!.phone}</p>
        </div>

        <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

        <h2 className="text-2xl mb-2">Resumen de orden</h2>
        <div className="grid grid-cols-2">
          <span className="mt-5">No. Productos</span>
          <span className="mt-5 text-right font-bold">
            {order?.itemsInOrder} arituculos
          </span>

          <span className="mt-5">Subtotal</span>
          <span className="mt-5 text-right font-bold">
            {currencyFormat(order!.subTotal)}
          </span>

          <span className="mt-5">Impuesto (15%)</span>
          <span className="mt-5 text-right font-bold">
            {currencyFormat(order!.tax)}
          </span>

          <span className="mt-5 text-2xl">total: </span>
          <span className="mt-5 text-right text-2xl">
            {currencyFormat(order!.total)}
          </span>
        </div>
        {/* <div className="mt-6">
          <div
            className={clsx(
              "flex items-center  rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
              {
                "bg-red-500": !order!.isPaid,
                "bg-green-700": order!.isPaid,
              },
            )}
          >
            <IoCartOutline size={30} />
            <span className="mx-2">
              {order?.isPaid ? "Pagada" : "No Pagada"}
            </span>
          </div>
        </div> */}

        <PayPalButton amount={order!.total} orderId={order!.id} />
      </div>
    </div>
  );
}
