import { cartFragment } from "../fragments";

export const cartGetQuery = /* GraphQL */ `
  query GetCart($cartId: UUID!) {
    cartGet(cartId: $cartId) {
      ...CartFields
    }
  }
  ${cartFragment}
`;
