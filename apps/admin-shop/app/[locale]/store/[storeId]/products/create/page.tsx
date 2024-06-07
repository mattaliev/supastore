import WithAuth from "@/components/auth/with-auth";
import ProductCreateForm from "@/components/product/product-create-form";

export const dynamic = "force-dynamic";

type ProductCreatePageProps = {
  params: {
    storeId: string;
  };
};

function ProductCreatePage() {
  return <ProductCreateForm />;
}

export default WithAuth<ProductCreatePageProps>(ProductCreatePage);
