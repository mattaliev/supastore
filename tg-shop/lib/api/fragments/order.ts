import { cartFragment } from "@/lib/api/fragments/cart";
import { userFragment } from "@/lib/api/fragments/user";
import { shippingFragment } from "@/lib/api/fragments/shipping";
import { orderProductFragment } from "@/lib/api/fragments/product";

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
    cart {
      ...CartFields
    }
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
  ${cartFragment}
  ${orderItemFragment}
`;
