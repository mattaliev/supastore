import ProductCreateForm from "@/components/product/product-create-form";

export const dynamic = "force-dynamic";

type ProductCreatePageProps = {
  params: {
    storeId: string;
  };
};

export default function ProductCreatePage({ params }: ProductCreatePageProps) {
  return <ProductCreateForm storeId={params.storeId} />;
}
