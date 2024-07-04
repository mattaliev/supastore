export const storeFragment = /* GraphQL */ `
  fragment StoreFields on StoreType {
    id
    storeName
    storeDescription
    storeTimezone
    botUsername
    logoDark
    logoLight
    storeUrl
    isConnectedToTelegram
    state
    telegramStoreUrl
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
