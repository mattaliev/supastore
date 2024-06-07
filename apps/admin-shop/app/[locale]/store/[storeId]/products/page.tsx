import { EntityState, productsPaginatedGet } from "@ditch/lib";

import WithAuth, { WithAuthProps } from "@/components/auth/with-auth";
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

async function ProductListPage({
  params: { storeId },
  searchParams: { page: selectedPage, limit, state }
}: WithAuthProps<ProductListPageProps>) {
  const {
    objects: products,
    hasNext,
    hasPrev,
    pages,
    totalItems,
    page
  } = await productsPaginatedGet({
    storeId,
    state: EntityState[state as keyof typeof EntityState],
    page: selectedPage ? parseInt(selectedPage) : 1,
    limit: limit ? parseInt(limit) : defaultLimit
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

export default WithAuth<ProductListPageProps>(ProductListPage);
