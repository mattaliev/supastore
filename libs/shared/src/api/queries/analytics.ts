import { salesAnalyticsFragment } from "../fragments";

export const salesAnalyticsGetQuery = /* GraphQL */ `
  query SalesAnalyticsGet {
    salesAnalyticsGet {
      ...SalesAnalyticsOrderFields
    }
  }
  ${salesAnalyticsFragment}
`;
