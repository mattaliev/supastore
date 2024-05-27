export const storeFragment = /* GraphQL */ `
  fragment StoreFields on StoreType {
    id
    storeName
    storeDescription
    botUsername
    logoDark
    logoLight
    storeUrl
    isConnectedToTelegram
    state
  }
`;

export const storeCheckpoints = /* GraphQL */ `
  fragment StoreCheckpoints on StoreType {
    hasProducts
    isConnectedToTelegram
    hasBotToken
    hasConnectedPaymentSystem
  }
`;
