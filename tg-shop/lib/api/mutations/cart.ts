import { cartFragment } from "@/lib/api/fragments/cart";

export const cartCreateMutation = /* GraphQL */ `
  mutation CartCreate {
    cartCreate {
      cart {
        ...CartFields
      }
    }
  }
  ${cartFragment}
`;

export const cartAddItemMutation = /* GraphQL */ `
  mutation CartAddItem($input: AddToCartInput!) {
    addToCart(input: $input) {
      cart {
        ...CartFields
      }
    }
  }
  ${cartFragment}
`;

export const cartRemoveItemMutation = /* GraphQL */ `
  mutation CartRemoveItem($input: RemoveFromCartInput!) {
    removeFromCart(input: $input) {
      cart {
        ...CartFields
      }
    }
  }
  ${cartFragment}
`;

export const cartUpdateItemMutation = /* GraphQL */ `
  mutation CartUpdateItemQuantity($input: CartItemUpdateInput!) {
    cartItemUpdate(input: $input) {
      cart {
        ...CartFields
      }
    }
  }
  ${cartFragment}
`;
