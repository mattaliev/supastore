import ProductList from "@/components/product/product-list";
import { Product } from "@/lib/api/types";
import Filters from "@/components/filters/filters";
import { productsGet } from "@/lib/api";

export default async function ProductListPage() {
  const products: Product[] = await productsGet();

  return (
    <>
      <Filters />
      <ProductList products={products} />
    </>
  );
}
