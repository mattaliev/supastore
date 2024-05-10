import {
  customerDetailFragment,
  customerPaginatedFragment,
} from "../fragments";

export const customerDetailQuery = /* GraphQL */ `
  query CustomerDetail($userId: UUID!) {
    customerDetail(userId: $userId) {
      ...UserDetailFields
    }
  }
  ${customerDetailFragment}
`;

export const customerPaginatedQuery = /* GraphQL */ `
  query CustomersPaginated($page: Int, $limit: Int, $sortBy: String) {
    customersPaginated(page: $page, limit: $limit, sortBy: $sortBy) {
      ...CustomerPaginatedFields
    }
  }
  ${customerPaginatedFragment}
`;
