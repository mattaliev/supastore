import { invoiceFragment } from "@/lib/api/fragments/invoice";

export const invoiceCreateMutation = /* GraphQL */ `
  mutation invoiceCreate($input: InvoiceCreateInput!) {
    invoiceCreate(input: $input) {
      invoice {
        ...InvoiceFields
      }
    }
  }
  ${invoiceFragment}
`;
