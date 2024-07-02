import { cartFragment } from "./cart";
import { paymentFragment } from "./payment";
import { shippingFragment } from "./shipping";
import { customerFragment } from "./user";

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
    subtotalAmount
    shippingAmount
    totalAmount
    created
    updated
    state
  }
  ${customerFragment}
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
