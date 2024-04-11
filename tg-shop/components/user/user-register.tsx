"use client";
import { retrieveLaunchData } from "@tma.js/sdk";
import { useInitData } from "@tma.js/sdk-react";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

import { getPath } from "@/lib/path";

const AuthContext = createContext<{ authenticated: boolean }>({
  authenticated: false,
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authenticated, setAuthenticated] = useState(false);
  const initData = useInitData();
  const { launchParams, isPageReload } = retrieveLaunchData();
  const router = useRouter();

  useEffect(() => {
    const authenticate = async () => {
      if (isPageReload) return;

      if (launchParams.startParam) {
        const path = getPath(launchParams.startParam);
        router.push(path);
      }

      if (!initData) return;

      if (!initData.user?.id) {
        throw new Error("Telegram user id is required to authenticate user");
      }

      if (authenticated) return;

      try {
        const register = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            telegramId: initData.user.id,
            username: initData.user.username,
            firstName: initData.user.firstName,
            lastName: initData.user.lastName,
            isBot: initData.user.isBot,
            allowsNotifications: initData.user.allowsWriteToPm,
            photoUrl: initData.user.photoUrl,
            languageCode: initData.user.languageCode,
            chatId: initData.chat?.id,
          }),
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
