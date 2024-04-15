import ProductList from "@/components/product/product-list";
import ProductFilters from "@/components/product/product-filters";
import { productsPaginatedGet } from "@/lib/api";
import Pagination from "@/components/pagination";
import { EntityState } from "@/lib/api/types";

type ProductListPageProps = {
  searchParams: {
    state?: "ACTIVE" | "INACTIVE";
    page?: string;
    limit?: string;
  };
};

export const dynamic = "force-dynamic";

const defaultLimit = 10;

export default async function ProductListPage({
  searchParams,
}: ProductListPageProps) {
  const {
    objects: products,
    hasNext,
    hasPrev,
    pages,
    totalItems,
    page,
  } = await productsPaginatedGet({
    state: EntityState[searchParams.state as keyof typeof EntityState],
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    limit: searchParams.limit ? parseInt(searchParams.limit) : 10,
  });

  return (
    <>
      <ProductFilters />
      <ProductList
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
