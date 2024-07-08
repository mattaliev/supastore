import { manualMailingFragment } from "../fragments";

export const manualMailingCreateMutation = /* GraphQL */ `
  mutation ManualMailingCreate($input: ManualMailingCreateInput!) {
    manualMailingCreate(input: $input) {
      manualMailing {
        ...ManualMailingFields
      }
    }
  }
  ${manualMailingFragment}
`;

export const manualMailingPreviewMutation = /* GraphQL */ `
  mutation ManualMailingPreview($input: ManualMailingPreviewInput!) {
    manualMailingPreview(input: $input) {
      success
    }
  }
`;

export const manualMailingSendMutation = /* GraphQL */ `
  mutation ManualMailingSend($storeId: UUID!, $mailingId: UUID!) {
    manualMailingSend(storeId: $storeId, mailingId: $mailingId) {
      manualMailing {
        ...ManualMailingFields
      }
    }
  }
  ${manualMailingFragment}
`;
