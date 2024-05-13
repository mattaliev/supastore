import { productDetail } from "@ditch/lib";
import { notFound } from "next/navigation";

import ProductDetail from "@/components/product/product-detail";

type ProductDetailPageProps = {
  params: {
    productId: string;
  };
};

export default async function ProductDetailPage({
  params
}: ProductDetailPageProps) {
  const product = await productDetail({ id: params.productId });

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductDetail product={product} />
    </>
  );
}
