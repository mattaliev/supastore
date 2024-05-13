"use client";
import { isPageReload } from "@tma.js/sdk";
import { useInitData, useLaunchParams } from "@tma.js/sdk-react";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

import { getPath } from "@/lib/path";

const AuthContext = createContext<{ authenticated: boolean }>({
  authenticated: false
});

export default function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [authenticated, setAuthenticated] = useState(false);
  const initData = useInitData();
  const launchParams = useLaunchParams();
  const isReload = isPageReload();
  const router = useRouter();

  useEffect(() => {
    const authenticate = async () => {
      if (isReload) return;

      if (launchParams.startParam) {
        const path = getPath(launchParams.startParam);
        router.push(path);
      }

      if (authenticated) return;

      try {
        const register = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            initDataRaw: launchParams.initDataRaw
          })
        });

        if (register.status !== 200) {
          console.error("Failed to register user");
          console.error(register);
        } else {
          setAuthenticated(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    authenticate();
  }, [authenticated, initData]);

  return (
    <AuthContext.Provider value={{ authenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
