import { storeFragment } from "../fragments/store";

export const storeConnectToTelegramMutation = /* GraphQL */ `
  mutation StoreConnectToTelegramMutation($storeId: UUID!) {
    storeConnectToTelegram(storeId: $storeId) {
      success
    }
  }
`;

export const storeUpdateMutation = /* GraphQL */ `
  mutation StoreUpdateMutation($input: StoreUpdateInputType!) {
    storeUpdate(input: $input) {
      store {
        ...StoreFields
      }
    }
  }
  ${storeFragment}
`;

export const storeApplicationCreateMutation = /* GraphQL */ `
  mutation StoreApplicationCreateMutation(
    $input: StoreApplicationCreateInput!
  ) {
    storeApplicationCreate(input: $input) {
      storeApplication {
        id
        storeName
        storeDescription
        channels
        productCategory
      }
    }
  }
`;

export const storeSupportBotCreateMutation = /* GraphQL */ `
  mutation StoreSupportBotCreate($input: StoreSupportBotCreateInput!) {
    storeSupportBotCreate(input: $input) {
      storeSupportBot {
        botUsername
        greetingMessage
        groupChatId
        messageThreadId
      }
    }
  }
`;

export const storeSupportBotUpdateMutation = /* GraphQL */ `
  mutation StoreSupportBotUpdate($input: StoreSupportBotUpdateInput!) {
    storeSupportBotUpdate(input: $input) {
      storeSupportBot {
        botUsername
        greetingMessage
        groupChatId
        messageThreadId
      }
    }
  }
`;
