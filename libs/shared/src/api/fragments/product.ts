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

export const orderProductFragment = /* GraphQL */ `
  fragment OrderProductFields on ProductType {
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
    updated
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

export const paginatedProductsFragment = /* GraphQL */ `
  fragment PaginatedProductsFields on ProductPaginatedType {
    hasNext
    hasPrev
    page
    pages
    totalItems
    objects {
      ...CollectionProductFields
    }
  }
  ${collectionProductFragment}
`;
