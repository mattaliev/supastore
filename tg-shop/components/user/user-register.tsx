"use client";
import { useInitData } from "@tma.js/sdk-react";
import { createContext, useEffect, useState } from "react";

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

  useEffect(() => {
    const authenticate = async () => {
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
