import { productDetail } from "@ditch/lib";
import { notFound } from "next/navigation";

import ProductDetail from "@/components/product/product-detail";

type ProductDetailPageProps = {
  params: {
    storeId: string;
    productId: string;
  };
};

export default async function ProductDetailPage({
  params
}: ProductDetailPageProps) {
  const { storeId, productId } = params;

  const product = await productDetail({ id: productId });

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductDetail product={product} storeId={storeId} />
    </>
  );
}
