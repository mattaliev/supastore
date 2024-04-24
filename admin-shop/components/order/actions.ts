"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import {
  orderDelete,
  orderStatusUpdate,
  shippingAddTracking,
  TAGS,
} from "@/lib/api";
import { FulfilmentStatus, PaymentStatus } from "@/lib/api/types";
import {
  ShippingTrackingFieldErrors,
  ShippingTrackingScheme,
} from "@/components/order/schemes";
import { redirect, RedirectType } from "next/navigation";

export const deleteOrder = async (
  prevState: any,
  orderId: string,
): Promise<{
  error?: string;
}> => {
  try {
    await orderDelete(orderId);
  } catch (e) {
    return { error: "Could not delete order" };
  }

  revalidatePath("/orders");
  redirect("/orders", RedirectType.push);
};

export const updateOrderStatus = async (
  prevState: any,
  formData: FormData,
): Promise<
  | {
      orderId: string;
      paymentStatus?: PaymentStatus;
      fulfilmentStatus?: FulfilmentStatus;
      error?: string;
    }
  | undefined
> => {
  const { orderId, paymentStatus, fulfilmentStatus } = prevState;
  const payload = {
    orderId,
    paymentStatus,
    fulfilmentStatus,
    notifyCustomer: formData.get("notify-user") === "on",
  };

  console.log(payload);

  try {
    await orderStatusUpdate(payload);
  } catch (e) {
    return {
      orderId,
      paymentStatus,
      fulfilmentStatus,
      error: "Could not update order status",
    };
  }

  revalidateTag(TAGS.ORDER);
};

export const addShippingTracking = async (
  prevState: any,
  formData: FormData,
): Promise<
  | {
      shippingId: string;
      formError?: string;
      fieldErrors?: ShippingTrackingFieldErrors;
    }
  | undefined
> => {
  const validatedData = ShippingTrackingScheme.safeParse({
    shippingId: prevState.shippingId,
    trackingNumber: formData.get("tracking-number") as string,
    carrier: formData.get("carrier") as string,
  });

  if (!validatedData.success) {
    return {
      shippingId: prevState.shippingId,
      fieldErrors: validatedData.error.flatten().fieldErrors,
    };
  }

  try {
    await shippingAddTracking(validatedData.data);
  } catch (e) {
    return {
      shippingId: prevState.shippingId,
      formError: "Could not add tracking number",
    };
  }

  revalidateTag(TAGS.ORDER);
};
