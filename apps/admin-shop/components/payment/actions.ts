"use server";
import {
  paymentCreate,
  PaymentStatus,
  paymentStatusUpdate,
  TAGS,
} from "@ditch/lib";
import { revalidateTag } from "next/cache";

export const updatePaymentStatus = async (
  prevState: any,
  formData: FormData
): Promise<
  | {
      paymentId: string;
      paymentStatus?: PaymentStatus;
      error?: string;
    }
  | undefined
> => {
  const { paymentId, paymentStatus } = prevState;
  const payload = {
    paymentId,
    paymentStatus,
    notifyCustomer: formData.get("notify-user") === "on",
  };

  console.log(payload);

  try {
    await paymentStatusUpdate(payload);
  } catch (e) {
    return {
      paymentId,
      paymentStatus,
      error: "Could not update order status",
    };
  }

  revalidateTag(TAGS.ORDER);
};

export const createPaymentManually = async (
  prevState: any,
  formData: FormData
): Promise<
  | {
      orderId: string;
      error?: string;
    }
  | undefined
> => {
  const { orderId } = prevState;
  const paymentMethodId = formData.get("payment-method") as string;
  const notifyCustomer = formData.get("notify-customer") === "on";

  if (!paymentMethodId || paymentMethodId.length === 0) {
    return { orderId, error: "Please select a payment method" };
  }

  try {
    await paymentCreate({ orderId, paymentMethodId, notifyCustomer });
  } catch (e) {
    return { orderId, error: "Could not create payment" };
  }
  revalidateTag(TAGS.ORDER);
};
