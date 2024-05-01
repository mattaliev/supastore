export const paymentMethodFragment = /* GraphQL */ `
  fragment PaymentMethodFields on PaymentMethodType {
    id
    name
    provider
    buttonText
    state
    created
    otherInfo
  }
`;

export const paymentFragment = /* GraphQL */ `
  fragment PaymentFields on PaymentType {
    id
    paymentMethod {
      ...PaymentMethodFields
    }
    paymentStatus
    subtotalAmount
    shippingAmount
    totalAmount
    currency
    transactionId
    paymentDate
    paymentExpiry
    additionalInfo
    created
    updated
    state
  }
  ${paymentMethodFragment}
`;
