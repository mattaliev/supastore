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

export const shippingFragment = /* GraphQL */ `
  fragment ShippingFields on ShippingType {
    id
    details {
      ...ShippingDetailsFields
    }
    shippingAmount
    carrier
    trackingNumber
  }
  ${shippingDetailsFragment}
`;
