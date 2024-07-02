export const shippingAddressListGetQuery = /* GraphQL */ `
  query shippingAddressListGet($storeId: UUID!) {
    shippingAddressListGet(storeId: $storeId) {
      id
      address
      additionalInfo
      created
      updated
    }
  }
`;

export const shippingAddressDefaultGetQuery = /* GraphQL */ `
  query shippingAddressDefaultGet($storeId: UUID!) {
    shippingAddressDefaultGet(storeId: $storeId) {
      id
      address
      additionalInfo
      created
      updated
    }
  }
`;

export const contactInformationListGetQuery = /* GraphQL */ `
  query contactInformationListGet($storeId: UUID!) {
    contactInformationListGet(storeId: $storeId) {
      id
      name
      email
      phone
      created
      updated
    }
  }
`;

export const contactInformationDefaultGetQuery = /* GraphQL */ `
  query contactInformationDefaultGet($storeId: UUID!) {
    contactInformationDefaultGet(storeId: $storeId) {
      id
      name
      email
      phone
      created
      updated
    }
  }
`;
