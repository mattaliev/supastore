import { invoiceFragment } from "@/lib/api/fragments/invoice";

export const invoiceGetByOrderIdQuery = /* GraphQL */ `
  query invoiceGetByOrderId($orderId: UUID!) {
    invoiceGetByOrderId(orderId: $orderId) {
      ...InvoiceFields
    }
  }
  ${invoiceFragment}
`;
