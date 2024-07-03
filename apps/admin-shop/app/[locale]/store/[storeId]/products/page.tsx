import { EntityState, productsPaginatedGet } from "@ditch/lib";

import WithAuth, { WithAuthProps } from "@/components/auth/with-auth";
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
  const entityState = EntityState[state as keyof typeof EntityState];
  const paginatedProducts = await productsPaginatedGet({
    storeId,
    state: entityState,
    page: selectedPage ? parseInt(selectedPage) : 1,
    limit: limit ? parseInt(limit) : defaultLimit
  });

  const { totalItems, page } = paginatedProducts;

  return (
    <>
      <ProductFilters />
      <ProductList
        paginatedProducts={paginatedProducts}
        state={entityState}
        page={page}
        limit={defaultLimit}
        totalProductCount={totalItems}
      />
    </>
  );
}

export default WithAuth<ProductListPageProps>(ProductListPage);
