import ProductList from "@/components/product/product-list";
import ProductFilters from "@/components/product/product-filters";
import { productsGet } from "@/lib/api";

type ProductListPageProps = {
  searchParams: {
    state?: string;
  };
};

export const dynamic = "force-dynamic";

export default async function ProductListPage({
  searchParams,
}: ProductListPageProps) {
  const products = await productsGet({ state: searchParams.state });

  return (
    <>
      <ProductFilters />
      <ProductList products={products} />
    </>
  );
}
