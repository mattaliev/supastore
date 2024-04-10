import { useInvoice } from "@tma.js/sdk-react";

export default function TelegramInvoice() {
  const invoice = useInvoice();
  invoice.isOpened;
}
