import { orderFragment } from "@/lib/api/fragments/order";

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
