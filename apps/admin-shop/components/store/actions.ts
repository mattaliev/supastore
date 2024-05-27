"use server";
import {
  storeApplicationCreate,
  storeConnectToTelegram,
  storeUpdate,
  TAGS
} from "@ditch/lib";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authenticated, authOptions } from "@/auth";
import {
  StoreApplicationScheme,
  StoreFieldErrors,
  StoreScheme
} from "@/components/store/schemes";

export const connectToTelegram = async (prevState: any, storeId: string) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.accessToken) {
    redirect("/auth/signIn");
  }

  try {
    const success = await authenticated(
      session.user.accessToken,
      storeConnectToTelegram,
      {
        storeId
      }
    );
  } catch (error) {
    console.error(error);
  }

  revalidateTag(TAGS.STORE);
};

export const updateStore = async (
  prevState: any,
  formData: FormData
): Promise<
  | {
      fieldErrors?: StoreFieldErrors;
      formError?: string;
    }
  | undefined
> => {
  const storeId = formData.get("store-id") as string;
  const session = await getServerSession(authOptions);

  if (!session || !session.user.accessToken) {
    redirect("/auth/signIn");
  }

  const validatedData = StoreScheme.safeParse({
    storeName: formData.get("store-name"),
    storeDescription: formData.get("store-description"),
    logoDark: formData.get("logo-dark"),
    logoLight: formData.get("logo-light"),
    botToken: formData.get("bot-token"),
    botUsername: formData.get("bot-username")
  });

  if (!validatedData.success) {
    return {
      fieldErrors: validatedData.error.flatten().fieldErrors
    };
  }

  try {
    const store = await authenticated(session.user.accessToken, storeUpdate, {
      input: {
        storeId,
        ...validatedData.data
      }
    });

    if (!store) throw new Error("Could not update store");
  } catch (error) {
    console.error(error);
    return { formError: "Could not update store" };
  }

  revalidateTag(TAGS.STORE);
};

export const createStoreApplication = async (
  prevState: any,
  formData: FormData
) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.accessToken) {
    redirect("/auth/signIn");
  }

  const validatedData = StoreApplicationScheme.safeParse({
    storeName: formData.get("store-name"),
    storeDescription: formData.get("store-description"),
    channels: formData.get("channels"),
    productCategory: formData.get("product-category")
  });

  if (!validatedData.success) {
    return {
      fieldErrors: validatedData.error.flatten().fieldErrors
    };
  }

  try {
    const storeApplication = await authenticated(
      session.user.accessToken,
      storeApplicationCreate,
      {
        input: {
          ...validatedData.data
        }
      }
    );

    if (!storeApplication) throw new Error("Could not create store");
  } catch (error) {
    console.error(error);
    return { formError: "Could not create store" };
  }

  revalidateTag(TAGS.STORE);
  redirect("/store/create/success");
};
