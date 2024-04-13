import {
  collectionProductFragment,
  productDetailFragment,
} from "@/lib/api/fragments/product";

export const productDetailQuery = /* GraphQL */ `
  query ProductDetail($id: UUID!) {
    productDetail(id: $id) {
      ...ProductDetailFields
    }
  }
  ${productDetailFragment}
`;

export const productsGetQuery = /* GraphQL */ `
  query ProductsGet {
    productsGet {
      ...CollectionProductFields
    }
  }
  ${collectionProductFragment}
`;
