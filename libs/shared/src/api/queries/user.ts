import {
  customerDetailFragment,
  customerPaginatedFragment,
} from "../fragments";

export const customerDetailQuery = /* GraphQL */ `
  query CustomerDetail($storeId: UUID!, $userId: UUID!) {
    customerDetail(storeId: $storeId, userId: $userId) {
      ...UserDetailFields
    }
  }
  ${customerDetailFragment}
`;

export const customerPaginatedQuery = /* GraphQL */ `
  query CustomersPaginated(
    $storeId: UUID!
    $page: Int
    $limit: Int
    $sortBy: String
  ) {
    customersPaginated(
      storeId: $storeId
      page: $page
      limit: $limit
      sortBy: $sortBy
    ) {
      ...CustomerPaginatedFields
    }
  }
  ${customerPaginatedFragment}
`;
