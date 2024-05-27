import { collectionProductFragment } from "../fragments";

export const productCreateMutation = /* GraphQL */ `
  mutation ProductCreate($input: ProductCreateInput!) {
    productCreate(input: $input) {
      product {
        ...CollectionProductFields
      }
    }
  }
  ${collectionProductFragment}
`;

export const productUpdateMutation = /* GraphQL */ `
  mutation ProductUpdate($input: ProductUpdateInput!) {
    productUpdate(input: $input) {
      product {
        ...CollectionProductFields
      }
    }
  }
  ${collectionProductFragment}
`;

export const productDeleteMutation = /* GraphQL */ `
  mutation ProductDelete($id: UUID!, $storeId: UUID!) {
    productDelete(id: $id, storeId: $storeId) {
      success
    }
  }
`;
