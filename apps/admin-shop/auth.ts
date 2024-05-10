import { APIFunction } from "@ditch/lib";
import { redirect } from "next/navigation";

export const authenticated = async <T, U>(
  accessToken: string,
  fn: APIFunction<T, U>,
  body: T,
): Promise<U | undefined> => {
  const headers = { Authorization: `Bearer ${accessToken}` };

  try {
    const response = await fn(body, headers);
    return response;
  } catch (error: any) {
    if (error.errorCode === 401) {
      redirect("/auth/signIn");
    }

    if (error.errorCode === 403) {
      redirect("/auth/error?error=AccessDenied");
    }
  }
};
