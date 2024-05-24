import { paymentMethodFragment, shopPaymentMethodFragment } from "../fragments";

export const paymentMethodsListQuery = /* GraphQL */ `
  query PaymentMethodsList($storeId: UUID!, $state: String) {
    paymentMethodsList(storeId: $storeId, state: $state) {
      ...PaymentMethodFields
    }
  }
  ${paymentMethodFragment}
`;

export const shopPaymentMethodsListQuery = /* GraphQL */ `
  query ShopPaymentMethodsList($storeId: UUID!, $state: String) {
    paymentMethodsList(storeId: $storeId, state: $state) {
      ...ShopPaymentMethodFields
    }
  }
  ${shopPaymentMethodFragment}
`;
