import { cartFragment } from "../fragments";

export const cartGetQuery = /* GraphQL */ `
  query GetCart($cartId: UUID!, $storeId: UUID!) {
    cartGet(cartId: $cartId, storeId: $storeId) {
      ...CartFields
    }
  }
  ${cartFragment}
`;
