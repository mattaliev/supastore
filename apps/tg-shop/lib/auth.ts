import { APIFunction } from "@ditch/lib";

import { withErrorHandling } from "@/components/error-handling/withErrorHandling";

export const tmaAuthenticated = async <T, U>(
  initDataRaw: string,
  storeId: string,
  fn: APIFunction<T, U>,
  body: T
): Promise<U | undefined> => {
  const headers = {
    Authorization: `TWA ${initDataRaw}`,
    "Store-Id": storeId
  };
  return withErrorHandling(fn)(body, headers);
};
