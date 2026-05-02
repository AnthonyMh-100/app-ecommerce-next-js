import { getProductBySlug } from "@/actions";
import { titleFont } from "@/config/font";

interface Props {
  slug: string;
}

export const StockLabel = async ({ slug }: Props) => {
  const product = await getProductBySlug(slug);

  return (
    <h1 className={`${titleFont.className} antialiased text-xl font-bold`}>
      Stock: {product?.inStock}
    </h1>
  );
};
