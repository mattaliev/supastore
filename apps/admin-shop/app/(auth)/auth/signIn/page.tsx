"use client";

import { LoginButton } from "@telegram-auth/react";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignInPage() {
  const { data: session, status } = useSession();
  console.log(session, status);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="sm:mx-auto max-w-sm text-center mx-4 mb-40">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            You are trying to access DITCH Concept Store Admin page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <div className={"flex items-center justify-center my-2"}>
              <SignInWithTelegramButton status={status} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function SignInWithTelegramButton({ status }: { status: string }) {
  const { push } = useRouter();
  if (status === "loading") {
    return <LoaderCircle className="animate-spin" />;
  }

  if (status === "authenticated") {
    push("/");
  }

  return (
    <div>
      <LoginButton
        botUsername={"ditch_dev_bot"}
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
