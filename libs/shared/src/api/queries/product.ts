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
  query ProductsGet($state: String) {
    productsGet(state: $state) {
      ...CollectionProductFields
    }
  }
  ${collectionProductFragment}
`;

export const productsPaginatedGetQuery = /* GraphQL */ `
  query ProductsPaginatedGet($state: String, $page: Int, $limit: Int) {
    productsPaginatedGet(state: $state, page: $page, limit: $limit) {
      ...PaginatedProductsFields
    }
  }
  ${paginatedProductsFragment}
`;
