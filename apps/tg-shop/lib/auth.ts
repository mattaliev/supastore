import { APIFunction } from "@ditch/lib";
import { redirect } from "next/navigation";

export const tmaAuthenticated = async <T, U>(
  initDataRaw: string,
  fn: APIFunction<T, U>,
  body: T
): Promise<U> => {
  const headers = { Authorization: `TWA ${initDataRaw}` };

  try {
    return fn(body, headers);
  } catch (error: any) {
    console.log(error);
    if (error.errorCode === 401) {
      redirect("/unauthenticated");
    }

    if (error.errorCode === 403) {
      redirect("/unauthorized");
    }

    throw error;
  }
};
