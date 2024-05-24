import { EntityState, productsPaginatedGet } from "@ditch/lib";

import Pagination from "@/components/pagination";
import ProductFilters from "@/components/product/product-filters";
import ProductList from "@/components/product/product-list";

type ProductListPageProps = {
  params: {
    storeId: string;
  };
  searchParams: {
    state?: "ACTIVE" | "INACTIVE";
    page?: string;
    limit?: string;
  };
};

export const dynamic = "force-dynamic";

const defaultLimit = 10;

export default async function ProductListPage({
  params,
  searchParams
}: ProductListPageProps) {
  const storeId = params.storeId;

  const {
    objects: products,
    hasNext,
    hasPrev,
    pages,
    totalItems,
    page
  } = await productsPaginatedGet({
    storeId,
    state: EntityState[searchParams.state as keyof typeof EntityState],
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    limit: searchParams.limit ? parseInt(searchParams.limit) : defaultLimit
  });

  return (
    <>
      <ProductFilters storeId={storeId} />
      <ProductList
        storeId={storeId}
        products={products}
        page={page}
        limit={defaultLimit}
        totalProductCount={totalItems}
      />
      <Pagination
        page={page}
        totalPages={pages}
        limit={defaultLimit}
        hasNext={hasNext}
        hasPrev={hasPrev}
      />
    </>
  );
}
