import { cartFragment } from "@/lib/api/fragments/cart";
import { userFragment } from "@/lib/api/fragments/user";

export const shippingDetailsFragment = /* GraphQL */ `
  fragment ShippingDetailsFields on ShippingDetailsType {
    id
    firstName
    lastName
    country
    city
    province
    address
    postcode
    phone
    email
  }
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
    shippingDetails {
      ...ShippingDetailsFields
    }
    orderStatus
    totalAmount
    subtotalAmount
    deliveryAmount
    hasDefaultShippingDetails
  }
  ${cartFragment}
  ${userFragment}
  ${shippingDetailsFragment}
`;
