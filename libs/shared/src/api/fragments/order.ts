import { userFragment } from "./user";
import { shippingFragment } from "./shipping";
import { cartFragment } from "./cart";
import { paymentFragment } from "./payment";

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
    payment {
      ...PaymentFields
    }
    fulfilmentStatus
    hasDefaultShippingDetails
    subtotalAmount
    shippingAmount
    totalAmount
    created
    updated
    state
  }
  ${userFragment}
  ${shippingFragment}
  ${cartFragment}
  ${paymentFragment}
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
