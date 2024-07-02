"use client";

import { isPageReload } from "@tma.js/sdk";
import { useLaunchParams } from "@tma.js/sdk-react";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

import { locales } from "@/components/i18n/i18n";
import { usePathname, useRouter } from "@/components/i18n/i18n-navigation";
import { useStore } from "@/components/store/store-context";
import { getPath } from "@/lib/path";

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: Props) {
  return (
    <SessionProvider>
      <AuthWrapper>{children}</AuthWrapper>
    </SessionProvider>
  );
}

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const launchParams = useLaunchParams();
  const store = useStore();
  const pageReload = isPageReload();
  const { status, data } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const signInUser = async () => {
      if (status === "loading") return;

      if (pageReload && status === "authenticated") return;

      if (launchParams.initDataRaw) {
        let callbackUrl = `/en/store/${store}`;

        if (launchParams.startParam) {
          const path = getPath(launchParams.startParam);
          callbackUrl = `${callbackUrl}${path}`;
        }
        await signIn("telegram", {
          storeId: store,
          initDataRaw: launchParams.initDataRaw,
          callbackUrl,
          redirect: false
        });
      }
    };

    signInUser();
  }, [launchParams.initDataRaw, pageReload, status, store]);

  useEffect(() => {
    if (data && data.user.languageCode) {
      if (locales.includes(data.user.languageCode)) {
        router.push(pathname, { locale: data.user.languageCode });
      }
    }
  }, [data]);

  return children;
}
