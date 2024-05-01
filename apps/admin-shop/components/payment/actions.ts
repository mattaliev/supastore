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
  TAGS,
} from "@ditch/lib";
import { revalidateTag } from "next/cache";

import {
  BasePaymentMethodScheme,
  PaymentFieldErrors,
  PaymentSchemes,
} from "@/components/payment/schemes";

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
  const validationResults = validatePaymentMethodForm(formData);

  if (validationResults.error) {
    return validationResults.error;
  }

  try {
    await paymentMethodCreate({
      ...validationResults.data,
    });
  } catch (e) {
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
  const paymentMethodId = formData.get("id") as string;

  if (!paymentMethodId) {
    return { formError: "Invalid payment method" };
  }

  const validationResults = validatePaymentMethodForm(formData);

  if (validationResults.error) {
    return validationResults.error;
  }

  try {
    await paymentMethodUpdate({
      paymentMethodId,
      ...validationResults.data,
    });
  } catch (e) {
    return { formError: "Could not create payment method" };
  }

  revalidateTag(TAGS.PAYMENT);
  return { success: true };
};

export const deletePaymentMethod = async (
  prevState: any,
  paymentMethodId: string
) => {
  try {
    await paymentMethodDelete(paymentMethodId);
  } catch (e) {
    return { success: false, error: "Could not delete payment method" };
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
    ...formEntries,
  });

  if (!validatedData.success) {
    return {
      error: { fieldErrors: validatedData.error.flatten().fieldErrors },
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
      otherInfo,
    },
  };
};
