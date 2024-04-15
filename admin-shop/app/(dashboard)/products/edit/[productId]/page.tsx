import { productDetail } from "@/lib/api";
import ProductUpdateForm from "@/components/product/product-update-form";
import { notFound } from "next/navigation";

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

  console.log("Loading a product");

  if (!product) {
    notFound();
  }

  return <ProductUpdateForm product={product} />;
}
