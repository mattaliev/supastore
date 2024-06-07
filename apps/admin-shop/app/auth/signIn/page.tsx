import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { SignInWithTelegramButton } from "@/components/auth/sign-in-with-telegram";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/en/store");
  }

  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
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
              <SignInWithTelegramButton />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
