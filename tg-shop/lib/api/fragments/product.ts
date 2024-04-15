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
