export const catalogProductVariantFragment = /* GraphQL */ `
  fragment CatalogProductVariantFields on ProductVariantType {
    id
    name
    sizes {
      id
      sizeEn
      sizeRu
      price
    }
    state
    images
    sku
    brand
    created
    productLink
  }
`;

export const productVariantDetailFragment = /* GraphQL */ `
  fragment ProductVariantDetailFields on ProductVariantType {
    ...CatalogProductVariantFields
    brand
    description
    shortDescription
    productCharacteristics {
      value
      characteristic {
        id
        nameEn
        nameRu
        unitNameEn
        unitNameRu
        type
      }
    }
    product {
      variants {
        images
        name
        id
      }
      category {
        nameEn
        nameRu
        id
      }
    }
    name
  }
  ${catalogProductVariantFragment}
`;

export const productFragment = /* GraphQL */ `
  fragment ProductFields on ProductType {
    category {
      nameEn
      nameRu
      id
    }
    id
    variants {
      ...ProductVariantDetailFields
    }
  }
  ${productVariantDetailFragment}
`;

export const paginatedProductsFragment = /* GraphQL */ `
  fragment PaginatedProductsFields on ProductPaginatedType {
    hasNext
    hasPrev
    page
    pages
    totalItems
    objects {
      ...CatalogProductVariantFields
    }
  }
  ${catalogProductVariantFragment}
`;
