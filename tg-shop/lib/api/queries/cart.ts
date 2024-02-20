import { cartFragment } from "@/lib/api/fragments/cart";

export const cartGetQuery = /* GraphQL */ `
  query GetCart($cartId: UUID!) {
    cartGet(cartId: $cartId) {
      ...CartFields
    }
  }
  ${cartFragment}
`;
