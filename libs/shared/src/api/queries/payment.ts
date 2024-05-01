import { paymentMethodFragment, shopPaymentMethodFragment } from "../fragments";

export const paymentMethodsListQuery = /* GraphQL */ `
  query PaymentMethodsList($state: String) {
    paymentMethodsList(state: $state) {
      ...PaymentMethodFields
    }
  }
  ${paymentMethodFragment}
`;

export const shopPaymentMethodsListQuery = /* GraphQL */ `
  query ShopPaymentMethodsList($state: String) {
    paymentMethodsList(state: $state) {
      ...ShopPaymentMethodFields
    }
  }
  ${shopPaymentMethodFragment}
`;
