"use client";
import { LoginButton } from "@telegram-auth/react";
import { signIn } from "next-auth/react";

export function SignInWithTelegramButton() {
  return (
    <div>
      <LoginButton
        botUsername={process.env.NEXT_PUBLIC_BOT_USERNAME as string}
        onAuthCallback={(authData) => {
          signIn("telegram", {}, authData as any);
        }}
        buttonSize="large" // "large" | "medium" | "small"
        cornerRadius={10} // 0 - 20
        showAvatar={false} // true | false
        lang="en"
      />
    </div>
  );
}
