import { APIFunction } from "@ditch/lib";
import {
  AuthenticationError,
  NotFoundError,
  PermissionDeniedError
} from "@ditch/lib/dist/api/errors";
import { isNotFoundError } from "next/dist/client/components/not-found";
import { isRedirectError } from "next/dist/client/components/redirect";

import storeRedirect from "@/components/navigation/redirect";

export function withErrorHandling<T, U>(
  fn: APIFunction<T, U>
): APIFunction<T, U> {
  return async (body, headers) => {
    try {
      const response = await fn(body, headers);
      return response;
    } catch (error: any) {
      if (isRedirectError(error) || isNotFoundError(error)) throw error;

      if (error instanceof AuthenticationError) {
        return await storeRedirect("/unauthenticated");
      }

      if (error instanceof PermissionDeniedError) {
        return await storeRedirect("/unauthorized");
      }

      if (error instanceof NotFoundError) {
        return undefined;
      }

      throw error;
    }
  };
}
