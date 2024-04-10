import CatalogProduct from "@/components/product/product";
import { Product } from "@/lib/api/types";

export const revalidate = 5;

export default function Catalog({ products }: { products?: Product[] }) {
  return (
    products && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 py-6 bg-telegram-bg-color">
        {products?.map((product) => (
          <CatalogProduct key={product.id} product={product} />
        ))}
      </div>
    )
  );
}
