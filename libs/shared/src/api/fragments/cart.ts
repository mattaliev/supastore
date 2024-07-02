export const cartFragment = /* GraphQL */ `
  fragment CartFields on CartType {
    id
    totalPrice
    totalQuantity
    items {
      id
      quantity
      productVariant {
        id
        name
        images
      }
      size {
        id
        sizeEn
        sizeRu
        discountPrice
        price
      }
    }
  }
`;
