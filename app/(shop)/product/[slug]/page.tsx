export const revalidate = 60;

import notFound from "../not-found";
import { titleFont } from "@/config/font";
import { SizeSelector, QuantitySelector, ProductSlideShow } from "@/components";
import { getProductBySlug } from "@/actions";
import { StockLabel } from "@/components";
import { AddToCart } from "./ui/AddToCart";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const { gender, images = [], title } = (await getProductBySlug(slug)) || {};

  return {
    title: `${slug} | Teslo | shop$`,
    description: `${title}`,
    openGraph: {
      title: `${slug} | Teslo | shop$`,
      description: `${slug} | ${gender}`,
      images: [
        {
          url: `http:localhost:3000/product/${images[0]}`,
        },
      ],
    },
  };
}

export default async function ({ params }: Props) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) return notFound();

  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className="col-span-1 md:col-span-2 bg-gray-300">
        <ProductSlideShow title={product.title} images={product.images} />
      </div>

      <div className="col-span-1 px-5 ">
        <StockLabel slug={slug} />

        <h1 className={`${titleFont.className} antialiased text-xl`}>
          {product.title}
        </h1>
        <p className="text-lg mb-5">{product.price}</p>

        <AddToCart product={product} />

        <h3 className="font-bold text-sm">Description</h3>
        <p className="font-light">{product.description}</p>
      </div>
    </div>
  );
}
