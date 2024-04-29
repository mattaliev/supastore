import { paymentMethodFragment } from "../fragments";

export const paymentMethodCreateMutation = /* GraphQL */ `
  mutation PaymentMethodCreate($input: PaymentMethodCreateInput!) {
    paymentMethodCreate(input: $input) {
      ...PaymentMethodFields
    }
  }
  ${paymentMethodFragment}
`;

export const paymentMethodUpdateMutation = /* GraphQL */ `
  mutation PaymentMethodUpdate($input: PaymentMethodUpdateInput!) {
    paymentMethodUpdate(input: $input) {
      ...PaymentMethodFields
    }
  }
  ${paymentMethodFragment}
`;

export const paymentMethodDeleteMutation = /* GraphQL */ `
  mutation PaymentMethodDelete($input: PaymentMethodDeleteInput!) {
    paymentMethodDelete(input: $input) {
      success
    }
  }
`;

export const paymentCreateMutation = /* GraphQL */ `
  mutation PaymentCreate($input: PaymentCreateInput!) {
    paymentCreate(input: $input) {
      paymentInfo
      provider
    }
  }
`;

export const paymentStatusUpdateMutation = /* GraphQL */ `
  mutation PaymentStatusUpdate($input: PaymentStatusUpdateInput!) {
    paymentStatusUpdate(input: $input) {
      success
    }
  }
`;
