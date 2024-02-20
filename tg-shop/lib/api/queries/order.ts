import { orderFragment } from "@/lib/api/fragments/order";

export const orderGetByIdQuery = /* GraphQL */ `
  query orderGetById($orderId: UUID!) {
    orderGetById(orderId: $orderId) {
      ...OrderFields
    }
  }
  ${orderFragment}
`;

export const orderGetByCartIdQuery = /* GraphQL */ `
  query orderGetByCartId($cartId: UUID!) {
    orderGetByCartId(cartId: $cartId) {
      ...OrderFields
    }
  }
  ${orderFragment}
`;
