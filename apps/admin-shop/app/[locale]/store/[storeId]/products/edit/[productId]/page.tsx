import { adminProductGet } from "@ditch/lib";
import { notFound } from "next/navigation";

import { authenticated } from "@/auth";
import WithAuth, { WithAuthProps } from "@/components/auth/with-auth";
import ProductFormFields from "@/components/product/ProductFormFields";

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
  const product = await authenticated(accessToken, adminProductGet, {
    id: productId
  });

  if (!product) {
    notFound();
  }

  return <ProductFormFields product={product} />;
}

export default WithAuth<ProductEditPageProps>(ProductEditPage);
