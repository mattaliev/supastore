import { productDetail } from "@ditch/lib";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authenticated, authOptions } from "@/auth";
import ProductUpdateForm from "@/components/product/product-update-form";

export const dynamic = "force-dynamic";

type ProductEditPageProps = {
  params: {
    productId: string;
  };
};

export default async function ProductEditPage({
  params
}: ProductEditPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.accessToken) {
    redirect("/auth/signIn");
  }

  const product = await authenticated(session.user.accessToken, productDetail, {
    id: params.productId
  });

  if (!product) {
    notFound();
  }

  return <ProductUpdateForm product={product} />;
}
