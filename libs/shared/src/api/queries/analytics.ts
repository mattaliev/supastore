import { salesAnalyticsFragment } from "../fragments";

export const salesAnalyticsGetQuery = /* GraphQL */ `
  query SalesAnalyticsGet($storeId: UUID!) {
    salesAnalyticsGet(storeId: $storeId) {
      ...SalesAnalyticsOrderFields
    }
  }
  ${salesAnalyticsFragment}
`;

export const sessionAnalyticsByHourGetQuery = /* GraphQL */ `
  query SessionAnalyticsGet($storeId: UUID!, $date: String) {
    sessionAnalyticsByHourGet(storeId: $storeId, date: $date) {
      sessionCount
      sessionIncreasePercentage
      sessions {
        hour
        sessions
      }
    }
  }
`;
