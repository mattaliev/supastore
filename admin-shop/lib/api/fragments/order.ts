import { userFragment } from "@/lib/api/fragments/user";
import { orderProductFragment } from "@/lib/api/fragments/product";
import { shippingFragment } from "@/lib/api/fragments/shipping";

export const orderItemFragment = /* GraphQL */ `
  fragment OrderItemFields on OrderItemType {
    id
    product {
      ...OrderProductFields
    }
    variant {
      id
      size
      color
      material
    }
    quantity
  }
  ${orderProductFragment}
`;

export const orderFragment = /* GraphQL */ `
  fragment OrderFields on OrderType {
    id
    orderNumber
    user {
      ...UserFields
    }
    shipping {
      ...ShippingFields
    }
    items {
      ...OrderItemFields
    }
    paymentStatus
    fulfilmentStatus
    totalAmount
    subtotalAmount
    deliveryAmount
    hasDefaultShippingDetails
    created
    updated
  }
  ${userFragment}
  ${shippingFragment}
  ${orderItemFragment}
`;

export const orderPaginatedFragment = /* GraphQL */ `
  fragment PaginatedOrdersFields on OrderPaginatedType {
    hasNext
    hasPrev
    page
    pages
    totalItems
    objects {
      ...OrderFields
    }
  }
  ${orderFragment}
`;
