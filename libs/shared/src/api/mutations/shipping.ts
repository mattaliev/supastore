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
