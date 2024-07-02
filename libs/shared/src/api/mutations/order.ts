import { orderFragment } from "../fragments";

export const orderCreateMutation = /* GraphQL */ `
  mutation orderCreate(
    $storeId: UUID!
    $cartId: UUID!
    $paymentMethodId: UUID!
  ) {
    orderCreate(
      storeId: $storeId
      cartId: $cartId
      paymentMethodId: $paymentMethodId
    ) {
      order {
        ...OrderFields
      }
      paymentProvider
      paymentInfo
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
