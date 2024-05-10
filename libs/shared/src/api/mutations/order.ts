import { orderFragment } from "../fragments";

export const orderCreateMutation = /* GraphQL */ `
  mutation orderCreate($cartId: UUID!) {
    orderCreate(cartId: $cartId) {
      order {
        ...OrderFields
      }
    }
  }
  ${orderFragment}
`;

export const orderDeleteMutation = /* GraphQL */ `
  mutation orderDelete($orderId: UUID!) {
    orderDelete(orderId: $orderId) {
      success
    }
  }
`;

export const orderStatusUpdateMutation = /* GraphQL */ `
  mutation orderStatusUpdate($input: OrderStatusUpdateInput!) {
    orderStatusUpdate(input: $input) {
      order {
        ...OrderFields
      }
    }
  }
  ${orderFragment}
`;
