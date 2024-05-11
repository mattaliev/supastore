"use client";

import { useSession } from "next-auth/react";

import { SignInWithTelegramButton } from "@/components/auth/sign-in-with-telegram";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export default function SignInPage() {
  const { status } = useSession();

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
