export const cartProductFragment = /* GraphQL */ `
  fragment CartProductFields on ProductType {
    id
    title
    price
    description
    images {
      order
      url
      id
    }
  }
`;

export const collectionProductFragment = /* GraphQL */ `
  fragment CollectionProductFields on ProductType {
    id
    title
    price
    description
    images {
      url
      id
    }
    variants {
      id
      size
      material
      color
      quantity
    }
    state
    created
  }
`;

export const productDetailFragment = /* GraphQL */ `
  fragment ProductDetailFields on ProductType {
    id
    title
    price
    description
    sku
    images {
      order
      url
      id
    }
    variants {
      id
      size
      material
      color
      quantity
    }
    state
    created
  }
`;
