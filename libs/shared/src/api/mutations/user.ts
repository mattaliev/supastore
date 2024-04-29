import { cartFragment, userFragment } from "../fragments";

export const registerUserMutation = /* GraphQL */ `
  mutation RegisterUser($input: RegisterUserInput!, $cartId: UUID) {
    register(userInput: $input, cartId: $cartId) {
      user {
        ...UserFields
      }
      cart {
        ...CartFields
      }
    }
  }
  ${userFragment}
  ${cartFragment}
`;
