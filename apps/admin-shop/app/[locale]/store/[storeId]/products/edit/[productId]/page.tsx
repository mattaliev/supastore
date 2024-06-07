import { productDetail } from "@ditch/lib";
import { notFound } from "next/navigation";

import { authenticated } from "@/auth";
import WithAuth, { WithAuthProps } from "@/components/auth/with-auth";
import ProductUpdateForm from "@/components/product/product-update-form";

export const dynamic = "force-dynamic";

type ProductEditPageProps = {
  params: {
    storeId: string;
    productId: string;
  };
};

async function ProductEditPage({
  params: { productId },
  accessToken
}: WithAuthProps<ProductEditPageProps>) {
  const product = await authenticated(accessToken, productDetail, {
    id: productId
  });

  if (!product) {
    notFound();
  }

  return <ProductUpdateForm product={product} />;
}

export default WithAuth<ProductEditPageProps>(ProductEditPage);
