import { productDetail } from "@ditch/lib";
import { notFound } from "next/navigation";

import ProductUpdateForm from "@/components/product/product-update-form";

export const dynamic = "force-dynamic";

type ProductEditPageProps = {
  params: {
    productId: string;
  };
};

export default async function ProductEditPage({
  params,
}: ProductEditPageProps) {
  const product = await productDetail(params.productId);

  if (!product) {
    notFound();
  }

  return <ProductUpdateForm product={product} />;
}
