import { shippingDetailsFragment } from "@/lib/api/fragments/shipping";

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
