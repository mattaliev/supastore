"use server";

import {
  EntityState,
  orderCreate,
  orderGetByCartId,
  orderGetById,
  paymentCreate,
  PaymentProvider,
  ShippingDetails,
  shippingDetailsCreate,
  shippingDetailsUpdate,
  TAGS,
} from "@ditch/lib";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

import { tmaAuthenticated } from "@/lib/auth";

import { ShippingDetailsFieldErrors, ShippingDetailsScheme } from "./schemes";

export const createOrder = async (prevState: any): Promise<string | void> => {
  const cartId = cookies().get("cartId")?.value;
  const initDataRaw = cookies().get("initDataRaw")?.value;
  const orderId = cookies().get("orderId")?.value;

  if (!initDataRaw) {
    redirect("/unauthenticated");
  }

  if (!cartId) {
    return "No cart found";
  }

  let redirectPath = "/checkout/shipping";

  try {
    let order;

    if (orderId) {
      order = await tmaAuthenticated(initDataRaw, orderGetById, {
        orderId,
        state: EntityState.ACTIVE,
      });
    }

    if (!order) {
      order = await tmaAuthenticated(initDataRaw, orderGetByCartId, {
        cartId,
        state: EntityState.ACTIVE,
      });
    }

    if (!order) {
      order = await tmaAuthenticated(initDataRaw, orderCreate, {
        cartId,
      });
    }

    cookies().set("orderId", order.id);
    redirectPath = `/checkout/shipping?shippingId=${order.shipping.id}`;

    if (order.hasDefaultShippingDetails) {
      redirectPath = "/checkout/payment";
    }
  } catch (e) {
    console.error(e);
    return "Could not create order";
  }

  revalidateTag(TAGS.ORDER);
  redirect(redirectPath, RedirectType.push);
};

export type FormErrorResponse = {
  fieldErrors?: ShippingDetailsFieldErrors;
  formError?: string;
};

export const createOrUpdateShippingDetails = async (
  prevState: any,
  formData: FormData,
): Promise<FormErrorResponse> => {
  const initDataRaw = cookies().get("initDataRaw")?.value;
  const shippingId = formData.get("shipping-id") as string;

  if (!initDataRaw) {
    redirect("/unauthenticated");
  }

  if (!shippingId) {
    return { formError: "No shipping found" };
  }

  const validatedData = ShippingDetailsScheme.safeParse({
    firstName: formData.get("first-name") || "",
    lastName: formData.get("last-name") || "",
    email: formData.get("email") || undefined,
    phone: formData.get("phone") || undefined,
    address: formData.get("address") || "",
    country: formData.get("country") || "",
    city: formData.get("city") || "",
    province: formData.get("province") || "",
    postcode: formData.get("postcode") || "",
  });

  if (!validatedData.success) {
    return { fieldErrors: validatedData.error.flatten().fieldErrors };
  }

  const shippingDetailsId = String(formData.get("id"));

  try {
    if (shippingDetailsId) {
      await tmaAuthenticated(initDataRaw, shippingDetailsUpdate, {
        input: {
          ...(validatedData.data as ShippingDetails),
          shippingId,
          shippingDetailsId,
          isDefault: Boolean(formData.get("is-default")),
        },
      });
    } else {
      await tmaAuthenticated(initDataRaw, shippingDetailsCreate, {
        input: {
          ...(validatedData.data as ShippingDetails),
          shippingId,
          isDefault: Boolean(formData.get("is-default")),
        },
      });
    }
  } catch (e) {
    return { formError: "Could not create shipping details" };
  }

  revalidateTag(TAGS.ORDER);
  redirect("/checkout/payment", RedirectType.push);
};

export const createPayment = async (
  prevState: any,
  payload: {
    paymentMethodId: string;
    currency?: string;
  },
): Promise<{ success: boolean; paymentLink?: string; error?: string }> => {
  const orderId = cookies().get("orderId")?.value;
  const initDataRaw = cookies().get("initDataRaw")?.value;

  if (!initDataRaw) {
    redirect("/unauthenticated");
  }

  const { paymentMethodId, currency = "USD" } = payload;
  if (!orderId) {
    return { success: false, error: "No order found" };
  }

  const result = await tmaAuthenticated(initDataRaw, paymentCreate, {
    input: {
      orderId,
      paymentMethodId,
      currency,
    },
  });

  if (!result) {
    return { success: false, error: "Could not create payment" };
  }

  revalidateTag(TAGS.ORDER);
  revalidateTag(TAGS.CART);

  const { paymentInfo, provider } = result;

  if (
    provider === PaymentProvider.BANK_TRANSFER ||
    provider === PaymentProvider.CRYPTO_TRANSFER
  ) {
    return { success: true };
  }

  const parsedPaymentInfo = JSON.parse(paymentInfo);

  if (provider === PaymentProvider.TELEGRAM_INVOICE) {
    return {
      success: true,
      paymentLink: parsedPaymentInfo.payment_link,
    };
  }

  return {
    success: true,
    paymentLink: parsedPaymentInfo.direct_payment_link,
  };
};
