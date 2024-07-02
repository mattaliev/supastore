export const parentCategoriesGetQuery = /* GraphQL */ `
  query ParentCategoriesGet($locale: String) {
    parentCategoriesGet(locale: $locale) {
      id
      nameEn
      nameRu
    }
  }
`;

export const subcategoriesGetQuery = /* GraphQL */ `
  query SubcategoriesGet($parentId: UUID, $search: String, $locale: String) {
    subcategoriesGet(parentId: $parentId, search: $search, locale: $locale) {
      id
      nameEn
      nameRu
    }
  }
`;

export const categoriesGetQuery = /* GraphQL */ `
  query CategoriesGet($locale: String, $parentId: UUID, $search: String) {
    categoriesGet(locale: $locale, parentId: $parentId, search: $search) {
      parentCategories {
        id
        nameEn
        nameRu
      }
      subcategories {
        id
        nameEn
        nameRu
      }
    }
  }
`;

export const categoryCharacteristicsGetQuery = /* GraphQL */ `
  query CategoryCharacteristicsGet($categoryId: UUID!) {
    categoryCharacteristicsGet(categoryId: $categoryId) {
      nameEn
      nameRu
      maxCount
      id
      required
      type
      unitNameEn
      unitNameRu
      wbId
      updated
      created
      state
    }
  }
`;

// export const categoryCharacteristicsGetQuery = /* GraphQL */ `;
//   query CategoryCharacteristicsGet($id: ID!) {
//     categoryCharacteristicsGet(id: $id) {
//       id
//       name
//       type
//       values
//     }
//   }
// `;
