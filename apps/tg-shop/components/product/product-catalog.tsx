import { Paginated, ProductVariant } from "@ditch/lib";

import Pagination from "@/components/pagination";
import CatalogProduct from "@/components/product/product";

export default function Catalog({
  paginatedProducts,
  limit
}: { paginatedProducts: Paginated<ProductVariant> } & {
  limit: number;
}) {
  const {
    objects: products,
    hasNext,
    hasPrev,
    pages,
    page
  } = paginatedProducts;

  return (
    products && (
      <div className={"grid gap-6"}>
        <div className="grid grid-cols-2 gap-6 px-6 py-6 bg-telegram-bg-color">
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
