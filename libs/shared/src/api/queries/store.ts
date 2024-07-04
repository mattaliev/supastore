import { storeCheckpoints, storeFragment } from "../fragments/store";

export const storeListQuery = /* GraphQL */ `
  query StoreList {
    storeList {
      ...StoreFields
    }
  }
  ${storeFragment}
`;

export const storeGetQuery = /* GraphQL */ `
  query StoreGet($storeId: UUID!) {
    storeGet(storeId: $storeId) {
      ...StoreFields
    }
  }
  ${storeFragment}
`;

export const storeTelegramStoreUrlGetQuery = /* GraphQL */ `
  query StoreTelegramStoreUrlGet($storeId: UUID!) {
    storeGet(storeId: $storeId) {
      telegramStoreUrl
    }
  }
`;

export const storeCheckpointsQuery = /* GraphQL */ `
  query StoreCheckpoints($storeId: UUID!) {
    storeGet(storeId: $storeId) {
      ...StoreCheckpoints
    }
  }
  ${storeCheckpoints}
`;

export const storeCanManageQuery = /* GraphQL */ `
  query StoreCanManage($storeId: UUID!) {
    canManageStore(storeId: $storeId)
  }
`;

export const storeLogoGetQuery = /* GraphQL */ `
  query StoreLogoGet($storeId: UUID!) {
    storeLogoGet(storeId: $storeId) {
      logoDark
      logoLight
    }
  }
`;

export const storeBotTokenGetQuery = /* GraphQL */ `
  query StoreBotTokenGet($storeId: UUID!) {
    storeBotTokenGet(storeId: $storeId)
  }
`;

export const storeBotUsernameGetQuery = /* GraphQL */ `
  query StoreBotUsernameGet($storeId: UUID!) {
    storeBotUsernameGet(storeId: $storeId)
  }
`;
