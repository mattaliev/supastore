"use client";
import { LoginButton } from "@telegram-auth/react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function SignInWithTelegramButton({ status }: { status: string }) {
  const { push } = useRouter();

  if (status === "authenticated") {
    push("/");
  }

  return (
    <div>
      <LoginButton
        botUsername={process.env.NEXT_PUBLIC_BOT_USERNAME as string}
        onAuthCallback={(authData) => {
          signIn(
            "telegram",
            { callbackUrl: "https://tg.ditch.ngrok.app/" },
            authData as any
          );
        }}
        buttonSize="large" // "large" | "medium" | "small"
        cornerRadius={10} // 0 - 20
        showAvatar={false} // true | false
        lang="en"
      />
    </div>
  );
}
