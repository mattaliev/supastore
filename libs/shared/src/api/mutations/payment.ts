import { paymentMethodFragment } from "../fragments";

export const paymentMethodCreateMutation = /* GraphQL */ `
  mutation PaymentMethodCreate($input: PaymentMethodCreateInput!) {
    paymentMethodCreate(input: $input) {
      paymentMethod {
        ...PaymentMethodFields
      }
    }
  }
  ${paymentMethodFragment}
`;

export const paymentMethodUpdateMutation = /* GraphQL */ `
  mutation PaymentMethodUpdate($input: PaymentMethodUpdateInput!) {
    paymentMethodUpdate(input: $input) {
      paymentMethod {
        ...PaymentMethodFields
      }
    }
  }
  ${paymentMethodFragment}
`;

export const paymentMethodDeleteMutation = /* GraphQL */ `
  mutation PaymentMethodDelete($paymentMethodId: UUID!, $storeId: UUID!) {
    paymentMethodDelete(paymentMethodId: $paymentMethodId, storeId: $storeId) {
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
