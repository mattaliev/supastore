import { cartFragment, customerFragment } from "../fragments";

export const singInAdminMutation = /* GraphQL */ `
  mutation SignInAdmin($dataCheckString: String!) {
    signInAdmin(dataCheckString: $dataCheckString) {
      user {
        id
        role
        firstName
        lastName
      }
      accessToken
    }
  }
`;

export const signOutAdminMutation = /* GraphQL */ `
  mutation signOutAdmin($token: String!) {
    signOut(token: $token) {
      success
    }
  }
`;

export const signInShopUserMutation = /* GraphQL */ `
  mutation SignInShopUser($initDataRaw: String!, $cartId: UUID) {
    signInShopUser(initDataRaw: $initDataRaw, cartId: $cartId) {
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
