import React from "react";

import { getAccessToken } from "@/components/auth/get-token";

type BaseProps = {
  params?: Record<string, string>;
  searchParams?: Record<string, string>;
};

export type WithAuthProps<T> = T & {
  accessToken: string;
};

export default function WithAuth<Props extends BaseProps>(
  Component: React.ComponentType<Props & WithAuthProps<{}>>
) {
  async function Auth(props: Props) {
    const accessToken = await getAccessToken();

    return <Component accessToken={accessToken} {...props} />;
  }
  return Auth;
}
