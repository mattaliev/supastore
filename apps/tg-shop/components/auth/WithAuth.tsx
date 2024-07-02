import React from "react";

import { getInitDataRaw } from "@/components/auth/getInitDataRaw";

export type WithAuthProps<T> = T & {
  initDataRaw: string;
};

export default function WithAuth<Props extends {}>(
  Component: React.ComponentType<Props & WithAuthProps<{}>>
) {
  async function Auth(props: Props) {
    const initDataRaw = await getInitDataRaw();

    return <Component initDataRaw={initDataRaw} {...props} />;
  }
  return Auth;
}
