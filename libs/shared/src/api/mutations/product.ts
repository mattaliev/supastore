import { productFragment } from "../fragments";

export const productCreateMutation = /* GraphQL */ `
  mutation ProductCreate($input: ProductCreateInput!) {
    productCreate(input: $input) {
      product {
        ...ProductFields
      }
    }
  }
  ${productFragment}
`;

export const productUpdateMutation = /* GraphQL */ `
  mutation ProductUpdate($input: ProductUpdateInput!) {
    productUpdate(input: $input) {
      product {
        ...ProductFields
      }
    }
  }
  ${productFragment}
`;

export const productVariantDeleteMutation = /* GraphQL */ `
  mutation ProductVariantDelete($id: UUID!, $storeId: UUID!) {
    productVariantDelete(id: $id, storeId: $storeId) {
      success
    }
  }
`;

export const productDeleteMutation = /* GraphQL */ `
  mutation ProductDelete($id: UUID!, $storeId: UUID!) {
    productDelete(id: $id, storeId: $storeId) {
      success
    }
  }
`;
