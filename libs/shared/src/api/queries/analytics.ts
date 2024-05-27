import { salesAnalyticsFragment } from "../fragments";

export const salesAnalyticsGetQuery = /* GraphQL */ `
  query SalesAnalyticsGet($storeId: UUID!) {
    salesAnalyticsGet(storeId: $storeId) {
      ...SalesAnalyticsOrderFields
    }
  }
  ${salesAnalyticsFragment}
`;
