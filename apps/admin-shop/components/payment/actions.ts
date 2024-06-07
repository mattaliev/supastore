"use server";
import {
  EntityState,
  paymentCreate,
  paymentMethodCreate,
  paymentMethodDelete,
  paymentMethodUpdate,
  PaymentProvider,
  PaymentStatus,
  paymentStatusUpdate,
  TAGS
} from "@ditch/lib";
import { revalidateTag } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";

import { authenticated } from "@/auth";
import { getAccessToken } from "@/components/auth/get-token";
import {
  BasePaymentMethodScheme,
  PaymentFieldErrors,
  PaymentSchemes
} from "@/components/payment/schemes";
import { getStoreId } from "@/components/store/helpers";

export const updatePaymentStatus = async (
  prevState: any,
  formData: FormData
): Promise<{ error?: string } | undefined> => {
  const accessToken = await getAccessToken();
  const storeId = getStoreId();
  const paymentId = formData.get("payment-id") as string;
  const paymentStatus = formData.get("payment-status") as PaymentStatus;

  const payload = {
    storeId,
    paymentId,
    paymentStatus,
    notifyCustomer: Boolean(formData.get("notify-user"))
  };

  try {
    await authenticated(accessToken, paymentStatusUpdate, {
      input: {
        ...payload
      }
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

export const createPaymentManually = async (
  prevState: any,
  formData: FormData
): Promise<{ error?: string } | undefined> => {
  const accessToken = await getAccessToken();

  const orderId = formData.get("order-id") as string;
  const paymentMethodId = formData.get("payment-method") as string;
  const notifyCustomer = formData.get("notify-customer") === "on";

  if (!paymentMethodId || paymentMethodId.length === 0) {
    return { error: "Please select a payment method" };
  }

  try {
    await authenticated(accessToken, paymentCreate, {
      input: {
        orderId,
        paymentMethodId,
        notifyCustomer
      }
    });
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }

    return { error: "Could not create payment" };
  }
  revalidateTag(TAGS.ORDER);
};

export const createPaymentMethod = async (
  prevState: any,
  formData: FormData
): Promise<
  | {
      success?: boolean;
      fieldErrors?: PaymentFieldErrors;
      formError?: string;
    }
  | undefined
> => {
  const accessToken = await getAccessToken();
  const storeId = getStoreId();

  const validationResults = validatePaymentMethodForm(formData);

  if (validationResults.error) {
    return { ...validationResults.error };
  }

  try {
    await authenticated(accessToken, paymentMethodCreate, {
      input: {
        storeId,
        ...validationResults.data
      }
    });
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }

    return { formError: "Could not create payment method" };
  }

  revalidateTag(TAGS.PAYMENT);
  return { success: true };
};

export const updatePaymentMethod = async (
  prevState: any,
  formData: FormData
): Promise<
  | {
      success?: boolean;
      fieldErrors?: PaymentFieldErrors;
      formError?: string;
    }
  | undefined
> => {
  const accessToken = await getAccessToken();
  const storeId = getStoreId();
  const paymentMethodId = formData.get("id") as string;

  if (!paymentMethodId) {
    return { formError: "Invalid payment method" };
  }

  const validationResults = validatePaymentMethodForm(formData);

  if (validationResults.error) {
    return { ...validationResults.error };
  }

  try {
    await authenticated(accessToken, paymentMethodUpdate, {
      input: {
        storeId,
        paymentMethodId,
        ...validationResults.data
      }
    });
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }

    return { formError: "Could not create payment method" };
  }

  revalidateTag(TAGS.PAYMENT);
  return { success: true };
};

export const deletePaymentMethod = async (
  prevState: any,
  paymentMethodId: string
): Promise<
  | {
      success?: boolean;
      error?: string;
    }
  | undefined
> => {
  const accessToken = await getAccessToken();
  const storeId = getStoreId();

  try {
    await authenticated(accessToken, paymentMethodDelete, {
      storeId,
      paymentMethodId
    });
  } catch (e) {
    return {
      success: false,
      error: "Could not delete payment method"
    };
  }

  revalidateTag(TAGS.PAYMENT);
  return { success: true };
};

const validatePaymentMethodForm = (formData: FormData) => {
  const formEntries = Object.fromEntries(formData);
  const baseData = BasePaymentMethodScheme.safeParse(formEntries);

  if (!baseData.success) {
    return { error: { fieldErrors: baseData.error.flatten().fieldErrors } };
  }

  const scheme = PaymentSchemes[baseData.data.provider as PaymentProvider];

  const validatedData = scheme.safeParse({
    ...formEntries
  });

  if (!validatedData.success) {
    return {
      error: { fieldErrors: validatedData.error.flatten().fieldErrors }
    };
  }

  const { name, provider, buttonText, state } = baseData.data;
  const otherInfo = JSON.stringify(validatedData.data);

  return {
    data: {
      name,
      provider: provider as PaymentProvider,
      buttonText,
      state: state as EntityState,
      otherInfo
    }
  };
};
