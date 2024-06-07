"use server";

import {
  FulfilmentStatus,
  orderDelete,
  orderStatusUpdate,
  shippingAddTracking,
  TAGS
} from "@ditch/lib";
import { revalidateTag } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";
import { RedirectType } from "next/navigation";

import { authenticated } from "@/auth";
import { getAccessToken } from "@/components/auth/get-token";
import storeRedirect from "@/components/navigation/redirect";
import revalidateStorePath from "@/components/navigation/revalidatePath";
import {
  ShippingTrackingFieldErrors,
  ShippingTrackingScheme
} from "@/components/order/schemes";
import { getStoreId } from "@/components/store/helpers";

export const deleteOrder = async (
  prevState: any,
  orderId: string
): Promise<
  | {
      error?: string;
    }
  | undefined
> => {
  const accessToken = await getAccessToken();
  const storeId = getStoreId();

  try {
    await authenticated(accessToken, orderDelete, { storeId, orderId });
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }

    return { error: "Could not delete order" };
  }

  await revalidateStorePath("/orders");
  storeRedirect(`/orders`, RedirectType.push);
};

export const updateOrderStatus = async (
  prevState: any,
  formData: FormData
): Promise<
  | {
      error?: string;
    }
  | undefined
> => {
  const accessToken = await getAccessToken();
  const storeId = getStoreId();
  const orderId = formData.get("order-id") as string;
  const fulfilmentStatus = formData.get(
    "fulfilment-status"
  ) as FulfilmentStatus;

  const payload = {
    orderId,
    fulfilmentStatus,
    notifyCustomer: Boolean(formData.get("notify-user")),
    storeId
  };

  try {
    await authenticated(accessToken, orderStatusUpdate, {
      input: payload
    });
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }

    return {
      error: "Could not update order status"
    };
  }

  revalidateTag(TAGS.ORDER);
};

export const addShippingTracking = async (
  prevState: any,
  formData: FormData
): Promise<
  | {
      formError?: string;
      fieldErrors?: ShippingTrackingFieldErrors;
    }
  | undefined
> => {
  const accessToken = await getAccessToken();
  const storeId = getStoreId();
  const shippingId = formData.get("shipping-id") as string;

  const validatedData = ShippingTrackingScheme.safeParse({
    storeId,
    shippingId,
    trackingNumber: formData.get("tracking-number") as string,
    carrier: formData.get("carrier") as string
  });

  if (!validatedData.success) {
    return {
      fieldErrors: validatedData.error.flatten().fieldErrors
    };
  }

  try {
    await authenticated(accessToken, shippingAddTracking, {
      input: validatedData.data
    });
  } catch (e) {
    return {
      formError: "Could not add tracking number"
    };
  }

  revalidateTag(TAGS.ORDER);
};
