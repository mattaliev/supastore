import { EntityState, productsPaginatedGet } from "@ditch/lib";
import { notFound } from "next/navigation";

import { withErrorHandling } from "@/components/error-handling/withErrorHandling";
import Catalog from "@/components/product/product-catalog";

export const revalidate = 5;

const defaultLimit = 20;

type CatalogPageProps = {
  params: {
    storeId: string;
  };
  searchParams: {
    state?: "ACTIVE" | "INACTIVE";
    page?: string;
    limit?: string;
  };
};

const CatalogPage = async ({
  searchParams,
  params: { storeId },
}: CatalogPageProps) => {
  const paginatedProducts = await withErrorHandling(productsPaginatedGet)({
    storeId,
    state: EntityState.ACTIVE,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    limit: searchParams.limit ? parseInt(searchParams.limit) : defaultLimit,
  });

  if (!paginatedProducts) {
    notFound();
  }

  return <Catalog paginatedProducts={paginatedProducts} limit={defaultLimit} />;
};

export default CatalogPage;
