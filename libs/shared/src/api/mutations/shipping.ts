import { shippingDetailsFragment, shippingFragment } from "../fragments";

export const shippingAddTrackingMutation = /* GraphQL */ `
  mutation shippingAddTracking($input: ShippingAddTrackingInput!) {
    shippingAddTracking(input: $input) {
      shipping {
        ...ShippingFields
      }
    }
  }
  ${shippingFragment}
`;

export const shippingDetailsCreateMutation = /* GraphQL */ `
  mutation ShippingDetailsCreate($input: ShippingDetailsCreateInput!) {
    shippingDetailsCreate(input: $input) {
      shippingDetails {
        ...ShippingDetailsFields
      }
    }
  }
  ${shippingDetailsFragment}
`;

export const shippingDetailsUpdateMutation = /* GraphQL */ `
  mutation ShippingDetailsUpdate($input: ShippingDetailsUpdateInput!) {
    shippingDetailsUpdate(input: $input) {
      shippingDetails {
        ...ShippingDetailsFields
      }
    }
  }
  ${shippingDetailsFragment}
`;

export const shippingAddressCreateMutation = /* GraphQL */ `
  mutation ShippingAddressCreate($input: ShippingAddressCreateInput!) {
    shippingAddressCreate(input: $input) {
      shippingAddress {
        id
        address
        additionalInfo
        created
        updated
      }
    }
  }
`;

export const shippingAddressDefaultSetMutation = /* GraphQL */ `
  mutation ShippingAddressDefaultSet(
    $storeId: UUID!
    $shippingAddressId: UUID!
  ) {
    shippingAddressDefaultSet(
      storeId: $storeId
      shippingAddressId: $shippingAddressId
    ) {
      shippingAddress {
        id
        address
        additionalInfo
        created
        updated
      }
    }
  }
`;

export const shippingAddressDeleteMutation = /* GraphQL */ `
  mutation ShippingAddressDelete($shippingAddressId: UUID!) {
    shippingAddressDelete(shippingAddressId: $shippingAddressId) {
      success
    }
  }
`;

export const contactInformationCreateMutation = /* GraphQL */ `
  mutation ContactInformationCreate($input: ContactInformationCreateInput!) {
    contactInformationCreate(input: $input) {
      contactInformation {
        id
        name
        email
        phone
        created
        updated
      }
    }
  }
`;

export const contactInformationDefaultSetMutation = /* GraphQL */ `
  mutation ContactInformationDefaultSet(
    $storeId: UUID!
    $contactInformationId: UUID!
  ) {
    contactInformationDefaultSet(
      storeId: $storeId
      contactInformationId: $contactInformationId
    ) {
      contactInformation {
        id
        name
        email
        phone
        created
        updated
      }
    }
  }
`;

export const contactInformationDeleteMutation = /* GraphQL */ `
  mutation ContactInformationDelete($contactInformationId: UUID!) {
    contactInformationDelete(contactInformationId: $contactInformationId) {
      success
    }
  }
`;
