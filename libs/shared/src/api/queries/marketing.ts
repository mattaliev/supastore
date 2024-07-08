import { manualMailingFragment } from "../fragments";

export const manualMailingListQuery = /* GraphQL */ `
  query ManualMailingList($storeId: UUID!) {
    manualMailingList(storeId: $storeId) {
      ...ManualMailingFields
    }
  }
  ${manualMailingFragment}
`;

export const manualMailingGetQuery = /* GraphQL */ `
  query ManualMailingGet($storeId: UUID!, $mailingId: UUID!) {
    manualMailingGet(storeId: $storeId, mailingId: $mailingId) {
      ...ManualMailingFields
    }
  }
  ${manualMailingFragment}
`;

export const manualMailingAudienceCountQuery = /* GraphQL */ `
  query ManualMailingAudienceCount($storeId: UUID!, $audiences: [String!]!) {
    manualMailingAudienceCount(storeId: $storeId, audiences: $audiences)
  }
`;
