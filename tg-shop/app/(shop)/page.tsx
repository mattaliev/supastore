import Catalog from "@/components/product/product-catalog";
import { productsGet } from "@/lib/api";

const CatalogPage = async () => {
  const products = await productsGet({ state: "ACTIVE" });

  return <Catalog products={products} />;
};

export default CatalogPage;
