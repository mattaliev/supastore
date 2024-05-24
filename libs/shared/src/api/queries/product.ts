import {
  collectionProductFragment,
  paginatedProductsFragment,
  productDetailFragment,
} from "../fragments";

export const productDetailQuery = /* GraphQL */ `
  query ProductDetail($id: UUID!) {
    productDetail(id: $id) {
      ...ProductDetailFields
    }
  }
  ${productDetailFragment}
`;

export const productsGetQuery = /* GraphQL */ `
  query ProductsGet($storeId: UUID!, $state: String) {
    productsGet(storeId: $storeId, state: $state) {
      ...CollectionProductFields
    }
  }
  ${collectionProductFragment}
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
