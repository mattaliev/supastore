import { cartFragment, customerFragment } from "../fragments";

export const singInAdminMutation = /* GraphQL */ `
  mutation SignInAdmin($dataCheckString: String!) {
    signInAdmin(dataCheckString: $dataCheckString) {
      user {
        id
        firstName
        lastName
        photoUrl
        username
      }
      accessToken
    }
  }
`;

export const signOutAdminMutation = /* GraphQL */ `
  mutation signOutAdmin($token: String!) {
    signOutAdmin(token: $token) {
      success
    }
  }
`;

export const signInShopUserMutation = /* GraphQL */ `
  mutation SignInShopUser(
    $storeId: UUID!
    $initDataRaw: String!
    $cartId: UUID
  ) {
    signInShopUser(
      storeId: $storeId
      initDataRaw: $initDataRaw
      cartId: $cartId
    ) {
      user {
        ...UserFields
      }
      cart {
        ...CartFields
      }
    }
  }
  ${customerFragment}
  ${cartFragment}
`;
