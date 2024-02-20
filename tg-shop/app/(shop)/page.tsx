import Catalog from "@/components/product/product-catalog";
import { productsGet } from "@/lib/api";

const CatalogPage = async () => {
  const products = await productsGet();

  return (
    <div>
      <Catalog products={products} />
    </div>
  );
};

export default CatalogPage;
