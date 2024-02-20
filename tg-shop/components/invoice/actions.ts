"use server";

import { cookies } from "next/headers";

import { invoiceCreate } from "@/lib/api";

export type InvoiceCreateResponse = {
  error?: string;
  paymentLink?: string;
};

export const createInvoice = async (
  prevState: any,
): Promise<InvoiceCreateResponse> => {
  const orderId = cookies().get("orderId")?.value;
  const userId = cookies().get("userId")?.value;

  if (!orderId || !userId) {
    return { error: "Couldn't find order, try refreshing the page" };
  }

  try {
    const { paymentLink } = await invoiceCreate({
      userId,
      orderId,
    });
    return { paymentLink };
  } catch (e) {
    return { error: "Error creating invoice, try refreshing the page" };
  }
};
