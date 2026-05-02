import { Title } from "@/components";
import Link from "next/link";
import { ProductsInCart } from "./ui/ProductsInCart";
import { PlaceOrder } from "./ui/PlaceOrder";

export const CheckouPage = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-center px-5 py-10 gap-10">
      <div className="w-full max-w-2xl">
        <Title title="Verificar orden" className="mb-5" />

        <div className="mb-6">
          <span className="text-lg font-semibold block">Ajustar Elementos</span>

          <Link href="/cart" className="underline text-sm text-gray-600">
            Editar carrito
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          <ProductsInCart />
        </div>
      </div>
      <PlaceOrder />
    </div>
  );
};

export default CheckouPage;
