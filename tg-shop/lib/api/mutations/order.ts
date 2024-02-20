import { orderFragment } from "@/lib/api/fragments/order";

export const orderCreateMutation = /* GraphQL */ `
  mutation orderCreate($cartId: UUID!, $userId: UUID) {
    orderCreate(cartId: $cartId, userId: $userId) {
      order {
        ...OrderFields
      }
    }
  }
  ${orderFragment}
`;
