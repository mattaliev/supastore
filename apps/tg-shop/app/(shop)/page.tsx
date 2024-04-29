import { EntityState, productsPaginatedGet } from "@ditch/lib";

import Catalog from "@/components/product/product-catalog";

const defaultLimit = 20;

type CatalogPageProps = {
  searchParams: {
    state?: "ACTIVE" | "INACTIVE";
    page?: string;
    limit?: string;
  };
};

const CatalogPage = async ({ searchParams }: CatalogPageProps) => {
  const paginatedProducts = await productsPaginatedGet({
    state: EntityState[searchParams.state as keyof typeof EntityState],
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    limit: searchParams.limit ? parseInt(searchParams.limit) : defaultLimit,
  });

  return <Catalog paginatedProducts={paginatedProducts} limit={defaultLimit} />;
};

export default CatalogPage;
