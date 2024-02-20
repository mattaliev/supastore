import { cartFragment } from "@/lib/api/fragments/cart";
import { userFragment } from "@/lib/api/fragments/user";

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
