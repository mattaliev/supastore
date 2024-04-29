import CatalogProduct from "@/components/product/product";
import { Paginated, Product } from "@ditch/lib";
import Pagination from "@/components/pagination";

export const revalidate = 5;

export default function Catalog({
  paginatedProducts,
  limit,
}: { paginatedProducts: Paginated<Product> } & {
  limit: number;
}) {
  const {
    objects: products,
    hasNext,
    hasPrev,
    pages,
    page,
  } = paginatedProducts;
  return (
    products && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 py-6 bg-telegram-bg-color">
        {products?.map((product) => (
          <CatalogProduct key={product.id} product={product} />
        ))}
        <Pagination
          totalPages={pages}
          page={page}
          hasNext={hasNext}
          hasPrev={hasPrev}
          limit={limit}
        />
      </div>
    )
  );
}
