import { orderFragment } from "../fragments";

export const orderCreateMutation = /* GraphQL */ `
  mutation orderCreate($storeId: UUID!, $cartId: UUID!) {
    orderCreate(storeId: $storeId, cartId: $cartId) {
      order {
        ...OrderFields
      }
    }
  }
  ${orderFragment}
`;

export const orderDeleteMutation = /* GraphQL */ `
  mutation orderDelete($orderId: UUID!, $storeId: UUID!) {
    orderDelete(orderId: $orderId, storeId: $storeId) {
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
