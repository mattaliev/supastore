import ProductList from "@/components/product/product-list";
import Filters from "@/components/filters/filters";
import { productsGet } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function ProductListPage() {
  const products = await productsGet();

  return (
    <>
      <Filters />
      <ProductList products={products} />
    </>
  );
}
