"use server";

import {
  FulfilmentStatus,
  orderDelete,
  orderStatusUpdate,
  shippingAddTracking,
  TAGS,
} from "@ditch/lib";
import { revalidatePath, revalidateTag } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect, RedirectType } from "next/navigation";
import { getServerSession } from "next-auth";

import { authenticated, authOptions } from "@/auth";
import {
  ShippingTrackingFieldErrors,
  ShippingTrackingScheme,
} from "@/components/order/schemes";

export const deleteOrder = async (
  prevState: any,
  orderId: string
): Promise<{
  error?: string;
}> => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.accessToken) {
    redirect("/auth/signIn?callbackUrl=/orders", RedirectType.push);
  }

  try {
    await authenticated(session.user.accessToken, orderDelete, {
      orderId,
    });
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }

    return { error: "Could not delete order" };
  }

  revalidatePath("/orders");
  redirect("/orders", RedirectType.push);
};

export const updateOrderStatus = async (
  prevState: any,
  formData: FormData
): Promise<
  | {
      orderId: string;
      fulfilmentStatus?: FulfilmentStatus;
      error?: string;
    }
  | undefined
> => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.accessToken) {
    redirect("/auth/signIn?callbackUrl=/orders", RedirectType.push);
  }

  const { orderId, fulfilmentStatus } = prevState;
  const payload = {
    orderId,
    fulfilmentStatus,
    notifyCustomer: formData.get("notify-user") === "on",
  };

  try {
    await authenticated(session.user.accessToken, orderStatusUpdate, {
      input: payload,
    });
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }

    return {
      orderId,
      fulfilmentStatus,
      error: "Could not update order status",
    };
  }

  revalidateTag(TAGS.ORDER);
};

export const addShippingTracking = async (
  prevState: any,
  formData: FormData
): Promise<
  | {
      shippingId: string;
      formError?: string;
      fieldErrors?: ShippingTrackingFieldErrors;
    }
  | undefined
> => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.accessToken) {
    redirect("/auth/signIn?callbackUrl=/orders", RedirectType.push);
  }

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
    await authenticated(session.user.accessToken, shippingAddTracking, {
      input: validatedData.data,
    });
  } catch (e) {
    return {
      shippingId: prevState.shippingId,
      formError: "Could not add tracking number",
    };
  }

  revalidateTag(TAGS.ORDER);
};
