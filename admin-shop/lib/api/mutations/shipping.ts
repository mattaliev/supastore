import { shippingFragment } from "@/lib/api/fragments/shipping";

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
