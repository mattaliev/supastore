export const manualMailingFragment = /* GraphQL */ `
  fragment ManualMailingFields on ManualMailingType {
    id
    name
    message
    audience
    ctaText
    ctaUrl
    userCount
    successfulSendCount
    sentAt
    status
    state
  }
`;
