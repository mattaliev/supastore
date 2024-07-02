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

export const shippingAddressFragment = /* GraphQL */ `
  fragment ShippingAddressFields on ShippingAddressType {
    id
    address
    additionalInfo
    created
    updated
  }
`;

export const contactInformationFragment = /* GraphQL */ `
  fragment ContactInformationFields on ContactInformationType {
    id
    name
    email
    phone
    created
    updated
  }
`;

export const shippingFragment = /* GraphQL */ `
  fragment ShippingFields on ShippingType {
    id
    contactInfo {
      ...ContactInformationFields
    }
    shippingAddress {
      ...ShippingAddressFields
    }
    shippingAmount
    carrier
    trackingNumber
  }
  ${shippingAddressFragment}
  ${contactInformationFragment}
`;
