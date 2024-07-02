import {
  paginatedProductsFragment,
  productFragment,
  productVariantDetailFragment,
} from "../fragments";

export const productDetailQuery = /* GraphQL */ `
  query ProductDetail($id: UUID!) {
    productDetail(id: $id) {
      ...ProductVariantDetailFields
    }
  }
  ${productVariantDetailFragment}
`;

export const adminProductGetQuery = /* GraphQL */ `
  query AdminProductGet($id: UUID!) {
    adminProductGet(id: $id) {
      ...ProductFields
    }
  }
  ${productFragment}
`;

export const productsPaginatedGetQuery = /* GraphQL */ `
  query ProductsPaginatedGet(
    $storeId: UUID!
    $state: String
    $page: Int
    $limit: Int
  ) {
    productsPaginatedGet(
      storeId: $storeId
      state: $state
      page: $page
      limit: $limit
    ) {
      ...PaginatedProductsFields
    }
  }
  ${paginatedProductsFragment}
`;
