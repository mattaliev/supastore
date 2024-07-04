import { Paginated, ProductVariant } from "@ditch/lib";

import Pagination from "@/components/pagination";
import CatalogProduct from "@/components/product/product";

export default function Catalog({
  paginatedProducts,
  limit,
}: { paginatedProducts: Paginated<ProductVariant> } & {
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
      <div className={"grid gap-2"}>
        <div className="grid grid-cols-2 gap-x-1 gap-y-3 px-2 py-6 bg-telegram-bg-color">
          {products?.map((product) => (
            <CatalogProduct key={product.id} product={product} />
          ))}
        </div>
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
