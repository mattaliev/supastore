import { cartProductFragment } from "./product";

export const cartFragment = /* GraphQL */ `
  fragment CartFields on CartType {
    id
    totalPrice
    totalQuantity
    items {
      id
      quantity
      product {
        ...CartProductFields
      }
      variant {
        id
        size
        material
        color
      }
    }
  }
  ${cartProductFragment}
`;
