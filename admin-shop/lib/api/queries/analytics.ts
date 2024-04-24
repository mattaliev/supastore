import { salesAnalyticsFragment } from "@/lib/api/fragments/analytics";

export const salesAnalyticsGetQuery = /* GraphQL */ `
  query SalesAnalyticsGet {
    salesAnalyticsGet {
      ...SalesAnalyticsOrderFields
    }
  }
  ${salesAnalyticsFragment}
`;
