import { cartFragment } from "../fragments";

export const cartGetQuery = /* GraphQL */ `
  query GetCart($cartId: UUID!, $storeId: UUID!) {
    cartGet(cartId: $cartId, storeId: $storeId) {
      ...CartFields
    }
  }
  ${cartFragment}
`;

export const cartGetByUserIdQuery = /* GraphQL */ `
  query GetCartByUserId($storeId: UUID!) {
    cartGetByUserId(storeId: $storeId) {
      ...CartFields
    }
  }
  ${cartFragment}
`;
