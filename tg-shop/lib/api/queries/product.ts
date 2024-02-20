import { collectionProductFragment } from "@/lib/api/fragments/product";

export const productsGetQuery = /* GraphQL */ `
  query ProductsGet {
    productsGet {
      ...CollectionProductFields
    }
  }
  ${collectionProductFragment}
`;
