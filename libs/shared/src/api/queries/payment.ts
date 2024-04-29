import { paymentMethodFragment } from "../fragments";

export const paymentMethodsListQuery = /* GraphQL */ `
  query PaymentMethodsList($state: String) {
    paymentMethodsList(state: $state) {
      ...PaymentMethodFields
    }
  }
  ${paymentMethodFragment}
`;
