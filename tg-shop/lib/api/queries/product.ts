import { collectionProductFragment } from "@/lib/api/fragments/product";

export const productsGetQuery = /* GraphQL */ `
  query ProductsGet($state: String) {
    productsGet(state: $state) {
      ...CollectionProductFields
    }
  }
  ${collectionProductFragment}
`;
